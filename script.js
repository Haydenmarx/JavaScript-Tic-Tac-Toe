const games = {
};
const players = {
}

class ticTacToe {
  constructor(playerO, playerX, piece) {
    piece === 1 ? piece = 1 : piece = 0;
    playerO === undefined ? playerO = '0' : playerO;
    playerX === undefined ? playerX = '1' : playerX;
    this.piece = piece;
    this.board = [
      null,null,null,
      null,null,null,
      null,null,null
    ];
    this.gameover = false;
    this.playerO=playerO;
    this.playerX=playerX;
  }
  getPiece() {
    return this.piece;
  }
  setPiece(square) {
    this.updateBoard(square);
    this.piece === 0 ? this.piece = 1 : this.piece = 0;
  }
  getPlayers(){
    return [this.playerO, this.playerX];
  }
  updateBoard(square) {
    this.board[square] = this.piece;
  }
  checkWinningMoves(currentPiece) {
    let board = this.board.slice();
    let winning = [];
    if (currentPiece !== undefined) {
      board[currentPiece] = this.piece;
    }
    if (board[4] === this.piece) {
      if (board[1] === this.piece && board[7] === this.piece) {
        winning.push([1,4,7]);
      }
      if (board[3] === this.piece && board[5] === this.piece) {
        winning.push([3,4,5]);
      }
      if (board[0] === this.piece && board[8] === this.piece) {
        winning.push([0,4,8]);
      }
      if (board[2] === this.piece && board[6] === this.piece) {
        winning.push([2,4,6]);
      }
    }
    if(board[0] === this.piece) {
      if (board[1] === this.piece && board[2] === this.piece) {
        winning.push([0,1,2]);
      }
      if (board[3] === this.piece && board[6] === this.piece) {
        winning.push([0,3,6]);
      }
    }
    if (board[8] === this.piece) {
      if (board[6] === this.piece && board[7] === this.piece) {
        winning.push([6,7,8]);
      }
      if (board[2] === this.piece && board[5] === this.piece) {
        winning.push([2,5,8]);
      }
    }
    return winning;
  }
  gameOver() {
    this.gameover = !this.gameover;
    this.setPiece();
  }
  updateScoreBoard() {
    this.setPiece();
    let winning = {};
    winning.player = this.piece === 0 ? this.playerO : this.playerX;
    winning.piece = this.piece === 0 ? 'O' : 'X';
    winning.board = this.board;
    return winning;
  }
}

const createGame = () => {
  let game = new ticTacToe('id0', 'id1');
  let newID = Object.keys(games).length;
  const newBoard = generateBoard(newID);
  newBoard.addEventListener('click', gameboards);
  newBoard.addEventListener('mouseover', showPreview);
  newBoard.addEventListener('mouseout', hidePreview);
  document.getElementById('games').prepend(newBoard);
  games[`tic-tac-toe-board-${newID}`] = game;
}

const gameboards = (e) => {
  const gameID = e.path !== undefined ? e.path[3].id : e.composedPath()[3].id;
  if (e.target.classList[0] === 'temp' && games[gameID].gameover === false) {
    setPiece(e.target, games[gameID]);
  }
  if (e.target.classList.value === 'reset') {
    const resetGameID = e.path !== undefined ? e.path[1].id : e.composedPath()[1].id;
    reset(resetGameID);
  }
}

const setPiece = (square, game) => {
  square.classList.toggle('temp');  
  square.classList.toggle('visible');  
  square.parentNode.classList.toggle('taken');
  if (game.checkWinningMoves(square.parentNode.classList[1].slice(6)).length > 0) {
    console.log('WINNER')
    game.gameOver();
    let winner;
    updateScoreBoard(game.updateScoreBoard());
  };
  game.setPiece(square.parentNode.classList[1].slice(6));
}

const reset = (boardID) => {
  const unset = document.getElementsByClassName('visible');
  let players = games[boardID].getPlayers();
  games[boardID] = new ticTacToe(players[0], players[1]);
  for (var x=0; x<unset.length;) {
    if (unset[x].parentNode.parentNode.parentNode.id === boardID) {
      unset[x].parentNode.classList.toggle('taken');
      unset[x].parentNode.classList.remove('winner');
      unset[x].classList.toggle('invisible');
      unset[x].classList.toggle('visible');
    } else {
      x++;
    }
  }
}

