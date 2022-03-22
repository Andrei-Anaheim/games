import Page from './Page';
import '../../scss/layout/_battleships.scss';

class Battleships implements Page {
  private turn = 0;
  private myField: string[][] = [
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','','']
    ];
  private enemyField: string[][] = [
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','','']
    ];
  private myShips:number[][][] = [
    [[0,0],[0,0],[0,0],[0,0]],
    [[0,0],[0,0],[0,0]],
    [[0,0],[0,0],[0,0]],
    [[0,0],[0,0]],
    [[0,0],[0,0]],
    [[0,0],[0,0]],
    [[0,0]],
    [[0,0]],
    [[0,0]],
    [[0,0]],
  ]

  private enemyShips:number[][][] = [
    [[0,0],[0,0],[0,0],[0,0]],
    [[0,0],[0,0],[0,0]],
    [[0,0],[0,0],[0,0]],
    [[0,0],[0,0]],
    [[0,0],[0,0]],
    [[0,0],[0,0]],
    [[0,0]],
    [[0,0]],
    [[0,0]],
    [[0,0]],
  ]

  private compStrategy1: number[][] = [[0,3],[1,2],[2,1],[3,0],[0,7],[1,6],[2,5],[3,4],[4,3],[5,2],[6,1],[7,0],[2,9],[3,8],[4,7],[5,6],[6,5],[7,4],[8,3],[9,2],[6,9],[7,8],[8,7],[9,6]]
  private compStrategy2: number[][] = [[0,3],[1,2],[2,1],[3,0],[0,7],[1,6],[2,5],[3,4],[4,3],[5,2],[6,1],[7,0],[2,9],[3,8],[4,7],[5,6],[6,5],[7,4],[8,3],[9,2],[6,9],[7,8],[8,7],[9,6],[0,1],[1,0],[0,5],[1,4],[2,3],[3,2],[4,1],[5,0],[0,9],[1,8],[2,7],[3,6],[4,5],[5,4],[6,3],[7,2],[8,1],[9,0],[4,9],[5,8],[6,7],[7,6],[8,5],[9,4],[8,9],[9,8]]
  private is4Dead = false;
  private is4Bleed = false;
  private is3Dead = false;
  private is3Dead1 = false;
  private is3Bleed = false;
  private is2Dead = false;
  private is2Dead1 = false;
  private is2Dead2 = false;
  private is2Bleed = false;
  private lastShot:number[][] = [];
  private highProbability: number[][] = [];

  public async render(): Promise<string> {
    let myField = '<table class="myBattleField" id="myBattleField"><tbody><tr><td></td><td>А</td><td>Б</td><td>В</td><td>Г</td><td>Д</td><td>Е</td><td>Ж</td><td>З</td><td>И</td><td>К</td></tr>';
    let enemyField = '<table class="enemyBattleField" id="enemyBattleField"><tbody><tr><td></td><td>А</td><td>Б</td><td>В</td><td>Г</td><td>Д</td><td>Е</td><td>Ж</td><td>З</td><td>И</td><td>К</td></tr>';
    for (let i=0; i<10; i+=1) {
      myField+=`<tr><td>${i+1}</td>`
      enemyField+=`<tr><td>${i+1}</td>`
      for (let j=0; j<10; j+=1) {
        myField += `<td class="battlecell empty" id="my${i}_${j}"></td>`
        enemyField += `<td class="battlecell empty" id="enemy${i}_${j}"></td>`
      }
      myField += `</tr>`
      enemyField += `</tr>`
    }
    myField += `</tbody></table>`
    enemyField += `</tbody></table>`

    const view = `
    <div class="battleships_wrapper">
      <div class="myField">
        ${myField}
        <div class="battlefield_options">
          <div class="button" id="randomShips">Случайная расстановка</div>
          <div class="button" id="notRandomShips">Расставить лично</div>
          <p id="advice" style="display:none">Нажимайте на ячейки для отрисовки кораблей. <br>Повторное нажатие - удаление.<br>При нажатии на старт при неполном заполнении поля<br> игра начинается со случайной расстановкой.</p>
          <p></p>
        </div>
      </div>
      <div class="center">
        <div class="startBattle button" id="startBattleships">Старт</div>
        <p class="game_result" id="result" style="display: none"></p>
        <div class="newBattle button" id="newBattleships" style="display:none">Новая Игра</div>
      </div>
      <div class="enemyField" style="pointer-events: none">
        ${enemyField}
      </div>
    </div>
      `
    return view;
  }

