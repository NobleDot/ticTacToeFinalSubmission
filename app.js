// String var's to hold player names (hard-coded currently)
let player1Name = "Player 1";
let player2Name = "Player 2";

// These will hold the moveset of each player.
let player1Moves = [];
let player2Moves = [];

// These winning moves are compared with each player's moves.
let winningMoves = [
    // Horizontal wins.
    ["x=0 y=0", "x=1 y=0", "x=2 y=0"],
    ["x=0 y=1", "x=1 y=1", "x=2 y=1"],
    ["x=0 y=2", "x=1 y=2", "x=2 y=2"],
    
    // Vertical wins.
    ["x=0 y=0", "x=0 y=1", "x=0 y=2"],
    ["x=1 y=0", "x=1 y=1", "x=1 y=2"],
    ["x=2 y=0", "x=2 y=1", "x=2 y=2"],

    // Cross wins.
    ["x=0 y=0", "x=1 y=1", "x=2 y=2"],
    ["x=0 y=2", "x=1 y=1", "x=2 y=0"],
];

// We print the name of the last winner on the status bar below the board.
let lastWinner = "unknown";

// Variable tells the program who's turn it is.
let playerTurn = "unknown";

// Variable's to keep track of current "states" of the game.
let gameMode = "default";
let gameModeLastState = "unknown";

// General web element references for later
let webpageBackground = document.getElementsByTagName("window")[0];
let settingsElement = document.getElementsByTagName("settings")[0];
let gameBoardElement = document.getElementsByTagName("gameboard")[0];

// This creates the "zones" of the ticTacToe board
// Each zone is set initially as "unoccupied" via its class name.
// Each zone is id'd by their coordinates.
function createBoardElements() {
    for (let i = 0; i < 3; i++) {
        let newRowOfZones = document.createElement("rowOfZones");
        newRowOfZones.className = ("x=" + i);
        for (let j = 0; j < 3; j++) {
            let newZone = document.createElement("zone");
            let yIndex = i.toString();
            let xIndex = j.toString();
            newZone.className = ("zone-unoccupied");
            newZone.id = ( "x=" + xIndex + " y=" + yIndex);
            newRowOfZones.appendChild(newZone);
        }
        gameBoardElement.appendChild(newRowOfZones);
    }
}

// This guy sets all zone's to unoccupied.
function clearBoardElements() {
    for (let i = 0; i < 9; i++) {
        let currZone = document.getElementsByTagName("zone")[i];

        currZone.className = "zone-unoccupied";
    }
}

// Simple random integer function to use as an index value.
function getRandomIndex(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return (Math.floor(Math.random() * (max-min) + (min)));
}

// Generates a random computer move. Has a "setTimeout" so the response isn't freakishly fast.
function computerMove() {

    // I want an array of available spaces for the computer to choose from
    let availableSpaces = [];
    for (let i = 0; i < 9; i++) {
        if (document.getElementsByTagName("zone")[i].className == "zone-unoccupied") {
            availableSpaces.push(document.getElementsByTagName("zone")[i]);
        }
    }

    // Now, with the available spaces, I choose a random one for the computer to occupy.
    let randomIndex = getRandomIndex(0, availableSpaces.length);
    let selectedZone = availableSpaces[randomIndex];

    // Before changing the space, I'll add a 1 second pause to seem "human"
    setTimeout(() => {  
        selectedZone.className = "zone-player2";
    }, 1000);
}

// This function sets up listeners and logic on the zone's.
// It takes into account who's turn it is via "playerTurn" and the gamemode 
// to handle switching "turns" over, checking the board, and updating whose
// turn it is.

function createBoardListeners() {
    // We add listeners and logic conditions to all the zones.
    for (let i = 0; i < 9; i++) {
        let currZone = document.getElementsByTagName("zone")[i];
        currZone.addEventListener('click', function(clickEvent) {
            if (gameMode == "reset") {
                // User needs to click the reset button to clear the board first.
                // Meanwhile, clicking should do nothing.
            }
            else if (playerTurn == "player1" && clickEvent.target.className == "zone-unoccupied") {

                // Player 1 chose a spot, and the zone's className reflects that.
                clickEvent.target.className = "zone-player1";

                // If the mode isn't singlePlayer, we hand over the turn to player2.
                if (gameMode != "single-player") {playerTurn = "player2"};
                // Add the position to the array of player1's moves.
                player1Moves.push(clickEvent.target.id);

                if (!checkBoard()) {
                    console.log("checkboard is returning false, dude.");
                    // Gotta know if its single player or multiplayer to determine what happens after 
                    // a first move.
                    if (gameMode != "single-player") {
                        let gameStatusBar = document.getElementsByTagName("gameStatus")[0];
                        gameStatusBar.textContent = "Player 2's turn (Crosses)";
                    } else {
                        let gameStatusBar = document.getElementsByTagName("gameStatus")[0];
                        gameStatusBar.textContent = "Computer's turn (Crosses)";
                        computerMove();
                        checkBoard();
                    }
                }
                else {
                    console.log("should be changing the game status to declare a winner");
                    let gameStatusBar = document.getElementsByTagName("gameStatus")[0];
                    gameStatusBar.textContent = (lastWinner + " won the round.\n"+ "Reset to start again.");
                    // Gotta revert back to this mode and allow clicks after the user resets.
                    gameModeLastState = gameMode;
                    gameMode = "reset";
                }
            } else if (playerTurn == "player2" && clickEvent.target.className == "zone-unoccupied") {
                clickEvent.target.className = "zone-player2";
                playerTurn = "player1";
                player2Moves.push(clickEvent.target.id);

                // checkboard returns false if no one's won.
                // We just say it's the next player's
                if (!checkBoard()) {
                    console.log("checkboard is returning false, dude.");
                    let gameStatusBar = document.getElementsByTagName("gameStatus")[0];
                    gameStatusBar.textContent = player1Name +"'s turn (Circles)";
                }
                else {
                    console.log("should be changing the game status to declare a winner");
                    let gameStatusBar = document.getElementsByTagName("gameStatus")[0];
                    gameStatusBar.textContent = (lastWinner + " won the round."+ "\nReset to start again.");
                    gameModeLastState = gameMode;
                    gameMode = "reset";
                }
            }

            console.log("a zone was clicked!");
        });
    }
}

