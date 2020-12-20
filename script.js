// An object representing text
const gameTextObj = (() => {
    // Event listenters for players 
    const left = Array.from(document.querySelector('.left').children);
    for (let i = 0; i < left.length; i++) {
        left[i].addEventListener('click', (e) => {
            if (left[0].hasAttribute('id', 'active-left') || left[1].hasAttribute('id', 'active-left')) {
                left[0].removeAttribute('id', 'active-left')
                left[1].removeAttribute('id', 'active-left')
            }
            e.target.setAttribute('id', 'active-left')
        })
    }
    

    const right = Array.from(document.querySelector('.right').children);
    for (let i = 0; i < right.length; i++) {
        right[i].addEventListener('click', (e) => {
            if (right[0].hasAttribute('id', 'active-right') || right[1].hasAttribute('id', 'active-right')) {
                right[0].removeAttribute('id', 'active-right')
                right[1].removeAttribute('id', 'active-right')
            }
            e.target.setAttribute('id', 'active-right');
        })
    }

    
    // Chech if the player is chosen
    function playersCheck() {
        if (document.getElementById('active-right') != null & document.getElementById('active-left') != null) {
            return true;
        } else {
            return false;
        }
    }
    
    
    const gameStage = () => {
        document.querySelector('.main-container').style = "display: none";

        const currentPlayer = document.createElement('div');
        currentPlayer.setAttribute('id', 'currentPlayer');
        currentPlayer.textContent = firstPlayer.name + ` (${firstPlayer.marker}) turn:`
        document.body.appendChild(currentPlayer);
    }

    const winStage = () => {
        const announce = document.getElementById('currentPlayer');
        announce.textContent = announceWinner();

        // Play again with the same players
        const startOver = document.createElement('div');
        startOver.setAttribute('id', 'new-game');
        startOver.textContent = 'Play again';
        startOver.addEventListener('click', game.startOver);
        document.body.appendChild(startOver);

        // Change players (main menu analog)
        const changePlayers = document.createElement('div');
        changePlayers.setAttribute('id', 'change-players');
        changePlayers.textContent = 'Change Players';
        changePlayers.addEventListener('click', game.backToMenu);
        document.body.appendChild(changePlayers);
    }

    function changeName() {
        if (counter % 2 == 1) {
            document.getElementById('currentPlayer').textContent = firstPlayer.name + ` (${firstPlayer.marker}) turn:`;
        } else {
            document.getElementById('currentPlayer').textContent = secondPlayer.name + ` (${secondPlayer.marker}) turn:`;
        }
    }

    function announceWinner() {
        if (counter == 9) {
            return 'It\'s a tie!';
        }
        if (counter % 2 == 1) {
            return `${secondPlayer.name} (${secondPlayer.marker}) wins!`
        } else {
            return `${firstPlayer.name} (${firstPlayer.marker}) wins!`
        } 
    }
    return {gameStage, winStage, changeName, playersCheck};
})();



// An object representing the game board.
const gameBoardObj = (() => {
    const gameboard = [];

    const clearTheBoard = () => {
        document.querySelector('.container').remove();
        document.getElementById('currentPlayer').remove();
        gameboard.splice(0, gameboard.length);
    }
    
    const createBoard = () => {
        const board = document.createElement('div');
        board.setAttribute('class', 'container');
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            gameboard.push(cell.textContent);
            cell.setAttribute('class', 'grid-cell');
            board.appendChild(cell);
        }
        document.body.appendChild(board);
    }

    function switchPlayers(counter, player, player2) {
        if (counter % 2 == 1) {
            gameTextObj.changeName();
            return player2;
        } else {
            gameTextObj.changeName();
            return player;
        }
    }

    // Function to add events for first player 
    const PlayerMove = () => {
        const cells = document.querySelectorAll('.grid-cell');
        for (let i = 0; i < cells.length; i++) {
            cells[i].addEventListener('click', () => {
                if (isOver(firstPlayer) || isOver(secondPlayer)) {
                    return;
                }
                if (cells[i].textContent == '') {
                    const currentPlayer = switchPlayers(counter, firstPlayer, secondPlayer);
                    cells[i].textContent = currentPlayer.marker;
                    gameBoardObj.gameboard[i] = currentPlayer.marker;
                    if (isOver(firstPlayer) || isOver(secondPlayer)) {
                        gameTextObj.winStage();
                        return;
                    }
                    counter++;
                    if (counter == 9) {
                        gameTextObj.winStage();
                    }
                }           
            })
        }
    }


    // Function to check whether somebody has won.
    const isOver = (currentPlayer) => {
        if (gameBoardObj.gameboard[0] == currentPlayer.marker &
            gameBoardObj.gameboard[1] == currentPlayer.marker &
            gameBoardObj.gameboard[2] == currentPlayer.marker ||
            gameBoardObj.gameboard[3] == currentPlayer.marker &
            gameBoardObj.gameboard[4] == currentPlayer.marker &
            gameBoardObj.gameboard[5] == currentPlayer.marker ||
            gameBoardObj.gameboard[6] == currentPlayer.marker &
            gameBoardObj.gameboard[7] == currentPlayer.marker &
            gameBoardObj.gameboard[8] == currentPlayer.marker ||
            gameBoardObj.gameboard[0] == currentPlayer.marker &
            gameBoardObj.gameboard[3] == currentPlayer.marker &
            gameBoardObj.gameboard[6] == currentPlayer.marker ||
            gameBoardObj.gameboard[1] == currentPlayer.marker &
            gameBoardObj.gameboard[4] == currentPlayer.marker &
            gameBoardObj.gameboard[7] == currentPlayer.marker ||
            gameBoardObj.gameboard[2] == currentPlayer.marker &
            gameBoardObj.gameboard[5] == currentPlayer.marker &
            gameBoardObj.gameboard[8] == currentPlayer.marker ||
            gameBoardObj.gameboard[0] == currentPlayer.marker &
            gameBoardObj.gameboard[4] == currentPlayer.marker &
            gameBoardObj.gameboard[8] == currentPlayer.marker ||
            gameBoardObj.gameboard[2] == currentPlayer.marker &
            gameBoardObj.gameboard[4] == currentPlayer.marker &
            gameBoardObj.gameboard[6] == currentPlayer.marker) {
                return true;
            } else {
                return false;
            }
    }

    return {gameboard, createBoard, isOver, PlayerMove, clearTheBoard}
})();