  private RandomShips(): void {
    this.myField = [
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','','']
    ];
    (document.querySelectorAll('.full') as NodeListOf<HTMLElement>).forEach((el)=>el.classList.add('empty'));
    (document.querySelectorAll('.full') as NodeListOf<HTMLElement>).forEach((el)=>el.classList.remove('full'));
    const shipDirection = ['vertical', 'horizontal'];
    const ships = [4,3,3,2,2,2,1,1,1,1];
    for (let a=0; a<10; a+=1) {
      const possibleVertical: object[] = [];
      const possibleHorizontal: object[] = [];
      const direction = shipDirection[Math.round(Math.random())];
      if (direction === 'vertical') {
        for (let i=0; i<11-ships[a]; i+=1) {
          for (let j=0; j<10; j+=1) {
            let result = 0;
            for (let k=0; k<ships[a]; k+=1) {
              result += Number(Boolean(this.myField[i+k][j]));
            }
            if (result === 0) possibleVertical.push([i,j]);
          }
        }
        const startPosition = possibleVertical[Math.round(Math.random()*(possibleVertical.length-1))];
        for (let k=0; k<ships[a]; k+=1) {
          this.myField[startPosition[0]+k][startPosition[1]] = 'x';
          if(k===0 && startPosition[0]>0) {
            this.myField[startPosition[0]+k-1][startPosition[1]] = '-';
            if(startPosition[1]>0) this.myField[startPosition[0]+k-1][startPosition[1]-1] = '-';
            if(startPosition[1]<9) this.myField[startPosition[0]+k-1][startPosition[1]+1] = '-';
          }
          if(k===ships[a]-1 && startPosition[0]<10-ships[a]) {
            this.myField[startPosition[0]+ships[a]][startPosition[1]] = '-';
            if(startPosition[1]>0) this.myField[startPosition[0]+ships[a]][startPosition[1]-1] = '-';
            if(startPosition[1]<9) this.myField[startPosition[0]+ships[a]][startPosition[1]+1] = '-';
          }
          if(startPosition[1]>0) this.myField[startPosition[0]+k][startPosition[1]-1] = '-';
          if(startPosition[1]<9) this.myField[startPosition[0]+k][startPosition[1]+1] = '-';
          (document.getElementById(`my${startPosition[0]+k}_${startPosition[1]}`) as HTMLElement).classList.remove('empty');
          (document.getElementById(`my${startPosition[0]+k}_${startPosition[1]}`) as HTMLElement).classList.add('full');
          this.myShips[a][k] = [startPosition[0]+k,startPosition[1]];
        }
      } else {
        for (let i=0; i<11-ships[a]; i+=1) {
          for (let j=0; j<10; j+=1) {
            let result = 0;
            for (let k=0; k<ships[a]; k+=1) {
              result += Number(Boolean(this.myField[j][i+k]));
            }
            if (result === 0) possibleHorizontal.push([j,i]);
          }
        }
        const startPosition = possibleHorizontal[Math.round(Math.random()*(possibleHorizontal.length-1))];
        for (let k=0; k<ships[a]; k+=1) {
          this.myField[startPosition[0]][startPosition[1]+k] = 'x';
          if(k===0 && startPosition[1]>0) {
            this.myField[startPosition[0]][startPosition[1]+k-1] = '-';
            if(startPosition[0]>0) this.myField[startPosition[0]-1][startPosition[1]+k-1] = '-';
            if(startPosition[0]<9) this.myField[startPosition[0]+1][startPosition[1]+k-1] = '-';
          }
          if(k===ships[a]-1 && startPosition[1]<10-ships[a]) {
            this.myField[startPosition[0]][startPosition[1]+ships[a]] = '-';
            if(startPosition[0]>0) this.myField[startPosition[0]-1][startPosition[1]+ships[a]] = '-';
            if(startPosition[0]<9) this.myField[startPosition[0]+1][startPosition[1]+ships[a]] = '-';
          }
          if(startPosition[0]>0) this.myField[startPosition[0]-1][startPosition[1]+k] = '-';
          if(startPosition[0]<9) this.myField[startPosition[0]+1][startPosition[1]+k] = '-';
          (document.getElementById(`my${startPosition[0]}_${startPosition[1]+k}`) as HTMLElement).classList.remove('empty');
          (document.getElementById(`my${startPosition[0]}_${startPosition[1]+k}`) as HTMLElement).classList.add('full');
          this.myShips[a][k] = [startPosition[0],startPosition[1]+k];
        }
      }
    }
  }

