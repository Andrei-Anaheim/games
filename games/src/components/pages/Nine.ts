import Page from './Page';
import '../../scss/layout/_nine.scss';

class Nine implements Page {

  private players = Number(localStorage.getItem('nine-players'));
  private cardsCount = Number(localStorage.getItem('nine-gameType'));
  private allCards = this.cardsCount === 52? Array.from(Array(this.cardsCount).keys()).sort(() => Math.random() - 0.5) :
  Array.from(Array(9).keys()).map((_, idx) => 4 + idx).concat(Array.from(Array(9).keys()).map((_, idx) => 17 + idx)).concat(Array.from(Array(9).keys()).map((_, idx) => 30 + idx)).concat(Array.from(Array(9).keys()).map((_, idx) => 43 + idx)).sort(() => Math.random() - 0.5);
  private bot1Cards: number[] = this.players>1? this.allCards.splice(0,Math.floor(this.cardsCount/this.players)+(this.players>=5? 1: 0)): [];
  private bot2Cards: number[] = this.players>2? this.allCards.splice(0,Math.floor(this.cardsCount/this.players)+(this.players>=6? 1: 0)): [];
  private bot3Cards: number[] = this.players>3? this.allCards.splice(0,Math.floor(this.cardsCount/this.players)+(this.players>=6? 1: 0)): [];
  private bot4Cards: number[] = this.players>4? this.allCards.splice(0,Math.floor(this.cardsCount/this.players)): [];
  private bot5Cards: number[] = this.players>5? this.allCards.splice(0,Math.floor(this.cardsCount/this.players)): [];
  private playerCards: number[] = this.allCards.sort((a,b) =>  a- b);
  private cardsOnBoard1 : number[] = [];
  private cardsOnBoard2 : number[] = [];
  private cardsOnBoard3 : number[] = [];
  private cardsOnBoard4 : number[] = [];
  private currentPlayer = this.bot1Cards.indexOf(33) !== -1? 1 : this.bot2Cards.indexOf(33) !== -1? 2 : this.bot3Cards.indexOf(33) !== -1? 3 : this.bot4Cards.indexOf(33) !== -1? 4 : this.bot5Cards.indexOf(33) !== -1? 5 : 0;
  private mainWidth = document.body.clientWidth - 40;
  private cardWidth = this.mainWidth*0.7/14;
  private cardHeight = this.cardWidth/500*726;
  private currentPlayerPossibleMoves: number[] = [];

