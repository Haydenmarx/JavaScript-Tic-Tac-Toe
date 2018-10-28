const games = {};
const players = {};

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
    if (square !== undefined) this.updateBoard(square);
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

const selectPlayers = () => {
  let newID = Object.keys(games).length;
  const newBoard = generatePlayerSelection(newID);
  newBoard.addEventListener('click', gameboards);
  newBoard.addEventListener('mouseover', showPreview);
  newBoard.addEventListener('mouseout', hidePreview);
  document.getElementById('games').prepend(newBoard);
  games[`tic-tac-toe-board-${newID}`] = null;
}

const createGame = (board, player1, player2) => {
  let game = new ticTacToe(player1, player2);
  generateBoard(board, players[player1].name);
  games[board.id] = game;
  console.log(games);
}

const gameboards = (e) => {
  const gameID = e.path !== undefined ? e.path[3].id : e.composedPath()[3].id;
  if (e.target.classList[0] === 'temp' && games[gameID].gameover === false) {
    const gameBoard = e.path !== undefined ? e.path[3] : e.composedPath()[3];
    setPiece(e.target, games[gameID], gameBoard);
  }
  if (e.target.classList.contains('quit')) {
    endGame(games[e.target.parentNode.id], e.target.parentNode);
  }
  if (e.target.classList.contains('close')) {
    hideBoard(e.target.parentNode);
  }
  if (e.target.classList.contains('start')) {
    createGame(e.target.parentNode, e.target.parentNode.children[1].value, e.target.parentNode.children[3].value);
  }
}

const setPiece = (square, game, gameBoard) => {
  square.classList.toggle('temp');  
  square.classList.toggle('visible');  
  square.parentNode.classList.toggle('taken');
  const checkWinning = game.checkWinningMoves(square.parentNode.classList[1].slice(6));
  if (checkWinning.length > 0) {
    endGame(game, gameBoard, checkWinning);
  } else {
    game.setPiece(square.parentNode.classList[1].slice(6));
    gameBoard.children[0].children[0].firstChild.innerText = players[game.getPlayers()[game.getPiece()]].name;
  }
}

const endGame = (game, gameBoard, winningMoves=[]) => {
  game.gameOver();
  if (winningMoves.length > 0) {
    toggleBoardClasses(gameBoard, winningMoves, ['won'], ['winner']);
    gameBoard.children[0].children[0].children[1].innerText = 'Won!';
  } else {
    gameBoard.children[0].children[0].children[1].innerText = 'Forfeited!';
    game.setPiece();
  }
  updateScoreBoard(game.updateScoreBoard());
  gameBoard.children[6].classList.add('invisible');
  gameBoard.children[7].classList.remove('invisible');
}

const reset = (boardID) => {
  const unset = document.getElementsByClassName('visible');
  let players = games[boardID].getPlayers();
  games[boardID] = new ticTacToe(players[0], players[1]);
  for (var x=0; x<unset.length;) {
    if (unset[x].parentNode.parentNode.parentNode.id === boardID) {
      unset[x].parentNode.classList.remove('taken', 'winner', 'won');
      unset[x].classList.toggle('invisible');
      unset[x].classList.toggle('visible');
    } else {
      x++;
    }
  }
}

const hideBoard = (board) => {
  board.removeEventListener('click', gameboards);
  board.removeEventListener('mouseover', showPreview);
  board.removeEventListener('mouseout', hidePreview);
  board.classList.add('invisible');
}

const showPreview = (e) => {
  const square = e.target;
  const gameID = e.path !== undefined ? e.path[2].id : e.composedPath()[2].id;
  const game = games[gameID];
  if (square.classList[0] === 'square' && game.gameover === false) {
    const winning = game.checkWinningMoves(square.classList[1].slice(6));
    const gamename = e.path !== undefined ? e.path[2] : e.composedPath()[2];
    toggleBoardClasses(gamename, winning, ['winner']);
    square.children[game.getPiece()].classList.toggle('invisible');
    square.children[game.getPiece()].classList.toggle('temp');
  }
}