  private enemyRandomShips():void {
    this.enemyField = [
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','','']
    ];
    const shipDirection = ['vertical', 'horizontal'];
    const ships = [4,3,3,2,2,2,1,1,1,1];
    for (let a=0; a<10; a+=1) {
      const possibleVertical: object[] = [];
      const possibleHorizontal: object[] = [];
      const direction = shipDirection[Math.round(Math.random())];
      if (direction === 'vertical') {
        for (let i=0; i<11-ships[a]; i+=1) {
          for (let j=0; j<10; j+=1) {
            let result = 0;
            for (let k=0; k<ships[a]; k+=1) {
              result += Number(Boolean(this.enemyField[i+k][j]));
            }
            if (result === 0) possibleVertical.push([i,j]);
          }
        }
        const startPosition = possibleVertical[Math.round(Math.random()*(possibleVertical.length-1))];
        for (let k=0; k<ships[a]; k+=1) {
          this.enemyField[startPosition[0]+k][startPosition[1]] = 'x';
          if(k===0 && startPosition[0]>0) {
            this.enemyField[startPosition[0]+k-1][startPosition[1]] = '-';
            if(startPosition[1]>0) this.enemyField[startPosition[0]+k-1][startPosition[1]-1] = '-';
            if(startPosition[1]<9) this.enemyField[startPosition[0]+k-1][startPosition[1]+1] = '-';
          }
          if(k===ships[a]-1 && startPosition[0]<10-ships[a]) {
            this.enemyField[startPosition[0]+ships[a]][startPosition[1]] = '-';
            if(startPosition[1]>0) this.enemyField[startPosition[0]+ships[a]][startPosition[1]-1] = '-';
            if(startPosition[1]<9) this.enemyField[startPosition[0]+ships[a]][startPosition[1]+1] = '-';
          }
          if(startPosition[1]>0) this.enemyField[startPosition[0]+k][startPosition[1]-1] = '-';
          if(startPosition[1]<9) this.enemyField[startPosition[0]+k][startPosition[1]+1] = '-';
          this.enemyShips[a][k] = [startPosition[0]+k,startPosition[1]];
        }
      } else {
        for (let i=0; i<11-ships[a]; i+=1) {
          for (let j=0; j<10; j+=1) {
            let result = 0;
            for (let k=0; k<ships[a]; k+=1) {
              result += Number(Boolean(this.enemyField[j][i+k]));
            }
            if (result === 0) possibleHorizontal.push([j,i]);
          }
        }
        const startPosition = possibleHorizontal[Math.round(Math.random()*(possibleHorizontal.length-1))];
        for (let k=0; k<ships[a]; k+=1) {
          this.enemyField[startPosition[0]][startPosition[1]+k] = 'x';
          if(k===0 && startPosition[1]>0) {
            this.enemyField[startPosition[0]][startPosition[1]+k-1] = '-';
            if(startPosition[0]>0) this.enemyField[startPosition[0]-1][startPosition[1]+k-1] = '-';
            if(startPosition[0]<9) this.enemyField[startPosition[0]+1][startPosition[1]+k-1] = '-';
          }
          if(k===ships[a]-1 && startPosition[1]<10-ships[a]) {
            this.enemyField[startPosition[0]][startPosition[1]+ships[a]] = '-';
            if(startPosition[0]>0) this.enemyField[startPosition[0]-1][startPosition[1]+ships[a]] = '-';
            if(startPosition[0]<9) this.enemyField[startPosition[0]+1][startPosition[1]+ships[a]] = '-';
          }
          if(startPosition[0]>0) this.enemyField[startPosition[0]-1][startPosition[1]+k] = '-';
          if(startPosition[0]<9) this.enemyField[startPosition[0]+1][startPosition[1]+k] = '-';
          this.enemyShips[a][k] = [startPosition[0],startPosition[1]+k];
        }
      }
    }
  }

