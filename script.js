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
            if (e.target.textContent == 'Human') {
                firstPlayer.ai = false;
            } else {
                firstPlayer.ai = true;
            }
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
            if (e.target.textContent == 'Human') {
                secondPlayer.ai = false;
            } else {
                secondPlayer.ai = true;
            }
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
        announce.style.fontSize = '30px';

        // Play again with the same players
        if (document.getElementById('new-game') == null) {
            const startOver = document.createElement('div');
            startOver.setAttribute('id', 'new-game');
            startOver.textContent = 'Play again';
            startOver.addEventListener('click', game.startOver);
            document.body.appendChild(startOver);
        }
        
        // Change players (kind of like main menu)
        if (document.getElementById('change-players') == null) {
            const changePlayers = document.createElement('div');
            changePlayers.setAttribute('id', 'change-players');
            changePlayers.textContent = 'Change Players';
            changePlayers.addEventListener('click', game.backToMenu);
            document.body.appendChild(changePlayers);
        }
    }
    // Determing the player name displayed depending on the counter
    function changeName() {
        if (counter % 2 == 1) {
            document.getElementById('currentPlayer').textContent = firstPlayer.name + ` (${firstPlayer.marker}) turn:`;
        } else {
            document.getElementById('currentPlayer').textContent = secondPlayer.name + ` (${secondPlayer.marker}) turn:`;
        }
    }

    function announceWinner() {
        if (!(gameBoardObj.isOver(firstPlayer) || gameBoardObj.isOver(secondPlayer))) {
            if (counter == 9) {
                return 'It\'s a tie!';
            }
        }
        
        if (gameBoardObj.isOver(secondPlayer)) {
            return `${secondPlayer.name} (${secondPlayer.marker}) wins!`
        } else if (gameBoardObj.isOver(firstPlayer)) {
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
            cell.setAttribute('id', i);
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
        if (firstPlayer.ai == true && secondPlayer.ai == true) {
            aiGame();
        } else if (firstPlayer.ai == true) {
            let currentPlayer = switchPlayers(counter, firstPlayer, secondPlayer);
            AIMove(currentPlayer);
        }
        for (let i = 0; i < cells.length; i++) {
            cells[i].addEventListener('click', makeMove)
        }
    }

    const makeMove = (e) => {
        if (isOver(firstPlayer) || isOver(secondPlayer)) {
            gameTextObj.winStage();
            return;
        }
        if (firstPlayer.ai == false && secondPlayer.ai == false && e.target.textContent == '') {
            const currentPlayer = switchPlayers(counter, firstPlayer, secondPlayer);
            e.target.textContent = currentPlayer.marker;
            gameBoardObj.gameboard[e.target.id] = currentPlayer.marker;
            counter++;
            if (isOver(firstPlayer) || isOver(secondPlayer) || counter == 9) {
                gameTextObj.winStage();
            }
        } else if (firstPlayer.ai == false && secondPlayer.ai == true ||
                firstPlayer.ai == true && secondPlayer.ai == false) {
            let currentPlayer = switchPlayers(counter, firstPlayer, secondPlayer);
            e.target.textContent = currentPlayer.marker;
            gameBoardObj.gameboard[e.target.id] = currentPlayer.marker;
            counter++;
            currentPlayer = switchPlayers(counter, firstPlayer, secondPlayer);
            AIMove(currentPlayer);
            if (isOver(firstPlayer) || isOver(secondPlayer) || counter == 9) {
                gameTextObj.winStage();
            }
        } 
    }

    const AIMove = (currentPlayer) => {
        const cells = document.querySelectorAll('.grid-cell');
        if (isOver(firstPlayer) || isOver(secondPlayer) || counter == 9) {
            gameTextObj.winStage();
        } else {
            while (true) {
                const move = Math.floor(Math.random() * 9)
                if (gameBoardObj.gameboard[move] == '') {
                    gameBoardObj.gameboard[move] = currentPlayer.marker;
                    cells[move].textContent = currentPlayer.marker;
                    break;
                }
            }   
        }
        counter++;
    }

    const aiGame = () => {
        while (gameBoardObj.gameboard.includes('') && !(isOver(firstPlayer) || isOver(secondPlayer))) {
            AIMove(firstPlayer);
            AIMove(secondPlayer);
        }
        if (isOver(firstPlayer) || isOver(secondPlayer) || counter == 9) {
            gameTextObj.winStage();
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
        counter = 0;
        gameTextObj.gameStage();
        gameBoardObj.clearTheBoard();
        gameBoardObj.createBoard();
        gameBoardObj.PlayerMove();
        if (!(firstPlayer.ai == true && secondPlayer.ai == true)) {
            document.getElementById('new-game').remove();
            document.getElementById('change-players').remove();
        }
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
const Player = (name, marker, markers, ai) => {
    return {name, marker, markers, ai}
} 

// Create players and counter to keep track of the game.
let counter = 0
const firstPlayer = Player('Player 1','X', ['X', '🎄', '🐶', '💧'], false);
const secondPlayer = Player('Player 2','O', ['O', '🎁', '🐱', '🔥'], false);

// An object to change players names and markers
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