  public async render(): Promise<string> {
    const groupX = window.location.hash.split('/')[2] === 'start' ? 0 : window.location.hash.split('/')[2] === 'field'? 1: 2;
    const enemies = `
    <div class="enemies">
      <div class="enemy enemy-1" style="display:${this.players<2? 'none': 'flex'}">
        <span>Bot 1</span>
        <div class="bot-cards">${this.bot1Cards.length}</div>
      </div>
      <div class="enemy enemy-2" style="display:${this.players<3? 'none': 'flex'}">
        <span>Bot 2</span>
        <div class="bot-cards">${this.bot2Cards.length}</div>
      </div>
      <div class="enemy enemy-3" style="display:${this.players<4? 'none': 'flex'}">
        <span>Bot 3</span>
        <div class="bot-cards">${this.bot3Cards.length}</div>
      </div>
      <div class="enemy enemy-4" style="display:${this.players<5? 'none': 'flex'}">
        <span>Bot 4</span>
        <div class="bot-cards">${this.bot4Cards.length}</div>
      </div>
      <div class="enemy enemy-5" style="display:${this.players<6? 'none': 'flex'}">
        <span>Bot 5</span>
        <div class="bot-cards">${this.bot5Cards.length}</div>
      </div>
    </div>
    `;
    let cardboard1 = '';
    let cardboard2 = '';
    let cardboard3 = '';
    let cardboard4 = '';
    let myCards = '';
    for (let i=0; i<this.playerCards.length; i+=1) {
      myCards += `<div class="nine-card-my" style="background: url(../../assets/img/${this.playerCards[i]}.png); background-size:cover; width: ${this.mainWidth*0.8/18}px" id="myCard${this.playerCards[i]}"></div>`
    }
    for (let i=0; i< this.cardsCount/4; i+=1) {
      cardboard1 += `<div class="nine-card" style="width: ${this.cardWidth}px; height: ${this.cardHeight}px" id="card${this.cardsCount === 52? i: i+4}"></div>`
      cardboard2 += `<div class="nine-card" style="width: ${this.cardWidth}px; height: ${this.cardHeight}px" id="card${this.cardsCount === 52? i+this.cardsCount/4: i+this.cardsCount/4 + 8}"></div>`
      cardboard3 += `<div class="nine-card" style="width: ${this.cardWidth}px; height: ${this.cardHeight}px" id="card${this.cardsCount === 52? i+2*this.cardsCount/4: i+2*this.cardsCount/4 + 12}"></div>`
      cardboard4 += `<div class="nine-card" style="width: ${this.cardWidth}px; height: ${this.cardHeight}px" id="card${this.cardsCount === 52? i+3*this.cardsCount/4: i+3*this.cardsCount/4 + 16}"></div>`
    }
    const battlefield = `
      ${enemies}
      <div class="battlefield">
        <div class="battlefield-row">${cardboard1}</div>
        <div class="battlefield-row">${cardboard2}</div>
        <div class="battlefield-row">${cardboard3}</div>
        <div class="battlefield-row">${cardboard4}</div>
      </div>
      <div class="myCards" style="pointer-events:none">${myCards}</div>
      <div class="nine-result" style="display:none">
        <p class="nine-winner">Winner:</p>
        <a href="/#/nine/start" class="button">New game</a>
      </div>
    `
    const result = `
    <div class="nine__wrapper">
      <div class="nine-settings">
        <div class="nine-setting-item">
          <p class="form_title">Количество игроков</p>
          <select class="nine-setting-select" id="nine-level">
            <option value="3" selected>3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
        </div>
        <div class="nine-setting-item">
          <p class="form_title">Выберите формат</p>
          <select class="nine-setting-select" id="nine-type">
            <option value="36" selected>36 карт</option>
            <option value="52">52 карты</option>
          </select>
        </div>
        <!--<div class="nine-setting-item">
          <p class="form_title" id="currentBet">Текущая ставка: 0</p>
          <input id="range" type="range" name="range" min="0" max="100" step="5" value="0" />
        </div>-->
      </div>
      <a href="/#/nine/field" class="button nine-start">Start</a>
    </div>
    `;
    const info = `
    <section class="nine-rules" style="background:red; color:black">
      <a href="/#/nine/start" class="level-info-link">
        <div class="level-description">
          <p>Карточная игра "Девятка"</p>
          <p>Число игроков: от 2 до до 6</p>
          <p>Цель игры: избавиться от карт на руках. Проигрывает тот, кто последний останется с картами</p>
          <p>Игру начинает игрок, имеющий 9 бубен. 
          Следующий игрок по часовой стрелке может положить 8 или 10 бубен, либо одну из трёх оставшихся 9. 
          Если вышеназванных карт у него нет, то он пропускает ход, а при игре на деньги обязан поставить в банк определенную сумму, 
          обычно равную начальной ставке. 
          Также и в дальнейшем: при невозможности положить карту ход пропускается. 
          Но игрок обязан выложить карту на кон, если он может сделать ход.</p>
        </div>
      </a>
    </section>
    `;
    const view = `
    <div class="nine-navigation" style="display:${groupX === 1 ? 'none' : 'flex'}">
      <div class="wrapper nine-navigation__wrapper">
        <div class="navigation-buttons">
          <a href="/#/nine/start" class="${groupX !== 2 ? 'button' : 'button_grey'} textbook__button">Game Start</a>
          <a href="/#/nine/info" class="${groupX === 2 ? 'button' : 'button_grey'} textbook__button">Game rules</a>
        </div>
      </div>
    </div>
    <section class="word-cards">
      ${groupX === 2 ? info : groupX === 1 ? battlefield : result}
    </section>
      `;
    return view;
  }