  private checkMyField():boolean {
    for (let i=0; i<10; i+=1) {
      for (let j=0; j<10; j+=1) {
        if (this.myField[i][j] === 'x') return true
      }
    }
    return false
  }
  private checkMyFieldBeforeStart():boolean {
    const paintedFieldsCoords:number[] = [];
    for (let i=0; i<10; i+=1) {
      for (let j=0; j<10; j+=1) {
        if (this.myField[i][j] === 'x') {
          paintedFieldsCoords.push(Number(i.toString()+j.toString()));
        }
      }
    }
    const boat4Position: number[] = [];
    const boat3Position: number[] = [];
    const boat2Position: number[] = [];
    const forbiddenCells: number[] = [];
    const boat1Position = paintedFieldsCoords;
    for (let i=0; i<paintedFieldsCoords.length; i+=1) {
      if(paintedFieldsCoords[i]+1 === paintedFieldsCoords[i+1]&& paintedFieldsCoords[i+1]+1 === paintedFieldsCoords[i+2]&& paintedFieldsCoords[i+2]+1 === paintedFieldsCoords[i+3] && Math.floor(paintedFieldsCoords[i]/10) ===  Math.floor(paintedFieldsCoords[i+3]/10)) {
        boat4Position.push(paintedFieldsCoords[i],paintedFieldsCoords[i]+1,paintedFieldsCoords[i]+2,paintedFieldsCoords[i]+3);
      }
       else if(paintedFieldsCoords.indexOf(paintedFieldsCoords[i]+10) !== -1 && paintedFieldsCoords.indexOf(paintedFieldsCoords[i]+20) !== -1 && paintedFieldsCoords.indexOf(paintedFieldsCoords[i]+30) !== -1) {
        boat4Position.push(paintedFieldsCoords[i],paintedFieldsCoords[i]+10,paintedFieldsCoords[i]+20,paintedFieldsCoords[i]+30);
      }
      else if(paintedFieldsCoords[i]+1 === paintedFieldsCoords[i+1]&& paintedFieldsCoords[i+1]+1 === paintedFieldsCoords[i+2] && Math.floor(paintedFieldsCoords[i]/10) ===  Math.floor(paintedFieldsCoords[i+2]/10)) {
        boat3Position.push(paintedFieldsCoords[i],paintedFieldsCoords[i]+1,paintedFieldsCoords[i]+2);
      }
      else if(paintedFieldsCoords.indexOf(paintedFieldsCoords[i]+10) !== -1 && paintedFieldsCoords.indexOf(paintedFieldsCoords[i]+20) !== -1) {
        boat3Position.push(paintedFieldsCoords[i],paintedFieldsCoords[i]+10,paintedFieldsCoords[i]+20);
      }
    
      else if(paintedFieldsCoords[i]+1 === paintedFieldsCoords[i+1] && Math.floor(paintedFieldsCoords[i]/10) ===  Math.floor(paintedFieldsCoords[i+1]/10)) {
        boat2Position.push(paintedFieldsCoords[i],paintedFieldsCoords[i]+1);
      }
      else if(paintedFieldsCoords.indexOf(paintedFieldsCoords[i]+10) !== -1) {
        boat2Position.push(paintedFieldsCoords[i], paintedFieldsCoords[i]+10);
      }
    }

    const boat4 = boat4Position //4
    const boat3 = boat3Position.filter(e => !(new Set(boat4)).has(e)); //6
    const boat2 = boat2Position.filter(e => !(new Set(boat3)).has(e)).filter(e => !(new Set(boat4)).has(e)); //6
    const boat1 = boat1Position.filter(e => !(new Set(boat2)).has(e)).filter(e => !(new Set(boat3)).has(e)).filter(e => !(new Set(boat4)).has(e)); //4

    for (let i=0; i<boat1.length; i+=1) {
      this.myShips[6+i][0] = boat1[i] > 9 ? boat1[i].toString().split('').map((el)=>Number(el)): [0, boat1[i]];
      forbiddenCells.push(boat1[i]-10, boat1[i]+10);
      if(boat1[i]%10 > 0) forbiddenCells.push(boat1[i]-1,boat1[i]-11,boat1[i]+9);
      if(boat1[i]%10 < 9) forbiddenCells.push(boat1[i]+1,boat1[i]+11,boat1[i]-9);
    }

    for (let i=0; i<boat2.length; i+=2) {
      this.myShips[3+i/2][0] = boat2[i] > 9 ? boat2[i].toString().split('').map((el)=>Number(el)) : [0, boat2[i]];
      this.myShips[3+i/2][1] = boat2[i+1] > 9 ? boat2[i+1].toString().split('').map((el)=>Number(el)) : [0, boat2[i+1]];
      if(boat2[i]+1 === boat2[i+1]){
        forbiddenCells.push(boat2[i]-10,boat2[i]-9);
        forbiddenCells.push(boat2[i]+10,boat2[i]+11);
        if(boat2[i]%10 > 0) forbiddenCells.push(boat2[i]-11, boat2[i]-1,boat2[i]+9);
        if(boat2[i]%10 < 8) forbiddenCells.push(boat2[i]-8, boat2[i]+2, boat2[i]+12);
      } else {
        forbiddenCells.push(boat2[i]-10,boat2[i]+20);
        if(boat2[i]%10 > 0) forbiddenCells.push(boat2[i]-11, boat2[i]-1,boat2[i]+9,boat2[i]+19);
        if(boat2[i]%10 < 9) forbiddenCells.push(boat2[i]-9, boat2[i]+1, boat2[i]+11, boat2[i]+21);
      }
    }

    for (let i=0; i<boat3.length; i+=3) {
      this.myShips[1+i/3][0] = boat3[i]>9? boat3[i].toString().split('').map((el)=>Number(el)): [0,boat3[i]];
      this.myShips[1+i/3][1] = boat3[i+1]>9? boat3[i+1].toString().split('').map((el)=>Number(el)): [0,boat3[i+1]];
      this.myShips[1+i/3][2] = boat3[i+2]>9? boat3[i+2].toString().split('').map((el)=>Number(el)): [0,boat3[i+2]];
      if(boat3[i]+1 === boat3[i+1] && boat3[i+1]+1 === boat3[i+2]){
        forbiddenCells.push(boat3[i]-10,boat3[i]-9,boat3[i]-8);
        forbiddenCells.push(boat3[i]+10,boat3[i]+11,boat3[i]+12);
        if(boat3[i]%10 > 0) forbiddenCells.push(boat3[i]-11, boat3[i]-1,boat3[i]+9);
        if(boat3[i]%10 < 7) forbiddenCells.push(boat3[i]-7, boat3[i]+3, boat3[i]+13);
      } else {
        forbiddenCells.push(boat3[i]-10,boat3[i]+30);
        if(boat3[i]%10 > 0) forbiddenCells.push(boat3[i]-11, boat3[i]-1,boat3[i]+9,boat3[i]+19,boat3[i]+29);
        if(boat3[i]%10 < 9) forbiddenCells.push(boat3[i]-9, boat3[i]+1, boat3[i]+11, boat3[i]+21, boat3[i]+31);
      }
    }

    for (let i=0; i<boat4.length; i+=4) {
      this.myShips[0][0] = boat4[i]>9? boat4[i].toString().split('').map((el)=>Number(el)): [0,boat4[i]];
      this.myShips[0][1] = boat4[i+1]>9? boat4[i+1].toString().split('').map((el)=>Number(el)): [0,boat4[i+1]];
      this.myShips[0][2] = boat4[i+2]>9? boat4[i+2].toString().split('').map((el)=>Number(el)): [0, boat4[i+2]];
      this.myShips[0][3] = boat4[i+3]>9? boat4[i+3].toString().split('').map((el)=>Number(el)): [0,boat4[i+3]];
      if(boat4[i]+1 === boat4[i+1] && boat4[i+1]+1 === boat4[i+2] && boat4[i+2]+1 === boat4[i+3]){
        forbiddenCells.push(boat4[i]-10,boat4[i]-9,boat4[i]-8,boat4[i]-7);
        forbiddenCells.push(boat4[i]+10,boat4[i]+11,boat4[i]+12,boat4[i]+13);
        if(boat4[i]%10 > 0) forbiddenCells.push(boat4[i]-11, boat4[i]-1,boat4[i]+9);
        if(boat4[i]%10 < 6) forbiddenCells.push(boat4[i]-6, boat4[i]+4, boat4[i]+14);
      } else {
        forbiddenCells.push(boat4[i]-10,boat4[i]+40);
        if(boat4[i]%10 > 0) forbiddenCells.push(boat4[i]-11, boat4[i]-1,boat4[i]+9,boat4[i]+19,boat4[i]+29,boat4[i]+39);
        if(boat4[i]%10 < 9) forbiddenCells.push(boat4[i]-9, boat4[i]+1, boat4[i]+11, boat4[i]+21, boat4[i]+31, boat4[i]+41);
      }
    }

    

    const allInOneArray = [...boat4Position,...boat3,...boat2,...boat1,...forbiddenCells];
    if (Array.from(new Set(allInOneArray)).length - Array.from(new Set(forbiddenCells)).length === 20 && boat4.length === 4 && boat3.length === 6&& boat2.length === 6&& boat1.length === 4){
      return true
    } else {
      return false
    }
  }

