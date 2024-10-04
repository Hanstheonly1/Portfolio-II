import { print, askQuestion } from "./io.mjs"
import { debug, DEBUG_LEVELS } from "./debug.mjs";
import { ANSI } from "./ansi.mjs";
import DICTIONARY from "./language.mjs";
import showSplashScreen from "./splash.mjs";

const GAME_BOARD_SIZE = 3;
const PLAYER_1 = 1;
const PLAYER_2 = -1;

// These are the valid choices for the menu.
const MENU_CHOICES = {
    MENU_CHOICE_START_GAME: 1,
    MENU_CHOICE_SHOW_SETTINGS: 2,
    MENU_CHOICE_EXIT_GAME: 3
};
const SETTINGS_CHOICES = {
    SETTINGS_CHOICE_LANGUAGE: 1,
    SETTINGS_CHOICE_RULES: 2,
    SETTINGS_CHOICE_EXIT: 3
};

const NO_CHOICE = -1;

let language = DICTIONARY.en;
let gameboard;
let currentPlayer;


clearScreen();
showSplashScreen();
setTimeout(start, 2500); // This waites 2.5seconds before calling the function. i.e. we get to see the splash screen for 2.5 seconds before the menue takes over. 



//#region game functions -----------------------------

async function start() {

    do {

        let chosenAction = NO_CHOICE;
        chosenAction = await showMenu();

        if (chosenAction == MENU_CHOICES.MENU_CHOICE_START_GAME) {
            await runGame();
        } else if (chosenAction == MENU_CHOICES.MENU_CHOICE_SHOW_SETTINGS) {
            let settingsAction = NO_CHOICE;
            settingsAction = await showSettingsMenu();

            if(settingsAction == SETTINGS_CHOICES.SETTINGS_CHOICE_LANGUAGE)
                {
                    clearScreen();
                    print(ANSI.COLOR.YELLOW + "Language Menu:" + ANSI.RESET);
                    print("en - English");
                    print("no - Norsk");
                    let languageChoice = "";
                    languageChoice = await askQuestion("");
                    if(languageChoice.toLowerCase() == "en")
                    {
                        language = DICTIONARY.en;
                    }
                    else if (languageChoice.toLowerCase() == "no")
                    {
                        language = DICTIONARY.no;
                    }
                }
                else if(settingsAction == SETTINGS_CHOICES.SETTINGS_CHOICE_RULES)
                {
                    clearScreen();
                    print(ANSI.COLOR.YELLOW + "Rules:" + ANSI.RESET);
                    print("Your Turn:\n" + 
                        "When it is your turn, you can place your mark X or O at any of the open spaces by using the coordinate values.\n" + 
                        "Remember to subtract by one compared to grid coordinates." + 
                        "Example: I want to place my mark in the upper left corner.\n" + 
                        "The input for this move is:"); 
                    print(ANSI.COLOR.GREEN + "0 0" + ANSI.RESET);
                    print("And not:");
                    print(ANSI.COLOR.GREEN + "1 1" + ANSI.RESET);
                    print("Invalid input will automatically cancel the move and give you a new question\n\n" + 
                        "End Of The Game:\n" + 
                        "The game is over when a player has three marks in a row.\n" + 
                        "It can be horizontally, vertically or diagonally.\n"); 
                    print(ANSI.COLOR.RED + "Exit To Main Menu" + ANSI.RESET);
                    let input = NO_CHOICE;
                    input = await askQuestion("");
                    start();
                }
                else if(settingsAction == SETTINGS_CHOICES.SETTINGS_CHOICE_EXIT)
                {
                    start();
                }
        } else if (chosenAction == MENU_CHOICES.MENU_CHOICE_EXIT_GAME) {
            clearScreen();
            process.exit();
        }

    } while (true)

}

async function runGame() {

    let isPlaying = true;

    while (isPlaying) { // Do the following until the player dos not want to play anymore. 
        initializeGame(); // Reset everything related to playing the game
        isPlaying = await playGame(); // run the actual game 
    }
}

async function showMenu() {

    let choice = -1;  // This variable tracks the choice the player has made. We set it to -1 initially because that is not a valid choice.
    let validChoice = false;    // This variable tells us if the choice the player has made is one of the valid choices. It is initially set to false because the player has made no choices.

    while (!validChoice) {
        // Display our menu to the player.
        clearScreen();
        print(ANSI.COLOR.YELLOW + "MENU" + ANSI.RESET);
        print("1. Play Game");
        print("2. Settings");
        print("3. Exit Game");

        // Wait for the choice.
        choice = await askQuestion("");

        // Check to see if the choice is valid.
        if ([MENU_CHOICES.MENU_CHOICE_START_GAME, MENU_CHOICES.MENU_CHOICE_SHOW_SETTINGS, MENU_CHOICES.MENU_CHOICE_EXIT_GAME].includes(Number(choice))) {
            validChoice = true;
        }
    }

    return choice;
}

async function playGame() {
    // Play game..
    let outcome;
    do {
        clearScreen();
        showGameBoardWithCurrentState();
        showHUD();
        let move = await getGameMoveFromtCurrentPlayer();
        updateGameBoardState(move);
        outcome = evaluateGameState();
        changeCurrentPlayer();
    } while (outcome == 0)

    showGameSummary(outcome);

    return await askWantToPlayAgain();
}