const toggleBoardClasses = (selectedGame, matrix, add=['void'], remove=['void']) => {
  matrix.forEach(arr => {
    if(Array.isArray(arr)) {
      arr.forEach(square => {
        if (square === 0) {
          selectedGame.children[1].children[0].classList.add(...add);
          selectedGame.children[1].children[0].classList.remove(...remove);
        }
        if (square === 1) {
          selectedGame.children[1].children[2].classList.add(...add);
          selectedGame.children[1].children[2].classList.remove(...remove);
        }
        if (square === 2) {
          selectedGame.children[1].children[4].classList.add(...add);
          selectedGame.children[1].children[4].classList.remove(...remove);
        }
        if (square === 3) {
          selectedGame.children[3].children[0].classList.add(...add);
          selectedGame.children[3].children[0].classList.remove(...remove);
        }
        if (square === 4) {
          selectedGame.children[3].children[2].classList.add(...add);
          selectedGame.children[3].children[2].classList.remove(...remove);
        }
        if (square === 5) {
          selectedGame.children[3].children[4].classList.add(...add);
          selectedGame.children[3].children[4].classList.remove(...remove);
        }
        if (square === 6) {
          selectedGame.children[5].children[0].classList.add(...add);
          selectedGame.children[5].children[0].classList.remove(...remove);
        }
        if (square === 7) {
          selectedGame.children[5].children[2].classList.add(...add);
          selectedGame.children[5].children[2].classList.remove(...remove);
        }
        if (square === 8) {
          selectedGame.children[5].children[4].classList.add(...add);
          selectedGame.children[5].children[4].classList.remove(...remove);
        }
      })
    }
  })
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

const addPlayerToScoreBoard = (playerID) => {
  let newPlayer = document.createElement('tr');
  newPlayer.innerHTML = (
    `
    <tr>
      <td id="name-${playerID}">${players[playerID].name}</td>
      <td id="score-${playerID}">${players[playerID].score}</td>
      <td id="x-wins-${playerID}">${players[playerID].X}</td>
      <td id="o-wins-${playerID}">${players[playerID].O}</td>
    </tr>
    `
  );
  document.getElementById('scoreboard').children[1].append(newPlayer);
}

const updateScoreBoard = (winner) => {
  players[winner.player].score ++;
  players[winner.player][winner.piece]++;
  players[winner.player].games.push(winner.board);
  //id01: {name:'O', score:0, O:0, X:0, games:[]},
  document.getElementById(`score-${winner.player}`).innerText = players[winner.player].score;
  document.getElementById(`${String.toLowerCase(winner.piece)}-wins-${winner.player}`).innerText = players[winner.player][winner.piece];
}

const createPlayer = (name) => {
  const playerID = `id${Object.keys(players).length}`; 
  players[playerID] = {score: 0, O:0, X:0, games:[]};
  players[playerID].name = name;
  addPlayerToScoreBoard(playerID);
  addPlayerToPlayerSelection(playerID, name);
}

const updateUserName = (name, playerID) => {
  players[playerID].name = name;
}

const generateBoard = (board, player1) => {
  board.innerHTML =   (
    `
    <div class="banner"><h2><span>${player1}</span>'s <span>Turn</span></h2></div>
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
    <button class="quit">QUIT</button>
    <button class="close invisible">CLOSE</button>
    `
  )
  return board;
}

const generatePlayerSelection = (id) => {
  const board = document.createElement('div');
  board.id = `tic-tac-toe-board-${id}`;
  board.classList.toggle('tic-tac-toe-board');
  const player1 = document.createElement('h3');
  player1.classList.add('player-select-caption');
  player1.innerText = 'O (Moves First):';
  player2 = player1.cloneNode(true);
  player2.innerText = 'X (Moves Second):';
  const dropdown = document.createElement('select');
  dropdown.classList.add('player-select-dropdown');
  Object.keys(players).forEach(player=>{
    const newPlayer = document.createElement('option');
    newPlayer.value = player;
    newPlayer.innerText = players[player].name;
    dropdown.append(newPlayer);
  })
  const startButton = document.createElement('button');
  startButton.classList.add('start');
  startButton.innerText = 'Start';
  board.appendChild(player1);
  board.append(dropdown);
  board.appendChild(player2);
  board.append(dropdown.cloneNode(true));
  board.append(startButton);
  return board;
}

const addPlayerToPlayerSelection = (playerID, playerName) => {

  const dropdowns = document.getElementsByClassName('player-select-dropdown');
  const newSelector = document.createElement('option');
  newSelector.value = playerID;
  newSelector.innerText = playerName;
  for (var x=0; x<dropdowns.length; x++) {
    dropdowns[x].appendChild(newSelector.cloneNode(true));
  }
}

document.getElementById('new-game').addEventListener('click', e=>selectPlayers());
document.getElementById('new-player').addEventListener('click',e=>{
  let name = document.getElementById('player-name');
  if (name.value) {
    createPlayer(name.value);
    name.classList.remove('missing-information');
  } else {
    name.classList.add('missing-information');
  }
})
createPlayer('Player 1');
createPlayer('Player 2');
createPlayer('Player 3');
selectPlayers();