  private checkEnemyField():boolean {
    for (let i=0; i<10; i+=1) {
      for (let j=0; j<10; j+=1) {
        if (this.enemyField[i][j] === 'x') return true
      }
    }
    return false
  }

  private startBattle(): void {
    if(!this.checkMyFieldBeforeStart()) this.RandomShips();
    (document.querySelector('.battlefield_options') as HTMLElement).setAttribute('style', 'display: none');
    (document.getElementById('startBattleships') as HTMLElement).setAttribute('style', 'display: none');
    this.enemyRandomShips();
    this.addListeners();
    this.shot();
  }

  private addListeners(): void {
    const enemy = document.getElementById('enemyBattleField') as ParentNode;
    (enemy.querySelectorAll('.empty') as NodeListOf<HTMLElement>).forEach((el)=>el.addEventListener('click',(e) => {this.getShotResult(e)}, {once:true}))
  }

  private addListenersforMyField(): void {
    const my = document.getElementById('myBattleField') as ParentNode;
    (my.querySelectorAll('.empty') as NodeListOf<HTMLElement>).forEach((el)=>el.addEventListener('click',(e) => {this.paintBoats(e)}));
  }

  private paintBoats(event) {
    const coords = event.target.id.split('my')[1].split('_').map((el)=>Number(el));
    const target = document.getElementById(`my${coords[0]}_${coords[1]}`) as HTMLElement;
    if (this.myField[coords[0]][coords[1]] === 'x') {
      this.myField[coords[0]][coords[1]] = '';
      target.classList.remove('full');
      target.classList.add('empty');
    } else {
      this.myField[coords[0]][coords[1]] = 'x';
      target.classList.remove('empty');
      target.classList.add('full');
    }
  }

  private getShotResult(event) {
    const coords = event.target.id.split('enemy')[1].split('_').map((el)=>Number(el));
    const target = document.getElementById(`enemy${coords[0]}_${coords[1]}`) as HTMLElement
    if (this.enemyField[coords[0]][coords[1]] === 'x') {
      this.enemyField[coords[0]][coords[1]] = 'o';
      target.classList.remove('empty');
      target.classList.add('full');
      target.classList.add('fire');
      const alive = this.isAlive([coords[0],coords[1]]);
      if (!alive) {
        this.bombAroundDead([coords[0],coords[1]]);
      }
      if (!this.checkEnemyField()) this.endGame('me');
    } else {
      target.classList.remove('empty');
      target.classList.add('miss');
      this.turn = 1;
      this.shot();
      if (!this.checkMyField()) this.endGame('comp');
    }
  }

  private shot(): void {
    if (this.turn === 0) {
      (document.getElementById('enemyBattleField') as HTMLElement).setAttribute('style', 'pointer-events: auto');
      this.turn = 1;
    } else {
      (document.getElementById('enemyBattleField') as HTMLElement).setAttribute('style', 'pointer-events: none');
      this.compShot();
      this.turn = 0;
    }
  }