  private startNine():void {
    if (this.currentPlayer === 0) {
      (document.getElementById(`myCard33`) as HTMLElement).remove();
      this.playerCards.splice(this.playerCards.indexOf(33),1);
      this.currentPlayer =  this.currentPlayer == this.players - 1? 0 : 1;
    } else if (this.currentPlayer === 1) {
      this.bot1Cards.splice(this.bot1Cards.indexOf(33),1);
      (document.querySelectorAll('.bot-cards')[0] as HTMLElement).innerText = `${this.bot1Cards.length}`;
      this.currentPlayer =  this.currentPlayer == this.players - 1? 0 : 2;
    } else if (this.currentPlayer === 2) {
      this.bot2Cards.splice(this.bot2Cards.indexOf(33),1);
      (document.querySelectorAll('.bot-cards')[1] as HTMLElement).innerText = `${this.bot2Cards.length}`;
      this.currentPlayer =  this.currentPlayer == this.players - 1? 0 : 3;
    } else if (this.currentPlayer === 3) {
      this.bot3Cards.splice(this.bot3Cards.indexOf(33),1);
      (document.querySelectorAll('.bot-cards')[2] as HTMLElement).innerText = `${this.bot3Cards.length}`;
      this.currentPlayer =  this.currentPlayer == this.players - 1? 0 : 4;
    } else if (this.currentPlayer === 4) {
      this.bot4Cards.splice(this.bot4Cards.indexOf(33),1);
      (document.querySelectorAll('.bot-cards')[3] as HTMLElement).innerText = `${this.bot4Cards.length}`;
      this.currentPlayer =  this.currentPlayer == this.players - 1? 0 : 5;
    } else {
      this.bot5Cards.splice(this.bot5Cards.indexOf(33),1);
      (document.querySelectorAll('.bot-cards')[4] as HTMLElement).innerText = `${this.bot5Cards.length}`;
      this.currentPlayer = 0;
    }
    this.cardsOnBoard3.push(33);
    (document.getElementById('card33') as HTMLElement).setAttribute('style', `background: url(../../assets/img/33.png); background-size:cover; width: ${this.cardWidth}px; height: ${this.cardHeight}px`);
    setTimeout(()=>{this.moveNine(this.currentPlayer)}, 500);
  }

