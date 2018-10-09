import * as $ from 'jquery';
import './style.scss';
import * as _ from 'lodash';
import { TYPES, SETTINGS } from './config';
console.log('hoge', TYPES, SETTINGS);

// _.times(200, () => { console.log('hoge') });
// console.log();
/*
$(() => {
  $(document.body).html('hello');
});
 */

function step2freq (base, n) {
  return base * Math.pow(2, n / 12)
}

// box発声部分を作る
class State {
  buttonState
  bellowPushState
  reedState
  reeds
  map
  constructor(public setting, public ac) {
    // どのボタンが押されてるか？
    this.buttonState = {}
    this.map = {}
    for (let row in setting.layout) {
      for (let button of setting.layout[row]) {
        this.buttonState[button.key] = false
        this.map[button.key] = {'row': row, 'push': button.push, 'pull': button.pull}
      }
    }
    this.bellowPushState = false
    this.reedState = {}
    this.reeds = {}
    for (let row in setting.layout) {
      this.reedState[row] = {}
      this.reeds[row] = {}
      for (let button of setting.layout[row]) {
        this.reedState[row][button.push] = false;
        this.reedState[row][button.pull] = false;
        this.reeds[row][button.push] = new Reed(ac, step2freq(440.0, button.push));
        this.reeds[row][button.pull] = new Reed(ac, step2freq(440.0, button.pull));
      }
    }

    // ui部分
    const box = document.getElementById('box');
    for (let row in setting.layout) {
      console.log('append');
      const rowDom = document.createElement('div');
      rowDom.classList.add('row');
      for (let button of setting.layout[row]) {
        const bt = document.createElement('button');
        bt.classList.add('btn');
        bt.id = 'btn_'+row+'_'+button.key;
        bt.textContent = button.key;
        bt.onmousedown = () => {
          this.setButtonState(button.key, true);
          this.update();
        }
        bt.onmouseup = () => {
          this.setButtonState(button.key, false);
          this.update();
        }
        rowDom.appendChild(bt);
      }
      box.appendChild(rowDom);
    }
  }

  setBellowPushState(state: boolean) {
    this.bellowPushState = state;
  }
  setButtonState(key, state: boolean) {
    if(key in this.buttonState) {
      this.buttonState[key] = state;
      if(state === true) {
        const btn = document.getElementById('btn_'+this.map[key].row+'_'+key);
        btn.classList.add('active');
      } else {
        const btn = document.getElementById('btn_'+this.map[key].row+'_'+key);
        btn.classList.remove('active');
      }
    }
  }

  update() {
    // buttonState, bellowPushStateからreedStateを作る
    if (this.bellowPushState) {
      // push
      for (let key in this.buttonState) {
        const row = this.map[key].row;
        const push = this.map[key].push;
        const pull = this.map[key].pull;
        if(this.buttonState[key] === true) {
          this.reedState[row][push] = true;
          this.reedState[row][pull] = false;
        } else {
          this.reedState[row][push] = false;
          this.reedState[row][pull] = false;
        }
      }
    } else {
      // pull
      for (let key in this.buttonState) {
        const row = this.map[key].row;
        const push = this.map[key].push;
        const pull = this.map[key].pull;
        if(this.buttonState[key] === true) {
          this.reedState[row][pull] = true;
          this.reedState[row][push] = false;
        } else {
          this.reedState[row][push] = false;
          this.reedState[row][pull] = false;
        }
      }
    }
    // reedsを変更して音を出す
    for (let row in this.reedState) {
      for (let key in this.reedState[row]) {
        if(this.reedState[row][key] == true) {
          this.reeds[row][key].start();
        }else{
          this.reeds[row][key].stop();
        }
      }
    }
  }

  destroy () {
    // UIを消す
    const box = document.getElementById('box');
    while (box.firstChild) {
      box.removeChild(box.firstChild);
    }
    // イベントハンドラー周りを消す

  }
}

// 一つの音に対応
class Reed {
  osc
  constructor(public ac, public frequency: number) {
    this.osc = ac.createOscillator();
    this.osc.type = 'square';
    this.osc.type = 'sine';
    this.osc.frequency.value = frequency;
    this.osc.start();
  }
  start() {
    this.osc.connect(ac.destination);
  }
  stop() {
    this.osc.disconnect();
  }
}


// ボタンを押すサンプル
// const btn = document.getElementById('button');

const options:HTMLSelectElement = (document.getElementById('layoutType')) as HTMLSelectElement;
options.onchange = () => {
  console.log('options', options.selectedIndex, options.options[options.selectedIndex].value);
  const type = options.options[options.selectedIndex].value;
  states.destroy();
  states = new State(SETTINGS[type], ac);
}
for (let layoutType in TYPES) {
  console.log(layoutType);
  const option = document.createElement('option');
  option.value = TYPES[layoutType];
  console.log(SETTINGS[TYPES[layoutType]]);
  option.text = SETTINGS[TYPES[layoutType]].name
  options.appendChild(option);
}


const ac = new AudioContext();
let states = new State(SETTINGS[TYPES.CSHARPD], ac);
// keydown event
document.addEventListener('keydown', function(e) {
  if (e.key == 'q') {
    states.setBellowPushState(true);
    states.update();
  } else {
    states.setButtonState(e.key, true);
    states.update();
  }
})
document.addEventListener('keyup', function(e) {
  if (e.key === 'q') {
    states.setBellowPushState(false);
    states.update();
  } else {
    states.setButtonState(e.key, false);
    states.update();
  }
})

