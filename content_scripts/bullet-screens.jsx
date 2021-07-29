const TfCard = ({ tfData }) => {
  return html`<div class="card notranslate">
    <div style="flex: 1;padding: 8px;">
      <div class="card-row">
        <div style="font-size: 18px;font-weight: bold;">
          ${tfData.returnPhrase ? tfData.returnPhrase[0] : tfData.query}
        </div>
        <svg
          style="margin-left: 4px;margin-bottom: -3px;cursor: pointer;"
          t="1606215479613"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="1940"
          width="16"
          height="16"
          onClick=${(e) => {
             e.stopPropagation()
            var audioBlock = document.createElement('audio');
            audioBlock.setAttribute(
              'src',
              `https://dict.youdao.com/dictvoice?audio=${tfData.query}`
            );
            audioBlock.play();
            audioBlock.addEventListener('ended', function () {
              // console.log('声音播放完了');
            });
          }}
        >
          <path
            d="M552.96 152.064v719.872c0 16.11776-12.6976 29.184-28.3648 29.184a67.4816 67.4816 0 0 1-48.39424-20.64384l-146.8416-151.12192A74.5472 74.5472 0 0 0 275.8656 706.56h-25.3952C146.08384 706.56 61.44 619.45856 61.44 512s84.64384-194.56 189.0304-194.56h25.3952c20.0704 0 39.30112-8.192 53.47328-22.79424l146.8416-151.1424A67.4816 67.4816 0 0 1 524.61568 122.88C540.2624 122.88 552.96 135.94624 552.96 152.064z m216.96512 101.5808a39.936 39.936 0 0 1 0-57.42592 42.25024 42.25024 0 0 1 58.7776 0c178.4832 174.40768 178.4832 457.15456 0 631.56224a42.25024 42.25024 0 0 1-58.7776 0 39.936 39.936 0 0 1 0-57.40544 359.50592 359.50592 0 0 0 0-516.75136z m-103.38304 120.23808a39.7312 39.7312 0 0 1 0-55.23456 37.51936 37.51936 0 0 1 53.94432 0c104.30464 106.78272 104.30464 279.92064 0 386.70336a37.51936 37.51936 0 0 1-53.94432 0 39.7312 39.7312 0 0 1 0-55.23456c74.48576-76.288 74.48576-199.94624 0-276.23424z"
            p-id="1941"
            fill="#666"
          ></path>
        </svg>
        <span style="margin-left: 8px;color: #2796f8;">${tfData.basic&&tfData.basic['exam_type'] ? '[' + tfData.basic['exam_type'][0] + ']' : ''}</span>
      </div>

      <div class="flex: 1">
        <!-- 英标 -->
        ${tfData.basic && tfData.basic['uk-phonetic']
          ? html` <div>
              <div class="card-row">
                <span>英</span
                ><span style="color: #f00; margin-left: 2px"
                  >[${forPhonetic(tfData.basic['uk-phonetic'])}]</span
                >
              </div>
              <div class="card-row">
                <span>美</span
                ><span style="color: #f00; margin-left: 2px"
                  >[${forPhonetic(tfData.basic['us-phonetic'])}]</span
                >
              </div>
            </div>`
          : ''}
        <div style="height: 4px;"></div>
        ${tfData.basic
          ? tfData.basic.explains.map((it) => {
              return html`<div class="card-row">${it}</div>`;
            })
          : tfData.translation.map((it) => {
              return html`<div class="card-row">${it}</div>`;
            })}
      </div>
    </div>

    <style>
      .card {
        position: relative;
        font-size: 14px;
        color: #222;
        padding: 8px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
      }
      .card-row {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }
    </style>
  </div>`;
};

function makeBulletApp(
  root,
  { material, onOperate, destroy, autoAudio, bulletSpeed }
) {
  const App = () => {
    const ytlBulletRef = useRef();
    const ytlBulletContentRef = useRef();

    const [top, setTop] = useState(0);
    const [operated, setOperated] = useState(null);
    const [animationRunning, setAnimationRunning] = useState(true);
    const [isMore,setisMore] = useState(true);
    const [isDel,setisDel] = useState(false);

    const audioRef = useRef();

    useEffect(() => {
      const t =
        Math.random() * (document.documentElement.clientHeight - 250) + 32;
      setTop(t);
    }, []);

    useEffect(() => {
      const listenEnter = () => {
        if (audioRef.current) {
          audioRef.current.play().catch((e) => {
            console.error(e);
          });
        }
        setAnimationRunning(false);
      };
      const listenLeave = () => {
        // 注释下行可使鼠标离开后仍然静止，便于调试
        setAnimationRunning(true);
      };

      const listenAnimationiteration = async () => {
        // 每次动画结束后，就校验当前单词是否还在复习清单内（可能在其他地方被操作）
        await buttelScreens.updateButteList();
        const exist = buttelScreens.buttelList.some(
          (it) => it.text === material.text
        );
        if (exist) {
          if (operated) {
            destroy();
          } else {
            setTop(
              Math.random() * (document.documentElement.clientHeight - 150) + 32
            );
          }
        } else {
          destroy();
        }
      };

      ytlBulletContentRef.current.addEventListener('mouseenter', listenEnter);
      ytlBulletRef.current.addEventListener('mouseleave', listenLeave);
      ytlBulletRef.current.addEventListener(
        'animationiteration',
        listenAnimationiteration
      );
      return () => {
        ytlBulletContentRef.current.removeEventListener(
          'mouseenter',
          listenEnter
        );
        ytlBulletRef.current.removeEventListener('mouseleave', listenLeave);
        ytlBulletRef.current.removeEventListener(
          'animationiteration',
          listenAnimationiteration
        );
      };
    }, [operated, ytlBulletRef]);

    // let color = `#${Math.floor(Math.random() * (2 << 23)).toString(16)}`;
    return html`<div
      class="notranslate bluesea-bullet"
      translate="no"
      ref=${ytlBulletRef}
      style=${{
        ['-webkit-animation-play-state']: animationRunning
          ? 'running'
          : 'paused',
        ['box-shadow']: animationRunning
          ? 'none'
          : '0 0 8px rgba(0, 0, 0, 0.4)',
        background: animationRunning ? 'none' : '#fff',
        top,
      }}
    >
      ${autoAudio
        ? html`<audio
            style="display: none"
            src="https://dict.youdao.com/dictvoice?audio=${material.text}"
            ref=${audioRef}
            preload="true"
          ></audio>`
        : ''}
      <div
        style="margin: 0 auto;
          background: rgba(0, 0, 0, 0.7);
          padding: 0 8px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          display: inline-block;
          border-radius: 16px;
          color: #fff;"
        ref=${ytlBulletContentRef}
        onmouseup=${(e) => {
          if (e.button === 1 && material.addFrom) {
            window.open(material.addFrom, '_blank');
          }
        }}
      >
        <span style="color: #fff">${material.text}</span>
        <span
          style=${{
            paddingLeft: 2,
            color: operated === 'yes' ? '#61bd4f' : '#ff4d4f',
            display: operated ? 'inline-block' : 'none',
          }}
          >${material.translation}</span
        >
        <span title="查看来源" style=${{'text-align': 'center',color: 'rgb(39 150 248)','border-radius': '4px',padding: '4px 5px',cursor: 'pointer','user-select': 'none',display: animationRunning ? 'none':'inline'}}
         onClick=${()=>{
            if (material.addFrom) {
              window.open(material.addFrom+'#:~:text='+material.text, '_blank');
            }
          }}
        >^</span>
      </div>
      <span title="取消收藏" 
          onclick=${() => {
            if (material.text) {
              bluesea.delMaterial(material.text);
              setisDel(true);
            }
          }} 
          style=${{
        display: animationRunning ? 'none':'inline',
        'margin-left':'4px',
        cursor: 'pointer',
        color:'red'
      }}>${isDel?'ok':'🗑'}</span>
      <div
        style=${{
          alignItems: 'center',
          padding: '4px 2px;',
          marginTop: 4,
          display: animationRunning ? 'none' : operated ? 'flex' : 'none',
        }}
      >
      <div style=${{'box-shadow': 'rgba(0, 0, 0, 0.4) 0px 0px 8px',position: 'absolute',background: 'wheat',left: '200px',width: '120%', top: 0,display:isMore?'block':'none'}} >
        <${TfCard} tfData=${material.youdao} />
      </div>
        <div
          style="
            flex: 1;
            text-align: center;
            color: #fff;
            border-radius: 4px;
            padding: 4px;
            cursor: pointer;
            user-select: none;
            background: #0070f3;"
          onClick=${() => {
            setOperated(null);
            onOperate('revoke');
          }}
        >
          记错了，重来
        </div>
        <span style="text-align: center;color: rgb(123 119 119);border-radius: 4px;padding: 4px 5px;cursor: pointer;user-select: none;"
         onClick=${()=>{
          setisMore(!isMore);console.log('setismore = true');
          }}
        >?</span>
      </div>

      <div
        style=${{
          alignItems: 'center',
          padding: '4px 2px;',
          marginTop: 4,
          display: animationRunning ? 'none' : operated ? 'none' : 'flex',
        }}
      >
        <div
          style="
            flex: 1;
            text-align: center;
            color: #fff;
            border-radius: 4px;
            padding: 4px;
            cursor: pointer;
            user-select: none;
            background: #ff4d4f;"
          onClick=${() => {
            setOperated('no');
            onOperate(false);
          }}
        >
          不认识
        </div>
        <div style="width: 8px"></div>
        <div
          style="
            flex: 1;
            text-align: center;
            color: #fff;
            border-radius: 4px;
            padding: 4px;
            cursor: pointer;
            user-select: none;
            background: #61bd4f;"
          onClick=${() => {
            setOperated('yes');
            onOperate(true);
          }}
        >
          认识
        </div>
      </div>

      <style>
        .bluesea-bullet {
          position: fixed;
          text-align: center;
          left: 500px;
          width: 180px;
          z-index: 2147483647;
          border-radius: 4px;
          padding: 8px;
          animation: bluesea-bullet-animation ${bulletSpeed}s infinite linear 0s;
        }
        .bluesea-bullet,
        .bluesea-bullet > * {
          font-size: 14px;
        }

        @keyframes bluesea-bullet-animation {
          from {
            left: 100%;
            transform: translateX(0);
            transform: translate3d(0, 0, 0);
          }
          to {
            left: 0;
            transform: translate3d(-100%, 0, 0);
          }
        }
      </style>
    </div>`;
  };

  render(html`<${App} />`, root);
}