// This just generates the bar seen under the gameBoard once a mode is selected.
function createGameStatus() {
    // Initialize the element
    let gameStatusBar = document.createElement("gameStatus");

    // define the class as default!
    gameStatusBar.className = "gameStatus-default";
    webpageBackground.appendChild(gameStatusBar);
}
// This function generates all the elements seen in the "settings" section.
function createSettingsElements() {

    // Create a general container to hold the items.
    let settingsContainer = document.createElement("div");

    // We'll return an array of the sub-elements. Idk, function should
    // return *something* and maybe it could be useful later...
    let allSettingsElements = [];

    // Prompt container is getting special attention for now.
    let promptContainer = document.createElement("div");
    promptContainer.textContent = "Choose number of players"
    allSettingsElements += promptContainer;


    let optionsContainer = document.createElement("div");
    allSettingsElements += optionsContainer;

    let singleplayerButton = document.createElement("gamemodeOptionButton");
    allSettingsElements += singleplayerButton;

    let multiplayerButton = document.createElement("gamemodeOptionButton");
    allSettingsElements += multiplayerButton;

    let resetBoardButton = document.createElement("resetBoardButton");
    allSettingsElements += resetBoardButton;

    settingsContainer.className = "gamemode-element"
    promptContainer.className = "players-prompt"
    optionsContainer.className = "gamemode-options"

    // Buttons 
    singleplayerButton.className = "gamemode-unselect"
    singleplayerButton.id = "singleplayer-choice"
    singleplayerButton.textContent = "1"
    multiplayerButton.className = "gamemode-unselect"
    multiplayerButton.id = "multiplayer-choice"
    multiplayerButton.textContent = "2"

    resetBoardButton.textContent = "Reset";

    settings.appendChild(settingsContainer);
    
    // Adds containers in settings.
    let parentNode = document.getElementsByTagName("settings")[0];
    parentNode.appendChild(promptContainer);
    parentNode.appendChild(optionsContainer);
    
    // Adds buttons in gamemode-options.
    parentNode = document.getElementsByClassName("gamemode-options")[0];
    parentNode.appendChild(singleplayerButton);
    parentNode.appendChild(multiplayerButton);
    
    //Add the reset button? <pray emoji>
    parentNode.appendChild(resetBoardButton);

    return allSettingsElements;
}

