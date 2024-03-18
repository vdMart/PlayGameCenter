import { auth, database, db } from "./../../../app/firebase.js";
import { set, get, ref, update } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";
import { collection, getDocs, onSnapshot, query, where } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

function setPartidaRealtime(_gameId, _userId, _position, _timestamp) {
    set(ref(database, 'partida/' + _gameId), {
        user: _userId,
        position: _position,
        timestamp: _timestamp
    });
}
//setPartidaRealtime("iu7hvbkyx5d", "ifsudfhiusdhf", 2, 53454345);

function readPartidaRealtime(_gameId) {
    const partidaRef = ref(database, 'partida/' + _gameId);
    return get(partidaRef).then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val().position);
            return snapshot.val();
        } else {
            console.log('No data available');
            return null;
        }
    }).catch((error) => {
        console.error(error);
        throw error;
    });
}
//readPartidaRealtime("iu7hvbkyx5d");


setInterval(() => {
    var pos = readPartidaRealtime(idGame);
    setPlay(pos);
}, 1000);


const urlParams = new URLSearchParams(window.location.search);
const idGame = urlParams.get('idgame');

const idCurrentUser = auth.currentUser



async function setPlay(posPromise) {
    const pos = await posPromise;
    console.log("pos: ", pos.position)
    if (pos != null && typeof pos.position === 'number' && pos.timestamp >= timestampSTART) {
        const clickedCell = document.querySelector('.game-cell:nth-child(' + (pos.position + 1) + ')')
        if (clickedCell && clickedCell.classList.contains('game-cell')) {
            const clickedCellIndex = Array.from(clickedCell.parentNode.children).indexOf(clickedCell)
            if (GAME_STATE[clickedCellIndex] !== '' || !gameActive) {
            return false
            }

            console.log("clickedCellIndex", clickedCellIndex, "clickedCell", clickedCell)

            CellPlayed(clickedCell, clickedCellIndex)
            ResultValidation()
        }
    }
}

const timestampSTART = new Date().getTime()


//---------------------------------------------



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


function mainGame() {
  StatusDisplay(CURRENT_PLAYER_TURN())
  listeners()
}

function listeners() {
  document.querySelector('.game-container').addEventListener('click', CellClick)
  buttonRestart.addEventListener('click', RestartGame)
}

function StatusDisplay(message) {
  STATUS_DISPLAY.innerHTML = message
}

function RestartGame() {
  gameActive = true
  currentPlayer = "X"
  restartGameState()
  StatusDisplay(CURRENT_PLAYER_TURN())
  document.querySelectorAll('.game-cell').forEach(cell => cell.innerHTML = "")
}

function CellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target
  if (clickedCell.classList.contains('game-cell')) {
    const clickedCellIndex = Array.from(clickedCell.parentNode.children).indexOf(clickedCell)
    if (GAME_STATE[clickedCellIndex] !== '' || !gameActive) {
      return false
    }

    console.log("clickedCellIndex", clickedCellIndex, "clickedCell", clickedCell)

    CellPlayed(clickedCell, clickedCellIndex)
    ResultValidation()
  }
}

function CellPlayed(clickedCell, clickedCellIndex) {
  GAME_STATE[clickedCellIndex] = currentPlayer
  clickedCell.innerHTML = currentPlayer 
  var timestamp = new Date().getTime()
  setPartidaRealtime(idGame, idCurrentUser, clickedCellIndex, timestamp);
}

function ResultValidation() {
  let roundWon = false
  for (let i = 0; i < WINNINGS.length; i++) {
    const winCondition = WINNINGS[i] 
    let position1 = GAME_STATE[winCondition[0]],
      position2 = GAME_STATE[winCondition[1]],
      position3 = GAME_STATE[winCondition[2]] //estado actual del juego

    if (position1 === '' || position2 === '' || position3 === '') {
        buttonRestart.style.visibility = 'hidden'
        buttonSearch.style.visibility = 'hidden'
      continue; // continua partida
    }
    if (position1 === position2 && position2 === position3) {
      roundWon = true // ganador
      break
    }
  }

  if (roundWon) {
    StatusDisplay(WIN_MESSAGE())
    buttonRestart.style.visibility = 'visible'
    buttonSearch.style.visibility = 'visible'
    gameActive = false
    return
  }

  let roundDraw = !GAME_STATE.includes("") // empate
  if (roundDraw) {
    StatusDisplay(DRAW_MESSAGE())
    buttonRestart.style.visibility = 'visible'
    buttonSearch.style.visibility = 'visible'
    gameActive = false
    return
  }

  PlayerChange()
}

function PlayerChange() {
  currentPlayer = currentPlayer === "X" ? "O" : "X"
  StatusDisplay(CURRENT_PLAYER_TURN())
}

function restartGameState() {
  let i = GAME_STATE.length
  while (i--) {
    GAME_STATE[i] = ''
  }
}

mainGame()