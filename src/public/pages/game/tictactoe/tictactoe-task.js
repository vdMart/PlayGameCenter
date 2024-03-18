
let containerChat = document.querySelector('.containerChat');
if (containerChat) {
    containerChat.style.display = 'none';
}

let buttonRestart = document.querySelector('#game-restart')
let buttonSearch = document.querySelector('#game-search')
buttonRestart.style.visibility = 'hidden'
buttonSearch.style.visibility = 'hidden'
const STATUS_DISPLAY = document.querySelector('.game-notification'),
  GAME_STATE = ["", "", "", "", "", "", "", "", ""],
  WINNINGS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ],
  WIN_MESSAGE = () => `El jugador ${currentPlayer} ha ganado!`,
  DRAW_MESSAGE = () => `El juego ha terminado en empate!`,
  CURRENT_PLAYER_TURN = () => `Turno del jugador ${currentPlayer}`

let gameActive = true,
  currentPlayer = "O"


function mainq() {
  handleStatusDisplay(CURRENT_PLAYER_TURN())
  listeners()
}

function listeners() {
  document.querySelector('.game-container').addEventListener('click', handleCellClick)
  buttonRestart.addEventListener('click', handleRestartGame)
}

function handleStatusDisplay(message) {
  STATUS_DISPLAY.innerHTML = message
}

function handleRestartGame() {
  gameActive = true
  currentPlayer = "X"
  restartGameState()
  handleStatusDisplay(CURRENT_PLAYER_TURN())
  document.querySelectorAll('.game-cell').forEach(cell => cell.innerHTML = "")
}

function handleCellClick(clickedCellEvent /** Type Event **/) {
  const clickedCell = clickedCellEvent.target
  if (clickedCell.classList.contains('game-cell')) {
    const clickedCellIndex = Array.from(clickedCell.parentNode.children).indexOf(clickedCell)
    if (GAME_STATE[clickedCellIndex] !== '' || !gameActive) {
      return false
    }

    handleCellPlayed(clickedCell, clickedCellIndex)
    handleResultValidation()
  }
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
  GAME_STATE[clickedCellIndex] = currentPlayer
  clickedCell.innerHTML = currentPlayer
}

function handleResultValidation() {
  let roundWon = false
  for (let i = 0; i < WINNINGS.length; i++) { 
    const winCondition = WINNINGS[i]
    let position1 = GAME_STATE[winCondition[0]],
      position2 = GAME_STATE[winCondition[1]],
      position3 = GAME_STATE[winCondition[2]] 

    if (position1 === '' || position2 === '' || position3 === '') {
        buttonRestart.style.visibility = 'hidden'
        buttonSearch.style.visibility = 'hidden'
      continue;
    }
    if (position1 === position2 && position2 === position3) {
      roundWon = true
      break
    }
  }

  if (roundWon) {
    handleStatusDisplay(WIN_MESSAGE())
    buttonRestart.style.visibility = 'visible'
    buttonSearch.style.visibility = 'visible'
    gameActive = false
    return
  }

  let roundDraw = !GAME_STATE.includes("")
  if (roundDraw) {
    handleStatusDisplay(DRAW_MESSAGE())
    buttonRestart.style.visibility = 'visible'
    buttonSearch.style.visibility = 'visible'
    gameActive = false
    return
  }

  handlePlayerChange()
}

function handlePlayerChange() {
  currentPlayer = currentPlayer === "X" ? "O" : "X"
  handleStatusDisplay(CURRENT_PLAYER_TURN())
}

function restartGameState() {
  let i = GAME_STATE.length
  while (i--) {
    GAME_STATE[i] = ''
  }
}

mainq()