// Generates the event listener logic for the option's buttons.
function createSettingsListeners() {
    
    // Set up gamemode event listener on the mode selection options.
    let playerCountChoice1 = document.getElementsByTagName("gamemodeOptionButton")[0];
    let playerCountChoice2 = document.getElementsByTagName("gamemodeOptionButton")[1];

    let resetBoardButton = document.getElementsByTagName("resetBoardButton")[0];
    // These is the single-player and multi-player button selections. 
    // They change "gameMode" between single-player and multi-player,
    // and initialize player one's turn.
    playerCountChoice1.addEventListener('click', function(clickEvent) {
        console.log("MOUSECLICK DETECTED: options");

        console.log(clickEvent.target);
        if (clickEvent.target.matches('.gamemode-unselect')){
            console.log("MOUSECLICK DETECTED: gamemode-unselected");
            clickEvent.target.className = "gamemode-select";

            playerCountChoice2.className = "gamemode-unselect";

            gameMode = "single-player";

            playerTurn = "player1";

            // So, this is the single-player mode, huh...
            let currBoardStatus = document.getElementsByTagName("gameStatus")[0];
            currBoardStatus.className = "players-prompt";

            currBoardStatus.textContent = "Player 1's turn";
            console.log(gameMode);

            playerTurn = "player1";
        }
    });

    playerCountChoice2.addEventListener('click', function(clickEvent) {
        console.log("MOUSECLICK DETECTED: options");

        console.log(clickEvent.target);
        if (clickEvent.target.matches('.gamemode-unselect')){
            console.log("MOUSECLICK DETECTED: gamemode-unselected");
            clickEvent.target.className = "gamemode-select";

            playerCountChoice1.className = "gamemode-unselect";

            gameMode = "multi-player"

            // Show the boardStatus once the game starts. It's usually player 1's turn.
            // Change the boardStatus class from blank to the player's turn notice.
            
            let currBoardStatus = document.getElementsByTagName("gamestatus")[0];
            currBoardStatus.className = "players-prompt";

            currBoardStatus.textContent = "Player 1's turn";
            console.log(gameMode);

            playerTurn = "player1";
        }
    });

    resetBoardButton.addEventListener('click', function(clickEvent) {
            if (gameMode == "default") {
                // Don't do anything. User still hasn't chosen a number of players.
            } else {
                // Reset the board.
                clearBoardElements();

                // Reset the player's moves.
                player1Moves = [];
                player2Moves = [];
                // Revert the game mode status so user's can select zones again.
                gameMode = gameModeLastState;
                let gameStatusBar = document.getElementsByTagName("gameStatus")[0];

                if (playerTurn == "player1") {
                    gameStatusBar.textContent = player1Name + "'s turn (Circles)";
                }
                else if (playerTurn == "player2") {
                    gameStatusBar.textContent = player2Name + "'s turn (Crosses)";
                }
            }
    });

}

// Checks if the board is full (no unoccupied spaces)
function checkIfFull() {
    let countEmptyZones = 0;
    let zoneListItem = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (document.getElementsByTagName("zone")[zoneListItem].className == "zone-unoccupied") {
                countEmptyZones += 1;
            };
            zoneListItem += 1;
        }
    }

    // If the boards full, set the game to "reset" mode. Clear moves.
    if (countEmptyZones == 0) {
        console.log("The board is full. There are no more unoccupied zones");
        let gameStatus = document.getElementsByTagName("gamestatus")[0];
        gameStatus.textContent = "Tie! Reset the game";
        return true;
    } else {
        return false;
    }
}

// Scanning the current board layout for determining match outcome.
function scanBoard() {
    let boardLayout = [];
    let zoneListItem = 0;
    // find out if the board is full by counting empty zones.

    // let countEmptyZones = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            // if (document.getElementsByTagName("zone")[zoneListItem].className == "zone-unoccupied") {
            //     countEmptyZones += 1;
            // };
            boardLayout.push(document.getElementsByTagName("zone")[zoneListItem]);
            zoneListItem += 1;
        }
    }

    return boardLayout;
}

// Checking the board for a winner or a tie.
function checkBoard() {
    // let currBoard = scanBoard();
    // console.log("Checking board..");
    // console.log(currBoard);
    console.log("Player1's moves: " + player1Moves);
    console.log("Player2's moves: " + player2Moves);

    if (findWin(player1Moves)) {
        console.log("Player 1 has won.");
        lastWinner = "player1";

        console.log("checkboard should be returning true.")
        return true;
    } else if (findWin(player2Moves)) {
        console.log("Player 2 has won." + "\nReset to start again.")
        lastWinner = "player2";

        return true;
        // This next else if should return true if the board's full.
    } else if (checkIfFull()) {
        console.log("Checkboard got checkIfFull() set to true");
        lastWinner = "No one";
        return true;
    } else {
        return false;
    }
}

// Looks for a win in the player's moveset.
function findWin(player) {
    // I feel like I shouldn't matched arrays. I'll print them here.
    console.log(winningMoves);
        // In a weird case, an argued "player2" was undefined as their array of moves is empty.
        // Without this, more evaluation caused bugs.
        // if (!player) {
        //     console.log("player doesn't exist yet");
        //     return false;
        // }

    console.log(player);
    // We compare the array of the player with the sub-arrays
    // of the winningMoveset array.
    
    // Check if player1 has a winning moveset.
    for (let i = 0; i < winningMoves.length; i++) {
        let combo = 0;
        for (let j = 0; j < 3; j++) {
            // I feel like I should've matched items.
            // Going to console.log stuff here.
            console.log("winningMoves[" + i + "] [" + j + "]: " + winningMoves[i][j]);
            console.log("player[" + j + "]: " + player[j]);
            if (!player.includes(winningMoves[i][j])) {
                matchFound = false;
                // The moveset isn't matching, so we move onto the next.
                break;
            } else {
                // A pair was found.
                combo += 1;
            }
        }
        // When 3 pairs are found, the player has a winning moveset.
        if (combo == 3) {
            console.log("Winning moveset discovered. findWIn() Returning true.");
            return true
        } else {
            // Reset the combo..
            combo = 0;
        }
    }
    return false;
}

// Creating the settings section on the main window.
let settings = document.createElement("settings");

// Creating the gameboaord section.
createSettingsElements();

createSettingsListeners();

createBoardElements();

createBoardListeners();

createGameStatus();