const el: HTMLElement | null = document.getElementById('hoge2');
if(el) {
  const el2 = el;
  console.log('el', el);
}

console.log('body', document, document.body);

class App {
  private _audioContext: AudioContext;
  private _analyser: AnalyserNode;
  constructor() {
    this._audioContext = new window.AudioContext();
    this._analyser = this._audioContext.createAnalyser();
  }
}

class Student {
  fullName: string;
  constructor(public firstName: string, public lastName: string) {
    this.fullName = firstName + " " + lastName;
  }
}

interface Person {
  firstName: string;
  lastName: string;
}

function greeter(person: Person) {
  return 'hello'+person.firstName;
}

// let user = 'jane user';
// let user = 10;
let user = {firstName: 'jane', lastName: 'user'};

let user2: Person = new Student('ryo', 'nakabayashi');


console.log(greeter(user2));
// document.body.innerHTML = greeter(user2);
// let d = document.getElementById('hoge');
// d.innerHTML = greeter(user);
