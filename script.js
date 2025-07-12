const board = document.getElementById('board');
const diceImg = document.getElementById('dice-img');
const diceNumber = document.getElementById('dice-number');
const turnText = document.getElementById('turn');
const popup = document.getElementById('win-popup');
const winnerText = document.getElementById('winner-text');

let player1Pos = 1;
let player2Pos = 1;
let currentPlayer = 1;

const ladders = {
  3: 22,
  5: 8,
  11: 26,
  20: 38,
  28: 84,
  36: 44,
  51: 67,
  71: 91,
  80: 99
};

const snakes = {
  17: 4,
  19: 7,
  21: 9,
  27: 1,
  43: 34,
  54: 29,
  62: 18,
  87: 24,
  95: 56,
  98: 79
};

// Create board
for (let i = 100; i > 0; i--) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.id = `cell-${i}`;
  cell.textContent = i;
  board.appendChild(cell);
}

function renderSnakesAndLadders() {
  Object.keys(ladders).forEach(start => {
    const cell = document.getElementById(`cell-${start}`);
    if (cell) cell.classList.add('ladder');
  });

  Object.keys(snakes).forEach(start => {
    const cell = document.getElementById(`cell-${start}`);
    if (cell) cell.classList.add('snake');
  });
}

function rollDice() {
  let rollCount = 10;
  let dice = 1;

  const rollInterval = setInterval(() => {
    dice = Math.floor(Math.random() * 6) + 1;
    diceNumber.textContent = dice;
    rollCount--;
    if (rollCount === 0) {
      clearInterval(rollInterval);
      doPlayerMove(dice);
    }
  }, 100);
}

function doPlayerMove(dice) {
  let oldPos = currentPlayer === 1 ? player1Pos : player2Pos;
  let targetPos = oldPos + dice;
  if (targetPos > 100) targetPos = oldPos;

  animateMove(currentPlayer, oldPos, targetPos, () => {
    let finalPos = applySnakesAndLadders(targetPos);
    animateMove(currentPlayer, targetPos, finalPos, () => {
      if (currentPlayer === 1) {
        player1Pos = finalPos;
        currentPlayer = 2;
        turnText.textContent = "Player 2's Turn";
      } else {
        player2Pos = finalPos;
        currentPlayer = 1;
        turnText.textContent = "Player 1's Turn";
      }

      renderPlayers();
      checkWin();
    });
  });
}

function applySnakesAndLadders(pos) {
  if (ladders[pos]) {
    alert(`🪜 Ladder! Climb up from ${pos} to ${ladders[pos]}!`);
    return ladders[pos];
  } else if (snakes[pos]) {
    alert(`🐍 Snake! Slide down from ${pos} to ${snakes[pos]}!`);
    return snakes[pos];
  }
  return pos;
}

function animateMove(player, from, to, callback) {
  let current = from;
  const step = from < to ? 1 : -1;

  function stepMove() {
    if (current !== to) {
      current += step;
      if (player === 1) player1Pos = current;
      else player2Pos = current;
      renderPlayers();
      setTimeout(stepMove, 150);
    } else {
      callback();
    }
  }

  stepMove();
}

function renderPlayers() {
  document.querySelectorAll('.player1, .player2').forEach(el => el.remove());

  const p1 = document.createElement('div');
  p1.classList.add('player1');
  document.getElementById(`cell-${player1Pos}`)?.appendChild(p1);

  const p2 = document.createElement('div');
  p2.classList.add('player2');
  document.getElementById(`cell-${player2Pos}`)?.appendChild(p2);
}

function checkWin() {
  if (player1Pos === 100) {
    winnerText.textContent = "🎉 Player 1 Wins!";
    popup.style.display = "flex";
  } else if (player2Pos === 100) {
    winnerText.textContent = "🎉 Player 2 Wins!";
    popup.style.display = "flex";
  }
}

function resetGame() {
  player1Pos = 1;
  player2Pos = 1;
  currentPlayer = 1;
  turnText.textContent = "Player 1's Turn";
  popup.style.display = "none";
  renderPlayers();
}

renderPlayers();
renderSnakesAndLadders();
