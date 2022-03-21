import Page from './Page';
import '../../scss/layout/_2048.scss';

class twoZeroFourEight implements Page {
  private array2048 = ['','','','','','','','','','','','','','','',''];
  private previousTurnArray = ['','','','','','','','','','','','','','','',''];
  private continueAfter2048 = false;

  public async render(): Promise<string> { 
    const view = `
    <div class="box2048">
      <div class="field" id="field1"></div>
      <div class="field" id="field2"></div>
      <div class="field" id="field3"></div>
      <div class="field" id="field4"></div>
      <div class="field" id="field5"></div>
      <div class="field" id="field6"></div>
      <div class="field" id="field7"></div>
      <div class="field" id="field8"></div>
      <div class="field" id="field9"></div>
      <div class="field" id="field10"></div>
      <div class="field" id="field11"></div>
      <div class="field" id="field12"></div>
      <div class="field" id="field13"></div>
      <div class="field" id="field14"></div>
      <div class="field" id="field15"></div>
      <div class="field" id="field16"></div>
    </div>
    <div class="button start2048" id="start2048">Start</div>
    <div class="result2048" id="result2048" style="display:none">
        <p class="winner2048">Игра окончена.<br>Ваш результат:</p>
        <div class="button" id="new2048game">Новая игра</div>
    </div>
    <div class="get2048" id="get2048" style="display:none">
        <p class="winner2048">Вы достигли 2048!</p>
        <div class="button" id="new2048game2">Новая игра</div>
        <div class="button" id="continue2048">Продолжить</div>
    </div>
      `;
    return view;
  }

  private start2048(): void {
    this.continueAfter2048 = false;
    document.addEventListener('keydown', () => {this.getKey.bind(this)});
    (document.getElementById('start2048') as HTMLElement).classList.add('hide');
    this.createNumber();
    this.updFields();
    this.previousTurnArray = this.array2048.slice();
  }

  private updFields(): void {
    for (let i=0; i< this.array2048.length; i+=1) {
      (document.getElementById(`field${i+1}`)as HTMLElement).innerText = `${this.array2048[i]}`;
      (document.getElementById(`field${i+1}`)as HTMLElement).setAttribute('class',`field fieldColor${this.array2048[i]}`);
    }
  }

  private endGame(): void {
    let result = 0;
    for (let i=0; i<this.array2048.length; i+=1) {
      result += Number(this.array2048[i]);
    }
    (document.getElementById('result2048') as HTMLElement).innerHTML = `<p class="winner2048">Игра окончена.<br>Ваш результат: ${result}</p><div class="button" id="new2048game">Новая игра</div>`;
    (document.getElementById('result2048') as HTMLElement).setAttribute('style', 'disply: flex');
    (document.getElementById('new2048game') as HTMLElement).addEventListener('click', ()=>window.location.reload());
  }

  private get2048(): void {
    (document.getElementById('get2048') as HTMLElement).setAttribute('style', 'disply: flex');
    (document.getElementById('continue2048') as HTMLElement).addEventListener('click', ()=>{
      this.continueAfter2048 = true;
      (document.getElementById('get2048') as HTMLElement).setAttribute('style', 'display: none');
    });
  }