  private compShot():void {
    let shot: number[] = [];
    let target;
    let random: number;
    const possibles:number[][] = [];
    if (this.lastShot.length !== 0) {
      this.highProbability = [];
      if (this.lastShot.length>1) {
        if (this.lastShot[0][0] === this.lastShot[1][0]) {
          const numbersInRow:number[] = [];
          for (let x=0;x<this.lastShot.length; x+=1) {
            numbersInRow.push(this.lastShot[x][1])
          }
          if (Math.min(...numbersInRow)>0) {
            if (!((document.getElementById(`my${this.lastShot[0][0]}_${Math.min(...numbersInRow)-1}`) as HTMLElement).classList.contains('miss') || (document.getElementById(`my${this.lastShot[0][0]}_${Math.min(...numbersInRow)-1}`) as HTMLElement).classList.contains('fire'))) {
              this.highProbability.push([this.lastShot[0][0],Math.min(...numbersInRow)-1]);
            }
          }
          if (Math.max(...numbersInRow)<9) {
            if (!((document.getElementById(`my${this.lastShot[0][0]}_${Math.max(...numbersInRow)+1}`) as HTMLElement).classList.contains('miss') || (document.getElementById(`my${this.lastShot[0][0]}_${Math.max(...numbersInRow)+1}`) as HTMLElement).classList.contains('fire'))) {
              this.highProbability.push([this.lastShot[0][0],Math.max(...numbersInRow)+1]);
            }
          }
        } else if (this.lastShot[0][1] === this.lastShot[1][1]) {
          const numbersInRow:number[] = [];
          for (let x=0;x<this.lastShot.length; x+=1) {
            numbersInRow.push(this.lastShot[x][0])
          }
          if (Math.min(...numbersInRow)>0) {
            if (!((document.getElementById(`my${Math.min(...numbersInRow)-1}_${this.lastShot[0][1]}`) as HTMLElement).classList.contains('miss') || (document.getElementById(`my${Math.min(...numbersInRow)-1}_${this.lastShot[0][1]}`) as HTMLElement).classList.contains('fire'))) {
              this.highProbability.push([Math.min(...numbersInRow)-1,this.lastShot[0][1]]);
            }
          }
          if (Math.max(...numbersInRow)<9) {
            if (!((document.getElementById(`my${Math.max(...numbersInRow)+1}_${this.lastShot[0][1]}`) as HTMLElement).classList.contains('miss') || (document.getElementById(`my${Math.max(...numbersInRow)+1}_${this.lastShot[0][1]}`) as HTMLElement).classList.contains('fire'))) {
              this.highProbability.push([Math.max(...numbersInRow)+1,this.lastShot[0][1]]);
            }
          }
        }
        random = Math.round(Math.random()*(this.highProbability.length-1));
        shot = this.highProbability[random];
        target = document.getElementById(`my${shot[0]}_${shot[1]}`) as HTMLElement;
      } else {
        if (this.lastShot[0][0]>0) {
          if (!((document.getElementById(`my${this.lastShot[0][0]-1}_${this.lastShot[0][1]}`) as HTMLElement).classList.contains('miss') || (document.getElementById(`my${this.lastShot[0][0]-1}_${this.lastShot[0][1]}`) as HTMLElement).classList.contains('fire'))) {
            possibles.push([this.lastShot[0][0]-1,this.lastShot[0][1]])
          }
        }
        if (this.lastShot[0][0]<9) {
          if (!((document.getElementById(`my${this.lastShot[0][0]+1}_${this.lastShot[0][1]}`) as HTMLElement).classList.contains('miss') || (document.getElementById(`my${this.lastShot[0][0]+1}_${this.lastShot[0][1]}`) as HTMLElement).classList.contains('fire'))) {
            possibles.push([this.lastShot[0][0]+1,this.lastShot[0][1]])
          }
        }
        if (this.lastShot[0][1]>0) {
          if (!((document.getElementById(`my${this.lastShot[0][0]}_${this.lastShot[0][1]-1}`) as HTMLElement).classList.contains('miss') || (document.getElementById(`my${this.lastShot[0][0]}_${this.lastShot[0][1]-1}`) as HTMLElement).classList.contains('fire'))) {
            possibles.push([this.lastShot[0][0],this.lastShot[0][1]-1])
          }
        }
        if (this.lastShot[0][1]<9) {
          if (!((document.getElementById(`my${this.lastShot[0][0]}_${this.lastShot[0][1]+1}`) as HTMLElement).classList.contains('miss') || (document.getElementById(`my${this.lastShot[0][0]}_${this.lastShot[0][1]+1}`) as HTMLElement).classList.contains('fire'))) {
            possibles.push([this.lastShot[0][0],this.lastShot[0][1]+1])
          }
        }
        random = Math.round(Math.random()*(possibles.length-1));
        shot = possibles[random];
        target = document.getElementById(`my${shot[0]}_${shot[1]}`) as HTMLElement;
      }
    } else if(!this.is4Dead && !this.is4Bleed) { 
      random = Math.round(Math.random()*(this.compStrategy1.length-1));
      shot = this.compStrategy1[random];
      target = document.getElementById(`my${shot[0]}_${shot[1]}`) as HTMLElement;
    } else if(!this.is3Dead && !this.is3Bleed) { 
      random = Math.round(Math.random()*(this.compStrategy2.length-1));
      shot = this.compStrategy2[random];
      if (random<=this.compStrategy1.length) this.compStrategy1.splice(random,1);
      target = document.getElementById(`my${shot[0]}_${shot[1]}`) as HTMLElement;
    } else if(!this.is2Dead && !this.is2Bleed) { 
      random = Math.round(Math.random()*(this.compStrategy2.length-1));
      shot = this.compStrategy2[random];
      if (random<=this.compStrategy1.length) this.compStrategy1.splice(random,1);
      target = document.getElementById(`my${shot[0]}_${shot[1]}`) as HTMLElement;
    } else {
      const variants = this.getAllMyPossibleCells();
      random = Math.round(Math.random()*(variants.length-1));
      shot = variants[random];
      target = document.getElementById(`my${shot[0]}_${shot[1]}`) as HTMLElement;
    }
    let index = -5;
    for (let c=0; c<this.compStrategy1.length; c+=1) {
      if (shot[0] === this.compStrategy1[c][0] && shot[1] === this.compStrategy1[c][1]) {
        index = c;
        if (index>=0){
          this.compStrategy1.splice(index,1);
        }
      }
    }
    for (let c=0; c<this.compStrategy2.length; c+=1) {
      if (shot[0] === this.compStrategy2[c][0] && shot[1] === this.compStrategy2[c][1]) {
        index = c;
        if (index>=0){
          this.compStrategy2.splice(index,1);
        }
      }
    }
    if (this.myField[shot[0]][shot[1]] === 'x') {
      this.myField[shot[0]][shot[1]] = 'o';
      target.classList.remove('empty');
      target.classList.remove('miss'); //страховка от лагов, по факту не нужна строчка
      target.classList.add('full');
      target.classList.add('fire');
      const alive = this.isMyAlive([shot[0],shot[1]]);
      const myBoatNumber = this.getMyBoatNumber([shot[0],shot[1]]);
      if (!alive) {
        if (myBoatNumber === 0) this.is4Dead = true;
        else if (myBoatNumber < 3 && this.is3Dead1) this.is3Dead = true;
        else if (myBoatNumber < 3) this.is3Dead1 = true;
        else if (myBoatNumber < 6 && this.is2Dead2) this.is2Dead = true;
        else if (myBoatNumber < 6 && this.is2Dead1) this.is2Dead2 = true;
        else if (myBoatNumber < 6) this.is2Dead1 = true;
        this.bombAroundMyDead([shot[0],shot[1]]);
        this.lastShot = []; 
        this.highProbability = [];
        if (myBoatNumber === 0) this.is4Bleed = false;
        else if (myBoatNumber < 3) this.is3Bleed = false;
        else if (myBoatNumber < 6) this.is2Bleed = false;
      } else {
        if (myBoatNumber === 0) this.is4Bleed = true;
        else if (myBoatNumber < 3) this.is3Bleed = true;
        else if (myBoatNumber < 6) this.is2Bleed = true;
        this.lastShot.unshift(shot);
      }
      if (!this.checkMyField()) this.endGame('comp');
      setTimeout(()=>{this.compShot()},500);
    } else {
      this.myField[shot[0]][shot[1]] = '*';
      target.classList.remove('empty');
      target.classList.add('miss');
      this.turn = 0;
      this.shot();
    }
  }