class ButtelScreens {
  timer = null;
  buttelList = [];
  config = {};

  async updateButteList() {
    const l = await bluesea.getNeedLearnList();
    // 过滤掉非学习清单中的单词
    this.buttelList = this.buttelList.filter((it) => {
      return l.some((a) => a.text === it.text);
    });
  }

  async getConfig() {
    return await bluesea.getConfig();
  }

  async getOneMaterial() {
    const list = await bluesea.getNeedLearnList();
    const l2 = list.filter((it) => {
      return !this.buttelList.some((a) => a.text === it.text);
    });
    return l2[0];
  }

  addButtel(material) {
    this.buttelList.push(material);
  }
  delButtel(material) {
    const i = this.buttelList.findIndex((it) => it.text === material.text);
    this.buttelList.splice(i, 1);
  }

  async makeBullet() {
    this.config = await this.getConfig();
    const material = await this.getOneMaterial();
    if (!material) {
      return;
    }
    if (this.buttelList.length > this.config['单词弹幕数量上限']) {
      return;
    }

    const buttelRoot = document.createElement('div');
    buttelRoot.classList.add('bluesea', 'bluesea-bullet-screens');
    // buttelRoot.style.userSelect = 'none';
    document.body.appendChild(buttelRoot);
    makeBulletApp(buttelRoot, {
      bulletSpeed: this.config['单词弹幕速度'] || 10, //可能存在未更新配置的用户，后续将删除默认值
      autoAudio: this.config['自动发音'],
      material,
      onOperate: async (flag) => {
        if (flag === 'revoke') {
          await bluesea.updateMaterialObj(material)
          this.addButtel(material)
          return 
        }

        if (flag) {
          bluesea.toLearnNext(material.text);
        } else {
          bluesea.toLearnBack(material.text);
        }
        this.delButtel(material);
      },
      destroy: () => {
        render(null, buttelRoot);
        buttelRoot.parentNode.removeChild(buttelRoot);
      },
    });
    await this.updateButteList();
    this.addButtel(material);
  }

  start() {
    if (
      !(document.visibilityState === 'visible' && window.self === window.top)
    ) {
      return;
    }
    this.focusFn = () => {
      if (this.timer) {
        return;
      }
      this.timer = setInterval(() => {
        this.makeBullet();
      }, 3000);
    };
    this.focusFn();
    window.addEventListener('focus', this.focusFn);

    this.blurFn = () => {
      this.clear();
    };
    window.addEventListener('blur', this.blurFn);
  }
  clear(full) {
    if (full) {
      window.removeEventListener('focus', this.focusFn);
      window.removeEventListener('blur', this.blurFn);
    }
    clearInterval(this.timer);
    this.timer = null;
    this.buttelList = [];
    // 注释以下3行，可禁用页面失去焦点后清除弹幕
    // document.querySelectorAll('.bluesea-bullet-screens').forEach((it) => {
    //   render(null, it);
    //   it.parentNode.removeChild(it);
    // });
  }
}

const buttelScreens = new ButtelScreens();

document.addEventListener('DOMContentLoaded', () => {
  funCtrl.run(
    '单词弹幕',
    () => {
      buttelScreens.start();
    },
    () => {
      buttelScreens.clear(true);
    }
  );
});