// Main game module controlling the flow of the game
const game = (() => {
    const startBtn = document.getElementById('start-game');
    
    const startGame = () => {
        if (gameTextObj.playersCheck()) {
            gameTextObj.gameStage();
            gameBoardObj.createBoard();
            gameBoardObj.PlayerMove();
        } else {
            alert('Please select player types')
        }
        
        
    }

    const startOver = () => {
        gameTextObj.gameStage();
        gameBoardObj.clearTheBoard();
        gameBoardObj.createBoard();
        gameBoardObj.PlayerMove();
        counter = 0;
        document.getElementById('new-game').remove();
        document.getElementById('change-players').remove();
    }

    const backToMenu = () => {
        document.querySelector('.main-container').style = "display: block";
        gameBoardObj.clearTheBoard();
        counter = 0;
        document.getElementById('new-game').remove();
        document.getElementById('change-players').remove();
    }
    
    startBtn.addEventListener('click', startGame);
    return {startOver, backToMenu}
})();

// Factory function for creating players
const Player = (name, marker, markers) => {
    return {name, marker, markers}
}

let counter = 0
const firstPlayer = Player('Player 1','X', ['X', '🎄', '🐶', '💧']);
const secondPlayer = Player('Player 2','O', ['O', '🎁', '🐱', '🔥']);

const formObj = (() => {
    let currentPlayer = '';
    const accept = document.getElementById('accept');
    const cancel = document.getElementById('cancel');

    accept.addEventListener('click', makeChanges);
    cancel.addEventListener('click', closeForm);
    
    // Make changes to the player variable
    function makeChanges() {

        const newName = document.getElementById('player-name').value;
        const radio = document.querySelectorAll('input[type="radio"]');
        // Change players marker
        for (let i = 0; i < radio.length; i++) {
            if (radio[i].checked == true) {
                if (currentPlayer == firstPlayer) {
                    firstPlayer.marker = radio[i].nextElementSibling.firstElementChild.textContent;
                    document.getElementById('first-player-marker').textContent = ` (${firstPlayer.marker})`
                } else {
                    secondPlayer.marker = radio[i].nextElementSibling.firstElementChild.textContent;
                    document.getElementById('second-player-marker').textContent = ` (${secondPlayer.marker})`
                }
            }
        }

        if (newName != '') {
            currentPlayer.name = newName;
            if (currentPlayer == firstPlayer) {
                document.getElementById('first-player-name').textContent = newName;
            } else {
                document.getElementById('second-player-name').textContent = newName;
            }
        }
        
        closeForm();
    }

    // Open close forms
    function openForm() {
        document.getElementById('form').reset();
        currentPlayer = this[0];
        // Chenge the placeholder to the current player name
        const placeholder = document.getElementById('player-name');
        placeholder.setAttribute('placeholder', currentPlayer.name)
        const emoji = document.querySelectorAll('.emoji');
        for (let i = 0; i < emoji.length; i++) {
            emoji[i].textContent = this[0].markers[i];
            if (this[0].marker == emoji[i].textContent) {
                emoji[i].parentElement.previousElementSibling.checked = true;
            }
        }
        document.getElementById('form').style.display = 'block';
    }

    function closeForm() {
        document.getElementById('form').style.display = 'none';
    }

    const playerForms = document.querySelectorAll('.form');
    playerForms[0].addEventListener('click', openForm.bind([firstPlayer]))
    playerForms[1].addEventListener('click', openForm.bind([secondPlayer]))
})();