  private leftKey(): void {
    for (let i=0; i<4; i+=1) {
      if (this.array2048[4*i] === '' || this.array2048[4*i+1] === '' || this.array2048[4*i+2] === '' || this.array2048[4*i+3] === '') {
        const newArr = this.array2048.slice().splice(4*i,4).filter((el=>el!==''));
        this.array2048[4*i+3] = '';
        this.array2048[4*i+2] = newArr.length === 3 ? newArr[2] : '';
        this.array2048[4*i+1] = newArr.length >= 2 ? newArr[1] : '';
        this.array2048[4*i] = newArr.length >= 1 ? newArr[0] : '';
      }
      if (this.array2048[4*i] === this.array2048[4*i+1]) {
        if (this.array2048[4*i] !== '') {
          this.array2048[4*i] = (Number(this.array2048[4*i]) * 2).toString();
          this.array2048[4*i+1] = this.array2048[4*i+2];
          this.array2048[4*i+2] = this.array2048[4*i+3];
          this.array2048[4*i+3] = '';
        } else {
          if (this.array2048[4*i+2] === this.array2048[4*i+3]) {
            if (this.array2048[4*i+2] !== '') {
              this.array2048[4*i] = (Number(this.array2048[4*i+2]) * 2).toString();
              this.array2048[4*i+1] = '';
              this.array2048[4*i+2] = '';
              this.array2048[4*i+3] = '';
            } else {
              this.array2048[4*i] = '';
              this.array2048[4*i+1] = '';
              this.array2048[4*i+2] = '';
              this.array2048[4*i+3] = '';
            }
          } else {
            this.array2048[4*i] = this.array2048[4*i+2];
            this.array2048[4*i+1] = this.array2048[4*i+3];
            this.array2048[4*i+2] = '';
            this.array2048[4*i+3] = '';
          }
        }
      }
      if (this.array2048[4*i+1] === this.array2048[4*i+2]) {
        if (this.array2048[4*i+1] !== '') {
          this.array2048[4*i+1] = (Number(this.array2048[4*i+1]) * 2).toString();
          this.array2048[4*i+2] = this.array2048[4*i+3];
          this.array2048[4*i+3] = '';
        } else {
          this.array2048[4*i+1] = this.array2048[4*i+3];
          this.array2048[4*i+2] = '';
          this.array2048[4*i+3] = '';
        }
      }
      if (this.array2048[4*i+2] === this.array2048[4*i+3]) {
        if (this.array2048[4*i+2] !== '') {
          this.array2048[4*i+2] = (Number(this.array2048[4*i+2]) * 2).toString();
          this.array2048[4*i+3] = '';
        }
      }
    }
    this.updFields();
    if(this.array2048.toString() === this.previousTurnArray.toString()) {
      document.addEventListener('keydown', (e) => {this.getKey(e)}, {once:true});
      const emptyFields = this.array2048.map((el,i)=>el===''? i: -1).filter((el)=> el!==-1);
      if (emptyFields.length === 0 && this.isPossibleMoves() === 0) {
        this.endGame();
      }
    } else {
      setTimeout(()=> {
        this.createNumber();
        this.previousTurnArray = this.array2048.slice();
      },100)
    }
  }

  private downKey(): void {
    for (let i=0; i<4; i+=1) {
      if (this.array2048[i] === '' || this.array2048[i+4] === '' || this.array2048[i+8] === '' || this.array2048[i+12] === '') {
        const newArr = Array.from([this.array2048[i],this.array2048[i+4],this.array2048[i+8],this.array2048[i+12]]).filter((el=>el!==''));
        this.array2048[i] = '';
        this.array2048[i+4] = newArr.length === 3 ? newArr[newArr.length-3] : '';
        this.array2048[i+8] = newArr.length >= 2 ? newArr[newArr.length-2] : '';
        this.array2048[i+12] = newArr.length >= 1 ? newArr[newArr.length-1] : '';
      }
      if (this.array2048[i+12] === this.array2048[i+8]) {
        if (this.array2048[i+12] !== '') {
          this.array2048[i+12] = (Number(this.array2048[i+12]) * 2).toString();
          this.array2048[i+8] = this.array2048[i+4];
          this.array2048[i+4] = this.array2048[i];
          this.array2048[i] = '';
        } else {
          if (this.array2048[i+4] === this.array2048[i]) {
            if (this.array2048[i+4] !== '') {
              this.array2048[i+12] = (Number(this.array2048[i+4]) * 2).toString();
              this.array2048[i+8] = '';
              this.array2048[i+4] = '';
              this.array2048[i] = '';
            } else {
              this.array2048[i+12] = '';
              this.array2048[i+8] = '';
              this.array2048[i+4] = '';
              this.array2048[i] = '';
            }
          } else {
            this.array2048[i+12] = this.array2048[i+4];
            this.array2048[i+8] = this.array2048[i];
            this.array2048[i+4] = '';
            this.array2048[i] = '';
          }
        }
      }
      if (this.array2048[i+8] === this.array2048[i+4]) {
        if (this.array2048[i+8] !== '') {
          this.array2048[i+8] = (Number(this.array2048[i+8]) * 2).toString();
          this.array2048[i+4] = this.array2048[i];
          this.array2048[i] = '';
        } else {
          this.array2048[i+8] = this.array2048[i];
          this.array2048[i+4] = '';
          this.array2048[i] = '';
        }
      }
      if (this.array2048[i+4] === this.array2048[i]) {
        if (this.array2048[i+4] !== '') {
          this.array2048[i+4] = (Number(this.array2048[i+4]) * 2).toString();
          this.array2048[i] = '';
        }
      }
    }
    this.updFields();
    if(this.array2048.toString() === this.previousTurnArray.toString()) {
      document.addEventListener('keydown', (e) => {this.getKey(e)}, {once:true});
      const emptyFields = this.array2048.map((el,i)=>el===''? i: -1).filter((el)=> el!==-1);
      if (emptyFields.length === 0 && this.isPossibleMoves() === 0) {
        this.endGame();
      }
    } else {
      setTimeout(()=> {
        this.createNumber();
        this.previousTurnArray = this.array2048.slice();
      },100)
    }
  }