const showPreview = (e) => {
  const square = e.target;
  const gameID = e.path !== undefined ? e.path[2].id : e.composedPath()[2].id;
  const game = games[gameID];
  if (square.classList[0] === 'square' && game.gameover === false) {
    let winning = game.checkWinningMoves(square.classList[1].slice(6));
    winning.forEach(winner => {
      if(Array.isArray(winner)) {
        winner.forEach(otherSquare=>{
          const gamename = e.path !== undefined ? e.path[2] : e.composedPath()[2];
          if (otherSquare ===0)gamename.children[0].children[0].classList.toggle('winner');
          if (otherSquare ===1)gamename.children[0].children[2].classList.toggle('winner');
          if (otherSquare ===2)gamename.children[0].children[4].classList.toggle('winner');
          if (otherSquare ===3)gamename.children[2].children[0].classList.toggle('winner');
          if (otherSquare ===4)gamename.children[2].children[2].classList.toggle('winner');
          if (otherSquare ===5)gamename.children[2].children[4].classList.toggle('winner');
          if (otherSquare ===6)gamename.children[4].children[0].classList.toggle('winner');
          if (otherSquare ===7)gamename.children[4].children[2].classList.toggle('winner');
          if (otherSquare ===8)gamename.children[4].children[4].classList.toggle('winner');
        })
      }
    })
    square.children[game.getPiece()].classList.toggle('invisible');
    square.children[game.getPiece()].classList.toggle('temp');
  }
}

const hidePreview = (e) => {
  const square = e.target;
  if (square.classList[0] === 'temp') {
    const gold = document.getElementsByClassName('winner');
    for(var x=0; x<gold.length;) {
      gold[x].classList.toggle('winner');
    }
    square.classList.toggle('invisible');
    square.classList.toggle('temp');
  }
}

const updateScoreBoard = (winner) => {
  console.log(players, winner);
  players[winner.player].score ++;
  players[winner.player][winner.piece]++;
  players[winner.player].games.push(winner.board);
  //id01: {name:'O', score:0, O:0, X:0, games:[]},
  document.getElementById(`score-${winner.player}`).innerText = players[winner.player].score;
}

const createPlayer = (name) => {
  const playerID = `id${Object.keys(players).length}`; 
  players[playerID] = {score: 0, O:0, X:0, games:[]};
  players[playerID].name = name;
}

const updateUserName = (name, playerID) => {
  players[playerID].name = name;
}

const generateBoard = (id) => {
  let board = document.createElement('div');
  board.id = `tic-tac-toe-board-${id}`;
  board.classList.toggle('tic-tac-toe-board');
  board.innerHTML =   (
    `
    <div class=row>
      <div class="square square0">
        <span class="invisible">O</span>
        <span class="invisible">X</span>
      </div>
      <div class="upright-divider upper-divider"></div>
      <div class="square square1">
        <span class="invisible">O</span>
        <span class="invisible">X</span>
      </div>
      <div class="upright-divider upper-divider"></div>
      <div class="square square2">
        <span class="invisible">O</span>
        <span class="invisible">X</span>
      </div>
    </div>
    <div class="divider-row"></div>
    <div class=row>
      <div class="square square3">
        <span class="invisible">O</span>
        <span class="invisible">X</span>
      </div>
      <div class="upright-divider"></div>
      <div class="square square4">
        <span class="invisible">O</span>
        <span class="invisible">X</span>
      </div>
      <div class="upright-divider"></div>
      <div class="square square5">
        <span class="invisible">O</span>
        <span class="invisible">X</span>
      </div>
    </div>
    <div class="divider-row"></div>
    <div class=row>
      <div class="square square6">
        <span class="invisible">O</span>
        <span class="invisible">X</span>
      </div>
      <div class="upright-divider lower-divider"></div>
      <div class="square square7">
        <span class="invisible">O</span>
        <span class="invisible">X</span>
      </div>
      <div class="upright-divider lower-divider"></div>
      <div class="square square8">
        <span class="invisible">O</span>
        <span class="invisible">X</span>
      </div>
    </div>
    <button class="reset">RESET</button>
    `
  )
  return board;
}

document.getElementById('new-game').addEventListener('click',e=>createGame());

createGame();
createPlayer('O');
createPlayer('X');