// An object representing text 
const gameTextObj = (() => {
    
    const gameStage = () => {
        document.querySelector('.main-container').style = "display: none";

        const currentPlayer = document.createElement('div');
        currentPlayer.setAttribute('id', 'currentPlayer');
        currentPlayer.textContent = firstPlayer.name + ` (${firstPlayer.marker}):`
        document.body.appendChild(currentPlayer);
    }

    const winStage = () => {
        const announce = document.getElementById('currentPlayer');
        announce.textContent = announceWinner();

        // Play again with the same players
        const startOver = document.createElement('button');
        startOver.setAttribute('id', 'new-game');
        startOver.textContent = 'Play again';
        startOver.addEventListener('click', game.startOver);
        document.body.appendChild(startOver);

        // Change players (main menu analog)
        const changePlayers = document.createElement('button');
        changePlayers.setAttribute('id', 'change-players');
        changePlayers.textContent = 'Change Players';
        changePlayers.addEventListener('click', game.backToMenu);
        document.body.appendChild(changePlayers);
    }

    function changeName() {
        if (counter % 2 == 1) {
            document.getElementById('currentPlayer').textContent = firstPlayer.name + ` (${firstPlayer.marker}):`;
        } else {
            document.getElementById('currentPlayer').textContent = secondPlayer.name + ` (${secondPlayer.marker}):`;
        }
    }

    function announceWinner() {
        if (counter == 9) {
            return 'It\'s a tie!';
        }
        if (counter % 2 == 1) {
            return `${secondPlayer.name} (${secondPlayer.marker}) has won!`
        } else {
            return `${firstPlayer.name} (${firstPlayer.marker}) has won!`
        } 
    }
    return {gameStage, winStage, changeName};
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
        gameTextObj.gameStage();
        gameBoardObj.createBoard();
        gameBoardObj.PlayerMove();
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
const Player = (name, marker) => {
    return {name, marker}
}

let counter = 0
const firstPlayer = Player('Alex', 'X');
const secondPlayer = Player('Vadim', 'O');