async function askWantToPlayAgain() {
    let answer = await askQuestion(language.PLAY_AGAIN_QUESTION);
    let playAgain = true;
    if (answer && answer.toLowerCase()[0] != language.CONFIRM) {
        playAgain = false;
    }
    return playAgain;
}

function showGameSummary(outcome) {
    clearScreen();
    let winningPlayer = (outcome > 0) ? 1 : 2;
    print("Winner is player " + winningPlayer);
    showGameBoardWithCurrentState();
    print("GAME OVER");
}

function changeCurrentPlayer() {
    currentPlayer *= -1;
}

function evaluateGameState() {
    let sum = 0;
    let state = 0;

    for (let row = 0; row < GAME_BOARD_SIZE; row++) {

        for (let col = 0; col < GAME_BOARD_SIZE; col++) {
            sum += gameboard[row][col];
        }

        if (Math.abs(sum) == 3) {
            state = sum;
        }
        sum = 0;
    }

    for (let col = 0; col < GAME_BOARD_SIZE; col++) {

        for (let row = 0; row < GAME_BOARD_SIZE; row++) {
            sum += gameboard[row][col];
        }

        if (Math.abs(sum) == 3) {
            state = sum;
        }

        sum = 0;
    }
    
    if(gameboard[1][1] == 1)
    {
        for (let i = 0; i < GAME_BOARD_SIZE; i++)
        {
            if ((gameboard[0][0] == 1 && gameboard [2][2] == 1)||(gameboard[0][2] == 1 && gameboard[2][0] == 1))
            {
                state = 3;
            }
        }
    }
    else if (gameboard[1][1] == -1)
    {
        for (let i = 0; i < GAME_BOARD_SIZE; i++)
        {
            if ((gameboard[0][0] == -1 && gameboard [2][2] == -1)||(gameboard[0][2] == -1 && gameboard[2][0] == -1))
            {
                state = -3;
            }
        }
    }

    let winner = state / 3;
    return winner;
}

function updateGameBoardState(move) {
    const ROW_ID = 0;
    const COLUMN_ID = 1;
    gameboard[move[ROW_ID]][move[COLUMN_ID]] = currentPlayer;
}

async function getGameMoveFromtCurrentPlayer() {
    let position = null;
    do {
        let rawInput = await askQuestion("Place your mark at: ");
        position = rawInput.split(" ");
    } while (isValidPositionOnBoard(position) == false)

    return position
}

function isValidPositionOnBoard(position) {

    if (position.length < 2) {
        // We where not given two numbers or more.
        return false;
    }

    let isValidInput = true;
    if (position[0] * 1 != position[0] && position[1] * 1 != position[1]) {
        // Not Numbers
        inputWasCorrect = false;
    } else if (position[0] > GAME_BOARD_SIZE && position[1] > GAME_BOARD_SIZE) {
        // Not on board
        inputWasCorrect = false;
    }
    else if (Number.parseInt(position[0]) != position[0] && Number.parseInt(position[1]) != position[1]) {
        // Position taken.
        inputWasCorrect = false;
    }


    return isValidInput;
}

function showHUD() {
    let playerDescription = "one";
    if (PLAYER_2 == currentPlayer) {
        playerDescription = "two";
    }
    print("Player " + playerDescription + " it is your turn");
}

function showGameBoardWithCurrentState() {
    for (let currentRow = 0; currentRow < GAME_BOARD_SIZE; currentRow++) {
        let rowOutput = "";
        for (let currentCol = 0; currentCol < GAME_BOARD_SIZE; currentCol++) {
            let cell = gameboard[currentRow][currentCol];
            if (cell == 0) {
                rowOutput += "_ ";
            }
            else if (cell > 0) {
                rowOutput += "X ";
            } else {
                rowOutput += "O ";
            }
        }

        print(rowOutput);
    }
}

function initializeGame() {
    gameboard = createGameBoard();
    currentPlayer = PLAYER_1;
}

function createGameBoard() {

    let newBoard = new Array(GAME_BOARD_SIZE);

    for (let currentRow = 0; currentRow < GAME_BOARD_SIZE; currentRow++) {
        let row = new Array(GAME_BOARD_SIZE);
        for (let currentColumn = 0; currentColumn < GAME_BOARD_SIZE; currentColumn++) {
            row[currentColumn] = 0;
        }
        newBoard[currentRow] = row;
    }

    return newBoard;

}

function clearScreen() {
    console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME, ANSI.RESET);
}

async function showSettingsMenu()
{
    let menuInput = -1;
    let valid = false;

    clearScreen();
    print(ANSI.COLOR.YELLOW + "Settings Menu:" + ANSI.RESET)
    print("1. Language");
    print("2. Rules");
    print("3. Exit To Main Menu");

    while (!valid)
    {
        menuInput = await askQuestion("");
        if([SETTINGS_CHOICES.SETTINGS_CHOICE_LANGUAGE, SETTINGS_CHOICES.SETTINGS_CHOICE_RULES, SETTINGS_CHOICES.SETTINGS_CHOICE_EXIT])
        {
            valid = true;
        }
    }

    return menuInput;
}

    


//#endregion