  private getEnemyBoatNumber([x,y]:number[]): number {
    for (let i=0; i<10; i+=1) {
      for (let j=0; j<this.enemyShips[i].length; j+=1){
        if (this.enemyShips[i][j][0] === x && this.enemyShips[i][j][1] === y) return i 
      }
    }
    return 999;
  }

  private getMyBoatNumber([x,y]:number[]): number {
    for (let i=0; i<10; i+=1) {
      for (let j=0; j<this.myShips[i].length; j+=1){
        if (this.myShips[i][j][0] === x && this.myShips[i][j][1] === y) return i 
      }
    }
    return 999;
  }

  private isAlive([x,y]:number[]):boolean {
    const i = this.getEnemyBoatNumber([x,y]);
    for (let k=0; k<this.enemyShips[i].length; k+=1) {
      if (this.enemyField[this.enemyShips[i][k][0]][this.enemyShips[i][k][1]] === 'x') {
        return true
      }
    }    
    return false
  }

  private isMyAlive([x,y]:number[]):boolean {
    const i = this.getMyBoatNumber([x,y]);
    for (let k=0; k<this.myShips[i].length; k+=1) {
      if (this.myField[this.myShips[i][k][0]][this.myShips[i][k][1]] === 'x') {
        return true
      }
    }
    return false
  }

  private bombAroundDead([x,y]:number[]):void{
    const result: string[] = [];
    const currentShip: string[] = [];
    for (let i=0; i<10; i+=1) {
      for (let j=0; j<this.enemyShips[i].length; j+=1){
        if (this.enemyShips[i][j][0] === x && this.enemyShips[i][j][1] === y) {
          for (let k=0; k<this.enemyShips[i].length; k+=1) {
            result.push((this.enemyShips[i][k][0]-1).toString()+this.enemyShips[i][k][1].toString());
            result.push((this.enemyShips[i][k][0]-1).toString()+(this.enemyShips[i][k][1]-1).toString());
            result.push((this.enemyShips[i][k][0]-1).toString()+(this.enemyShips[i][k][1]+1).toString());
            result.push((this.enemyShips[i][k][0]).toString()+(this.enemyShips[i][k][1]-1).toString());
            result.push((this.enemyShips[i][k][0]).toString()+(this.enemyShips[i][k][1]+1).toString());
            result.push((this.enemyShips[i][k][0]+1).toString()+this.enemyShips[i][k][1].toString());
            result.push((this.enemyShips[i][k][0]+1).toString()+(this.enemyShips[i][k][1]-1).toString());
            result.push((this.enemyShips[i][k][0]+1).toString()+(this.enemyShips[i][k][1]+1).toString());
            currentShip.push((this.enemyShips[i][k][0]).toString()+(this.enemyShips[i][k][1]).toString());
          }
        }
      }
    }
    const result2 = result.filter((el)=>el.split('').length<3);
    const result3 = result2.filter((el)=>!el.includes('-'));
    const result4 = Array.from(new Set(result3)).filter((el)=>!(new Set(currentShip).has(el)));
    for (let i=0; i<result4.length; i+=1) {
      const target = document.getElementById(`enemy${result4[i].split('')[0]}_${result4[i].split('')[1]}`) as HTMLElement;
      target.classList.remove('empty');
      target.classList.add('miss');
      target.replaceWith(target.cloneNode(true));
    }
  }