  private moveNine(currentPlayer): void {

    this.currentPlayerPossibleMoves = [];
    const minBoard1 = this.cardsOnBoard1.length === 0? 7: Math.min(...this.cardsOnBoard1);
    const maxBoard1 = this.cardsOnBoard1.length === 0? 7: Math.max(...this.cardsOnBoard1);
    const minBoard2 = this.cardsOnBoard2.length === 0? 20: Math.min(...this.cardsOnBoard2);
    const maxBoard2 = this.cardsOnBoard2.length === 0? 20: Math.max(...this.cardsOnBoard2);
    const minBoard3 = this.cardsOnBoard3.length === 0? 33: Math.min(...this.cardsOnBoard3);
    const maxBoard3 = this.cardsOnBoard3.length === 0? 33: Math.max(...this.cardsOnBoard3);
    const minBoard4 = this.cardsOnBoard4.length === 0? 46: Math.min(...this.cardsOnBoard4);
    const maxBoard4 = this.cardsOnBoard4.length === 0? 46: Math.max(...this.cardsOnBoard4);
    
    if (this.cardsOnBoard1.length === 0) {
      this.currentPlayerPossibleMoves.push(7);
    } else {
      if (minBoard1>0) this.currentPlayerPossibleMoves.push(minBoard1 - 1);
      if (maxBoard1<12) this.currentPlayerPossibleMoves.push(maxBoard1 + 1);
    }
    if (this.cardsOnBoard2.length === 0) {
      this.currentPlayerPossibleMoves.push(20);
    } else {
      if (minBoard2>13) this.currentPlayerPossibleMoves.push(minBoard2 - 1);
      if (maxBoard2<25) this.currentPlayerPossibleMoves.push(maxBoard2 + 1);
    }
    if (this.cardsOnBoard3.length === 0) {
      this.currentPlayerPossibleMoves.push(33);
    } else {
      if (minBoard3>26) this.currentPlayerPossibleMoves.push(minBoard3 - 1);
      if (maxBoard3<38) this.currentPlayerPossibleMoves.push(maxBoard3 + 1);
    }
    if (this.cardsOnBoard4.length === 0) {
      this.currentPlayerPossibleMoves.push(46);
    } else {
      if (minBoard4>39) this.currentPlayerPossibleMoves.push(minBoard4 - 1);
      if (maxBoard4<51) this.currentPlayerPossibleMoves.push(maxBoard4 + 1);
    }
    if (currentPlayer === 0) {
      const duplicatedValues = [...this.currentPlayerPossibleMoves].filter(item => this.playerCards.includes(item));
      if (duplicatedValues.length > 0) {
        (document.querySelector('.myCards')as HTMLElement).setAttribute('style', 'pointer-events:""');  
        for (let i=0; i<this.currentPlayerPossibleMoves.length; i+=1) {
          if(this.playerCards.indexOf(this.currentPlayerPossibleMoves[i]) !== -1) {
            (document.getElementById(`myCard${this.currentPlayerPossibleMoves[i]}`) as HTMLElement).style.border = '4px solid green';
            (document.getElementById(`myCard${this.currentPlayerPossibleMoves[i]}`) as HTMLElement).addEventListener('click', (event: MouseEvent) => {this.playerMove(event)});
          }
        }
      } else {
        this.currentPlayer =  1;
        if (this.bot1Cards.length !==0 && this.bot2Cards.length !==0 && this.playerCards.length !==0 && (this.players>3? this.bot3Cards.length !==0 : 1) && (this.players>4? this.bot4Cards.length !==0 : 1) && (this.players>5? this.bot5Cards.length !==0 : 1)) {
          setTimeout(()=>{this.moveNine(this.currentPlayer)}, 500);
        } else {
          const winner = this.playerCards.length ===0 ? "You! Congratulations!" : this.bot1Cards.length ===0? "Bot1" : this.bot2Cards.length ===0? "Bot2" : this.bot3Cards.length ===0? "Bot3" : this.bot4Cards.length ===0? "Bot4" : "Bot5";
          (document.querySelector('.nine-result') as HTMLElement).setAttribute('style', 'display: block');
          (document.querySelector('.nine-winner') as HTMLElement).innerText = `Winner: ${winner}`;
        }
      }
    } 
    else if (currentPlayer === 1) {
      const duplicatedValues = [...this.currentPlayerPossibleMoves].filter(item => this.bot1Cards.includes(item));
      if(duplicatedValues.length > 0) {
        duplicatedValues.sort(() => Math.random() - 0.5);
        this.bot1Cards.splice(this.bot1Cards.indexOf(duplicatedValues[0]),1);
        (document.querySelectorAll('.bot-cards')[0] as HTMLElement).innerText = `${this.bot1Cards.length}`;
        (document.getElementById(`card${duplicatedValues[0]}`) as HTMLElement).setAttribute('style', `background: url(../../assets/img/${duplicatedValues[0]}.png); background-size:cover; width: ${this.cardWidth}px; height: ${this.cardHeight}px`);
        duplicatedValues[0] >= 39 ? this.cardsOnBoard4.push(duplicatedValues[0]):
        duplicatedValues[0] >= 26 ? this.cardsOnBoard3.push(duplicatedValues[0]):
        duplicatedValues[0] >= 13 ? this.cardsOnBoard2.push(duplicatedValues[0]):
        duplicatedValues[0] >= 0 ? this.cardsOnBoard1.push(duplicatedValues[0]): null;
      }
      this.currentPlayer =  this.currentPlayer == this.players - 1? 0 : 2;
      if (this.bot1Cards.length !==0 && this.bot2Cards.length !==0 && this.playerCards.length !==0 && (this.players>3? this.bot3Cards.length !==0 : 1) && (this.players>4? this.bot4Cards.length !==0 : 1) && (this.players>5? this.bot5Cards.length !==0 : 1)) {
        setTimeout(()=>{this.moveNine(this.currentPlayer)}, 500);
      } else {
        const winner = this.playerCards.length ===0 ? "You! Congratulations!" : this.bot1Cards.length ===0? "Bot1" : this.bot2Cards.length ===0? "Bot2" : this.bot3Cards.length ===0? "Bot3" : this.bot4Cards.length ===0? "Bot4" : "Bot5";
        (document.querySelector('.nine-result') as HTMLElement).setAttribute('style', 'display: block');
        (document.querySelector('.nine-winner') as HTMLElement).innerText = `Winner: ${winner}`;
      }
    } else if (currentPlayer === 2) {
      const duplicatedValues = [...this.currentPlayerPossibleMoves].filter(item => this.bot2Cards.includes(item));
      if(duplicatedValues.length > 0) {
        duplicatedValues.sort(() => Math.random() - 0.5);
        this.bot2Cards.splice(this.bot2Cards.indexOf(duplicatedValues[0]),1);
        (document.querySelectorAll('.bot-cards')[1] as HTMLElement).innerText = `${this.bot2Cards.length}`;
        (document.getElementById(`card${duplicatedValues[0]}`) as HTMLElement).setAttribute('style', `background: url(../../assets/img/${duplicatedValues[0]}.png); background-size:cover; width: ${this.cardWidth}px; height: ${this.cardHeight}px`);
        duplicatedValues[0] >= 39 ? this.cardsOnBoard4.push(duplicatedValues[0]):
        duplicatedValues[0] >= 26 ? this.cardsOnBoard3.push(duplicatedValues[0]):
        duplicatedValues[0] >= 13 ? this.cardsOnBoard2.push(duplicatedValues[0]):
        duplicatedValues[0] >= 0 ? this.cardsOnBoard1.push(duplicatedValues[0]): null;
      }
      this.currentPlayer =  this.currentPlayer == this.players - 1? 0 : 3;
      if (this.bot1Cards.length !==0 && this.bot2Cards.length !==0 && this.playerCards.length !==0 && (this.players>3? this.bot3Cards.length !==0 : 1) && (this.players>4? this.bot4Cards.length !==0 : 1) && (this.players>5? this.bot5Cards.length !==0 : 1)) {
        setTimeout(()=>{this.moveNine(this.currentPlayer)}, 500);
      } else {
        const winner = this.playerCards.length ===0 ? "You! Congratulations!" : this.bot1Cards.length ===0? "Bot1" : this.bot2Cards.length ===0? "Bot2" : this.bot3Cards.length ===0? "Bot3" : this.bot4Cards.length ===0? "Bot4" : "Bot5";
        (document.querySelector('.nine-result') as HTMLElement).setAttribute('style', 'display: block');
        (document.querySelector('.nine-winner') as HTMLElement).innerText = `Winner: ${winner}`;
      }
    } else if (currentPlayer === 3) {
      const duplicatedValues = [...this.currentPlayerPossibleMoves].filter(item => this.bot3Cards.includes(item));
      if(duplicatedValues.length > 0) {
        duplicatedValues.sort(() => Math.random() - 0.5);
        this.bot3Cards.splice(this.bot3Cards.indexOf(duplicatedValues[0]),1);
        (document.querySelectorAll('.bot-cards')[2] as HTMLElement).innerText = `${this.bot3Cards.length}`;
        (document.getElementById(`card${duplicatedValues[0]}`) as HTMLElement).setAttribute('style', `background: url(../../assets/img/${duplicatedValues[0]}.png); background-size:cover; width: ${this.cardWidth}px; height: ${this.cardHeight}px`);
        duplicatedValues[0] >= 39 ? this.cardsOnBoard4.push(duplicatedValues[0]):
        duplicatedValues[0] >= 26 ? this.cardsOnBoard3.push(duplicatedValues[0]):
        duplicatedValues[0] >= 13 ? this.cardsOnBoard2.push(duplicatedValues[0]):
        duplicatedValues[0] >= 0 ? this.cardsOnBoard1.push(duplicatedValues[0]): null;
      }
      this.currentPlayer =  this.currentPlayer == this.players - 1? 0 : 4;
      if (this.bot1Cards.length !==0 && this.bot2Cards.length !==0 && this.playerCards.length !==0 && (this.players>3? this.bot3Cards.length !==0 : 1) && (this.players>4? this.bot4Cards.length !==0 : 1) && (this.players>5? this.bot5Cards.length !==0 : 1)) {
        setTimeout(()=>{this.moveNine(this.currentPlayer)}, 500);
      } else {
        const winner = this.playerCards.length ===0 ? "You! Congratulations!" : this.bot1Cards.length ===0? "Bot1" : this.bot2Cards.length ===0? "Bot2" : this.bot3Cards.length ===0? "Bot3" : this.bot4Cards.length ===0? "Bot4" : "Bot5";
        (document.querySelector('.nine-result') as HTMLElement).setAttribute('style', 'display: block');
        (document.querySelector('.nine-winner') as HTMLElement).innerText = `Winner: ${winner}`;
      }
    } else if (currentPlayer === 4) {
      const duplicatedValues = [...this.currentPlayerPossibleMoves].filter(item => this.bot4Cards.includes(item));
      if(duplicatedValues.length > 0) {
        duplicatedValues.sort(() => Math.random() - 0.5);
        this.bot4Cards.splice(this.bot4Cards.indexOf(duplicatedValues[0]),1);
        (document.querySelectorAll('.bot-cards')[3] as HTMLElement).innerText = `${this.bot4Cards.length}`;
        (document.getElementById(`card${duplicatedValues[0]}`) as HTMLElement).setAttribute('style', `background: url(../../assets/img/${duplicatedValues[0]}.png); background-size:cover; width: ${this.cardWidth}px; height: ${this.cardHeight}px`);
        duplicatedValues[0] >= 39 ? this.cardsOnBoard4.push(duplicatedValues[0]):
        duplicatedValues[0] >= 26 ? this.cardsOnBoard3.push(duplicatedValues[0]):
        duplicatedValues[0] >= 13 ? this.cardsOnBoard2.push(duplicatedValues[0]):
        duplicatedValues[0] >= 0 ? this.cardsOnBoard1.push(duplicatedValues[0]): null;
      }
      this.currentPlayer =  this.currentPlayer == this.players - 1? 0 : 5;
      if (this.bot1Cards.length !==0 && this.bot2Cards.length !==0 && this.playerCards.length !==0 && (this.players>3? this.bot3Cards.length !==0 : 1) && (this.players>4? this.bot4Cards.length !==0 : 1) && (this.players>5? this.bot5Cards.length !==0 : 1)) {
        setTimeout(()=>{this.moveNine(this.currentPlayer)}, 500);
      } else {
        const winner = this.playerCards.length ===0 ? "You! Congratulations!" : this.bot1Cards.length ===0? "Bot1" : this.bot2Cards.length ===0? "Bot2" : this.bot3Cards.length ===0? "Bot3" : this.bot4Cards.length ===0? "Bot4" : "Bot5";
        (document.querySelector('.nine-result') as HTMLElement).setAttribute('style', 'display: block');
        (document.querySelector('.nine-winner') as HTMLElement).innerText = `Winner: ${winner}`;
      }
    } else {
      const duplicatedValues = [...this.currentPlayerPossibleMoves].filter(item => this.bot5Cards.includes(item));
      if(duplicatedValues.length > 0) {
        duplicatedValues.sort(() => Math.random() - 0.5);
        this.bot5Cards.splice(this.bot5Cards.indexOf(duplicatedValues[0]),1);
        (document.querySelectorAll('.bot-cards')[4] as HTMLElement).innerText = `${this.bot5Cards.length}`;
        (document.getElementById(`card${duplicatedValues[0]}`) as HTMLElement).setAttribute('style', `background: url(../../assets/img/${duplicatedValues[0]}.png); background-size:cover; width: ${this.cardWidth}px; height: ${this.cardHeight}px`);
        duplicatedValues[0] >= 39 ? this.cardsOnBoard4.push(duplicatedValues[0]):
        duplicatedValues[0] >= 26 ? this.cardsOnBoard3.push(duplicatedValues[0]):
        duplicatedValues[0] >= 13 ? this.cardsOnBoard2.push(duplicatedValues[0]):
        duplicatedValues[0] >= 0 ? this.cardsOnBoard1.push(duplicatedValues[0]): null;
      }
      this.currentPlayer =  0;
      if (this.bot1Cards.length !==0 && this.bot2Cards.length !==0 && this.playerCards.length !==0 && (this.players>3? this.bot3Cards.length !==0 : 1) && (this.players>4? this.bot4Cards.length !==0 : 1) && (this.players>5? this.bot5Cards.length !==0 : 1)) {
        setTimeout(()=>{this.moveNine(this.currentPlayer)}, 500);
      } else {
        const winner = this.playerCards.length ===0 ? "You! Congratulations!" : this.bot1Cards.length ===0? "Bot1" : this.bot2Cards.length ===0? "Bot2" : this.bot3Cards.length ===0? "Bot3" : this.bot4Cards.length ===0? "Bot4" : "Bot5";
        (document.querySelector('.nine-result') as HTMLElement).setAttribute('style', 'display: block');
        (document.querySelector('.nine-winner') as HTMLElement).innerText = `Winner: ${winner}`;
      }
    }
  }