  private rightKey(): void {
    for (let i=0; i<4; i+=1) {
      if (this.array2048[4*i] === '' || this.array2048[4*i+1] === '' || this.array2048[4*i+2] === '' || this.array2048[4*i+3] === '') {
        const newArr = this.array2048.slice().splice(4*i,4).filter((el=>el!==''));
        this.array2048[4*i] = '';
        this.array2048[4*i+1] = newArr.length === 3 ? newArr[newArr.length-3] : '';
        this.array2048[4*i+2] = newArr.length >= 2 ? newArr[newArr.length-2] : '';
        this.array2048[4*i+3] = newArr.length >= 1 ? newArr[newArr.length-1] : '';
      }
      if (this.array2048[4*i+3] === this.array2048[4*i+2]) {
        if (this.array2048[4*i+3] !== '') {
          this.array2048[4*i+3] = (Number(this.array2048[4*i+3]) * 2).toString();
          this.array2048[4*i+2] = this.array2048[4*i+1];
          this.array2048[4*i+1] = this.array2048[4*i];
          this.array2048[4*i] = '';
        } else {
          if (this.array2048[4*i+1] === this.array2048[4*i]) {
            if (this.array2048[4*i+1] !== '') {
              this.array2048[4*i+3] = (Number(this.array2048[4*i+1]) * 2).toString();
              this.array2048[4*i+2] = '';
              this.array2048[4*i+1] = '';
              this.array2048[4*i] = '';
            } else {
              this.array2048[4*i+3] = '';
              this.array2048[4*i+2] = '';
              this.array2048[4*i+1] = '';
              this.array2048[4*i] = '';
            }
          } else {
            this.array2048[4*i+3] = this.array2048[4*i+1];
            this.array2048[4*i+2] = this.array2048[4*i];
            this.array2048[4*i+1] = '';
            this.array2048[4*i] = '';
          }
        }
      }
      if (this.array2048[4*i+2] === this.array2048[4*i+1]) {
        if (this.array2048[4*i+2] !== '') {
          this.array2048[4*i+2] = (Number(this.array2048[4*i+2]) * 2).toString();
          this.array2048[4*i+1] = this.array2048[4*i];
          this.array2048[4*i] = '';
        } else {
          this.array2048[4*i+2] = this.array2048[4*i];
          this.array2048[4*i+1] = '';
          this.array2048[4*i] = '';
        }
      }
      if (this.array2048[4*i+1] === this.array2048[4*i]) {
        if (this.array2048[4*i+1] !== '') {
          this.array2048[4*i+1] = (Number(this.array2048[4*i+1]) * 2).toString();
          this.array2048[4*i] = '';
        }
      }
    }
    this.updFields();
    if(this.array2048.toString() === this.previousTurnArray.toString()) {
      document.addEventListener('keydown', (e) => {this.getKey(e)}, {once:true});
      const emptyFields = this.array2048.map((el,i)=>el===''? i: -1).filter((el)=> el!==-1);
      if (emptyFields.length === 0 && this.isPossibleMoves() === 0) {
        this.endGame();
      }
    } else {
      setTimeout(()=> {
        this.createNumber();
        this.previousTurnArray = this.array2048.slice();
      },100)
    }
  }

