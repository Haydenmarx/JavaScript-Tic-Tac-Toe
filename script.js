const games = {
};

class ticTacToe {
  constructor(piece) {
    piece === 1 ? piece = 1 : piece = 0;
    this.piece = piece;
    this.board = [
      null,null,null,
      null,null,null,
      null,null,null
    ];
    this.gameover = false;
  }
  getPiece() {
    return this.piece;
  }
  setPiece(square) {
    this.updateBoard(square);
    this.piece === 0 ? this.piece = 1 : this.piece = 0;
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
}



const create_game = () => {
  let game = new ticTacToe();
  let newID = Object.keys(games).length;
  const newBoard = generateBoard(newID);
  console.log('NEW BOARD: ', newBoard);
  newBoard.addEventListener('click', gameboards);
  newBoard.addEventListener('mouseover', showPreview);
  newBoard.addEventListener('mouseout', hidePreview);
  document.getElementById('games').appendChild(newBoard);
  games[`tic-tac-toe-board-${newID}`] = game;
}

const gameboards = (e) => {
  const gameID = e.path !== undefined ? e.path[3].id : e.composedPath()[3].id;
  if (e.target.classList[0] === 'temp' && games[gameID].gameover === false) {
    // console.log(e.path)
    // console.log(games[e.path[3].id]);
    setPiece(e.target, games[gameID]);
  } else {
    console.log('invalid move');
  }
  if (e.target.classList.value === 'reset') {
    const resetGameID = e.path !== undefined ? e.path[1].id : e.composedPath()[1].id;
    reset(resetGameID);
  }
}

const setPiece = (square, game) => {
  // console.log(square.parentNode.classList[1].slice(6), game);
  // square.children[game.getPiece()].classList.toggle('invisible');
  square.classList.toggle('temp');  
  square.classList.toggle('visible');  
  square.parentNode.classList.toggle('taken');
  game.setPiece(square.parentNode.classList[1].slice(6)); 
  console.log('valid move', game);
}

const reset = (boardID) => {
  const unset = document.getElementsByClassName('visible');
  games[boardID] = new ticTacToe();
  for (var x=0; x<unset.length;) {
    if (unset[x].parentNode.parentNode.parentNode.id === boardID) {
      unset[x].parentNode.classList.toggle('taken');
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
    if (winning.length > 0) {
      // e.target.classList.toggle('winner');
    }
    // console.log(winning);
    winning.forEach(winner => {
      if(Array.isArray(winner)) {
        winner.forEach(otherSquare=>{
          // console.log(otherSquare)
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
    // console.log(winning);
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

create_game();
create_game();
create_game();