  public playerMove(event): void {
    for (let i=0; i<this.currentPlayerPossibleMoves.length; i+=1) {
      if(this.playerCards.indexOf(this.currentPlayerPossibleMoves[i]) !== -1) {
        (document.getElementById(`myCard${this.currentPlayerPossibleMoves[i]}`) as HTMLElement).replaceWith((document.getElementById(`myCard${this.currentPlayerPossibleMoves[i]}`) as HTMLElement).cloneNode(true));
      }
    }
    const currentNumber = Number(event.target.id.split('myCard')[1]);
    if (document.getElementById(`myCard${currentNumber}`)) (document.getElementById(`myCard${currentNumber}`) as HTMLElement).remove();
    this.playerCards.splice(this.playerCards.indexOf(currentNumber),1);
    this.currentPlayer =  this.currentPlayer == this.players - 1? 0 : 1;
    (document.getElementById(`card${currentNumber}`) as HTMLElement).setAttribute('style', `background: url(../../assets/img/${currentNumber}.png); background-size:cover; width: ${this.cardWidth}px; height: ${this.cardHeight}px`);
    (document.querySelector('.myCards')as HTMLElement).setAttribute('style', 'pointer-events: none');
    (document.querySelectorAll('.nine-card-my') as NodeListOf<HTMLElement>).forEach((el)=> el.style.border = '1px solid pink');
    currentNumber >= 39 ? this.cardsOnBoard4.push(currentNumber):
    currentNumber >= 26 ? this.cardsOnBoard3.push(currentNumber):
    currentNumber >= 13 ? this.cardsOnBoard2.push(currentNumber):
    currentNumber >= 0 ? this.cardsOnBoard1.push(currentNumber): null;
    this.currentPlayer = 1;
    if (this.bot1Cards.length !==0 && this.bot2Cards.length !==0 && this.playerCards.length !==0 && (this.players>3? this.bot3Cards.length !==0 : 1) && (this.players>4? this.bot4Cards.length !==0 : 1) && (this.players>5? this.bot5Cards.length !==0 : 1)) {
      setTimeout(()=>{this.moveNine(this.currentPlayer)}, 500);
    } else {
      const winner = this.playerCards.length ===0 ? "You! Congratulations!" : this.bot1Cards.length ===0? "Bot1" : this.bot2Cards.length ===0? "Bot2" : this.bot3Cards.length ===0? "Bot3" : this.bot4Cards.length ===0? "Bot4" : "Bot5";
      (document.querySelector('.nine-result') as HTMLElement).setAttribute('style', 'display: block');
      (document.querySelector('.nine-winner') as HTMLElement).innerText = `Winner: ${winner}`;
    }
  }

  public saveNineSettings(): void {
    const players = (document.getElementById('nine-level') as HTMLSelectElement).value;
    const gameType = (document.getElementById('nine-type') as HTMLSelectElement).value;
    localStorage.setItem('nine-players', players);
    localStorage.setItem('nine-gameType', gameType);
  }
  private updateBet(): void {
    (document.getElementById('currentBet') as HTMLElement).innerText = `Текущая ставка: ${(document.getElementById('range') as HTMLInputElement).value}`;
  }

  public async after_render(): Promise<void> {
    window.addEventListener('hashchange', () => {
      location.reload();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    if (window.location.hash.split('/')[2] === 'start'){
      (document.querySelector('.nine-start') as HTMLElement).addEventListener('click', this.saveNineSettings);
    }
    if (window.location.hash.split('/')[2] === 'field'){
      setTimeout(this.startNine.bind(this), 500);
    }
    // (document.getElementById('range') as HTMLInputElement).addEventListener('input', this.updateBet)
    return;
  }
}

export default Nine