  private upKey(): void {
    for (let i=0; i<4; i+=1) {
      if (this.array2048[i] === '' || this.array2048[i+4] === '' || this.array2048[i+8] === '' || this.array2048[i+12] === '') {
        const newArr = Array.from([this.array2048[i],this.array2048[i+4],this.array2048[i+8],this.array2048[i+12]]).filter((el=>el!==''));
        this.array2048[i+12] = '';
        this.array2048[i+8] = newArr.length === 3 ? newArr[2] : '';
        this.array2048[i+4] = newArr.length >= 2 ? newArr[1] : '';
        this.array2048[i] = newArr.length >= 1 ? newArr[0] : '';
      }
      if (this.array2048[i] === this.array2048[i+4]) {
        if (this.array2048[i] !== '') {
          this.array2048[i] = (Number(this.array2048[i]) * 2).toString();
          this.array2048[i+4] = this.array2048[i+8];
          this.array2048[i+8] = this.array2048[i+12];
          this.array2048[i+12] = '';
        } else {
          if (this.array2048[i+8] === this.array2048[i+12]) {
            if (this.array2048[i+8] !== '') {
              this.array2048[i] = (Number(this.array2048[i+8]) * 2).toString();
              this.array2048[i+4] = '';
              this.array2048[i+8] = '';
              this.array2048[i+12] = '';
            } else {
              this.array2048[i] = '';
              this.array2048[i+4] = '';
              this.array2048[i+8] = '';
              this.array2048[i+12] = '';
            }
          } else {
            this.array2048[i] = this.array2048[i+8];
            this.array2048[i+4] = this.array2048[i+12];
            this.array2048[i+8] = '';
            this.array2048[i+12] = '';
          }
        }
      }
      if (this.array2048[i+4] === this.array2048[i+8]) {
        if (this.array2048[i+4] !== '') {
          this.array2048[i+4] = (Number(this.array2048[i+4]) * 2).toString();
          this.array2048[i+8] = this.array2048[i+12];
          this.array2048[i+12] = '';
        } else {
          this.array2048[i+4] = this.array2048[i+12];
          this.array2048[i+8] = '';
          this.array2048[i+12] = '';
        }
      }
      if (this.array2048[i+8] === this.array2048[i+12]) {
        if (this.array2048[i+8] !== '') {
          this.array2048[i+8] = (Number(this.array2048[i+8]) * 2).toString();
          this.array2048[i+12] = '';
        }
      }
    }
    this.updFields();
    if(this.array2048.toString() === this.previousTurnArray.toString()) {
      document.addEventListener('keydown', (e) => {this.getKey(e)}, {once:true});
      const emptyFields = this.array2048.map((el,i)=>el===''? i: -1).filter((el)=> el!==-1);
      if (emptyFields.length === 0 && this.isPossibleMoves() === 0) {
        this.endGame();
      }
    } else {
      setTimeout(()=> {
        this.createNumber();
        this.previousTurnArray = this.array2048.slice();
      },100)
    }
  }

  private getKey(event): void {
    const pressedKey = event.keyCode;
    if (pressedKey == 37) {
      this.leftKey();
    } else if (pressedKey == 38) {
      this.upKey();
    } else if (pressedKey == 39) {
      this.rightKey();
    } else if (pressedKey == 40) {
      this.downKey();
    }
  }

  private nextTurn(emptyFields): void {
    document.addEventListener('keydown', (e) => {this.getKey(e)}, {once:true});
    emptyFields.sort(() => Math.random() - 0.5);
    this.array2048[emptyFields[0]] = (2*(Math.floor(Math.random() * 2) + 1)).toString();
    this.updFields();
    if (this.array2048.indexOf('2048')!==-1 && this.continueAfter2048 === false) {
      this.get2048();
    }
    if (this.isPossibleMoves() === 0) {
      this.endGame();
    }
  }

  private createNumber(): void {
    const emptyFields = this.array2048.map((el,i)=>el===''? i: -1).filter((el)=> el!==-1);
    if (emptyFields.length === 0 && this.isPossibleMoves() === 0) {
      this.endGame();
    } else {
      this.nextTurn(emptyFields);
    }
  }

  private isPossibleMoves() : number {
    const emptyFields = this.array2048.map((el,i)=>el===''? i: -1).filter((el)=> el!==-1);
    for (let i=0; i<4; i+=1) {
      if (emptyFields.length !== 0 || this.array2048[4*i]===this.array2048[4*i+1] || this.array2048[4*i+1]===this.array2048[4*i+2] || this.array2048[4*i+2]===this.array2048[4*i+3] || this.array2048[i]===this.array2048[i+4] || this.array2048[i+4]===this.array2048[i+8] || this.array2048[i+8]===this.array2048[i+12]) {
        return 1;
      }
    }
    return 0;
  }

  public async after_render(): Promise<void> {
    (document.getElementById('start2048') as HTMLElement).addEventListener('click', this.start2048.bind(this));
    (document.getElementById('new2048game') as HTMLElement).addEventListener('click', ()=>window.location.reload());
    (document.getElementById('new2048game2') as HTMLElement).addEventListener('click', ()=>window.location.reload());
    return;
  }
}

export default twoZeroFourEight