  private bombAroundMyDead([x,y]:number[]):void{
    const result: string[] = [];
    const currentShip: string[] = [];
    for (let i=0; i<10; i+=1) {
      for (let j=0; j<this.myShips[i].length; j+=1){
        if (this.myShips[i][j][0] === x && this.myShips[i][j][1] === y) {
          for (let k=0; k<this.myShips[i].length; k+=1) {
            result.push((this.myShips[i][k][0]-1).toString()+this.myShips[i][k][1].toString());
            result.push((this.myShips[i][k][0]-1).toString()+(this.myShips[i][k][1]-1).toString());
            result.push((this.myShips[i][k][0]-1).toString()+(this.myShips[i][k][1]+1).toString());
            result.push((this.myShips[i][k][0]).toString()+(this.myShips[i][k][1]-1).toString());
            result.push((this.myShips[i][k][0]).toString()+(this.myShips[i][k][1]+1).toString());
            result.push((this.myShips[i][k][0]+1).toString()+this.myShips[i][k][1].toString());
            result.push((this.myShips[i][k][0]+1).toString()+(this.myShips[i][k][1]-1).toString());
            result.push((this.myShips[i][k][0]+1).toString()+(this.myShips[i][k][1]+1).toString());
            currentShip.push((this.myShips[i][k][0]).toString()+(this.myShips[i][k][1]).toString());
          }
        }
      }
    }
    const result2 = result.filter((el)=>el.split('').length<3);
    const result3 = result2.filter((el)=>!el.includes('-'));
    const result4 = Array.from(new Set(result3)).filter((el)=>!(new Set(currentShip).has(el)));
    for (let i=0; i<result4.length; i+=1) {
      const target = document.getElementById(`my${result4[i].split('')[0]}_${result4[i].split('')[1]}`) as HTMLElement;
      this.myField[result4[i].split('')[0]][result4[i].split('')[1]] = '*';
      target.classList.remove('empty');
      target.classList.add('miss');
      let index = -5;
      for (let c=0; c<this.compStrategy1.length; c+=1) {
        if (Number(result4[i].split('')[0]) === this.compStrategy1[c][0] && Number(result4[i].split('')[1]) === this.compStrategy1[c][1]) {
          index = c;
          if (index>=0){
            this.compStrategy1.splice(index,1);
          }
        }
      }
      for (let c=0; c<this.compStrategy2.length; c+=1) {
        if (Number(result4[i].split('')[0]) === this.compStrategy2[c][0] && Number(result4[i].split('')[1]) === this.compStrategy2[c][1]) {
          index = c;
          if (index>=0){
            this.compStrategy2.splice(index,1);
          }
        }
      }
      target.replaceWith(target.cloneNode(true));
    }
  }

  private getAllMyPossibleCells(): number[][] {
    const result: number[][] = [];
    for (let i=0; i<this.myField.length;i+=1) {
      for (let j=0; j<this.myField[i].length;j+=1){
        if (this.myField[i][j]!=='o' && this.myField[i][j]!=='*') result.push([i,j])
      }
    }
    return result;
  }

  private endGame(winner:string): void {
    (document.getElementById('result') as HTMLElement).setAttribute('style', 'display:block');
    const text = winner==='me'? 'Вы победили!':'Ваш противник победил!' ;
    (document.getElementById('result') as HTMLElement).innerHTML = `Игра окончена.<br>${text}`;
    (document.getElementById('newBattleships') as HTMLElement).setAttribute('style', 'display:flex');
  }

  private notRandomShips(): void {
    this.myField = [
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['','','','','','','','','','']
    ];
    (document.querySelectorAll('.full') as NodeListOf<HTMLElement>).forEach((el)=>el.classList.add('empty'));
    (document.querySelectorAll('.full') as NodeListOf<HTMLElement>).forEach((el)=>el.classList.remove('full'));
    (document.getElementById('advice') as HTMLParagraphElement).setAttribute('style', 'display:block');
    (document.getElementById('randomShips') as HTMLElement).setAttribute('style', 'display:none');
    (document.getElementById('notRandomShips') as HTMLElement).setAttribute('style', 'display:none');
    this.addListenersforMyField();
  }


  public async after_render(): Promise<void> {
    (document.getElementById('randomShips') as HTMLElement).addEventListener('click', this.RandomShips.bind(this));
    (document.getElementById('notRandomShips') as HTMLElement).addEventListener('click', this.notRandomShips.bind(this));
    (document.getElementById('startBattleships') as HTMLElement).addEventListener('click', this.startBattle.bind(this));
    (document.getElementById('newBattleships') as HTMLElement).addEventListener('click',()=>window.location.reload());
    return;
  }
}

export default Battleships