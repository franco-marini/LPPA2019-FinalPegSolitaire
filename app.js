var board = [
    [undefined, undefined, { value: 1 }, { value: 1 }, { value: 1 }, undefined, undefined],
    [undefined, undefined, { value: 1 }, { value: 1 }, { value: 1 }, undefined, undefined],
    [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
    [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }],
    [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
    [undefined, undefined, { value: 1 }, { value: 1 }, { value: 1 }, undefined, undefined],
    [undefined, undefined, { value: 1 }, { value: 1 }, { value: 1 }, undefined, undefined]
]

//#region Save a Game
//Returns the date and hour of today
function getDate() {
    var date = new Date();
    var yyyy = date.getFullYear();
    var dd = date.getDate();
    var mm = (date.getMonth() + 1);

    //Puts the 0 for the numbers below 2 digits
    if (dd < 10)
        dd = "0" + dd;

    if (mm < 10)
        mm = "0" + mm;

    var currentDay = yyyy + "-" + mm + "-" + dd;

    var hours = date.getHours()
    var minutes = date.getMinutes()
    var seconds = date.getSeconds();

    //Puts the 0 for the numbers below 2 digits
    if (hours < 10)
        hours = "0" + hours;

    if (minutes < 10)
        minutes = "0" + minutes;

    if (seconds < 10)
        seconds = "0" + seconds;

    return currentDay + "-" + hours + ":" + minutes + ":" + seconds;
}


function compare( a, b ) {
    //Order the saved games by date
    if ( a.date < b.date ){
      return -1;
    }
    if ( a.date > b.date ){
      return 1;
    }
    return 0;
}

function saveGame() {

    var nameTxt = document.getElementById('nameTxt').value

    var newGame = {
        date: getDate(),
        name: nameTxt,
        actualGame: board
    }

    document.getElementById('nameTxt').value = ''
    //Save the game with de date value as the primary key
    localStorage.setItem(getDate().toString(), JSON.stringify(newGame))
    drawGamesTable()
}

function loadGame(){
    board = findGame().actualGame
    var boardElement = document.getElementById('board')
    boardElement.innerHTML = generateBoard()
    var pegs = boardElement.getElementsByClassName('ballPlace')
    addPegsEventHandlers(pegs)
}

function loadGames() {

    var storedGames = []

    if (storedGames == null) {
        storedGames = []
    }
    else {
        //Get all the items of localStorage, then save in a new variable the items parsing from JSON format
        for (var i = 0; i < localStorage.length; i++) {
            game = localStorage.getItem(localStorage.key(i))
            storedGames.push(JSON.parse(game))

        }
    }
    storedGames.sort(compare)
    console.log(storedGames)
    return storedGames
}

function findGame() {
    var storedGames = loadGames()
    var rates = document.getElementsByName('rbtGame');
    var rateValue;
    //Checks which radio button is select
    for (var i = 0; i < rates.length; i++) {
        if (rates[i].checked) {
            rateValue = rates[i].value;
        }
    }

    //Compares the radio button selected with all the saved games
    var game
    for (let i = 0; i < storedGames.length; i++) {
        //Search for the equal date
        if (storedGames[i].date == rateValue) {
            game = storedGames[i]
        }
    }

    return game
}

function deleteGame() {
    localStorage.removeItem(findGame().date)
    drawGamesTable()
}

function drawGamesTable() {
    var list = loadGames()
    var divList = document.getElementById('listGames')

    //Draw with HTML structure a list of the saved games
    divList.innerHTML = '<ul>'
    for (let i = 0; i < list.length; i++) {
        //Converts/Parse JSON string into an object
        game = JSON.parse(localStorage.getItem(localStorage.key(i)))
        divList.innerHTML += '<li>' + game.date + " - " + game.name + ' <input type="radio" name="rbtGame" value="' + game.date + '">' + '</li>'
    }
    divList.innerHTML += '</ul>'
}
//#endregion

//#region Functional of the game
var selectedPeg = { x: undefined, y: undefined }

var createId = function (rowN, colN) {
    return 'peg-' + rowN + '-' + colN
}

//Generate all de the cells in one row
var generateCell = function (cell, rowN, colN) {
    //Id is the location of the peg
    var html = '<button id="' + createId(rowN, colN) + '" class="'
    if (cell && cell.value) {
        html += 'ballPlace'
    }
    else if (cell && cell.value == 0) {
        html += 'ballPlaceEmpty'
    }
    else {
        html += 'hidden'
    }
    html += '"></button>'
    return html
}

//Generate the row
var generateRow = function (row, rowN) {
    var html = '<div class="row">'
    for (let column = 0; column < row.length; column++) {
        html += generateCell(row[column], rowN, column)
    }
    html += '</div>'
    return html
}

//Generate all the rows for the game
var generateBoard = function () {
    var html = '<div class="row">'
    for (row = 0; row < board.length; row++) {
        html += generateRow(board[row], row)
    }
    html += '</div>'
    return html
}

var unselectPeg = function () {
    if (selectedPeg.x !== undefined && selectedPeg.y !== undefined) {
        var prevSelectedId = createId(selectedPeg.x, selectedPeg.y)
        document.getElementById(prevSelectedId).className = 'ballPlace'
        var suggestions = document.getElementsByClassName('ballPlaceAvailable')
        for (let i = 0; i < suggestions.length; i++) {
            suggestions[i].className = 'ballPlaceEmpty'
        }
    }
}

var getElement = function (id) {
    var element = document.getElementById(id)
    return element || {}
}

var showSuggestions = function () {
    var near = {
        above: getElement(createId(selectedPeg.x - 1, selectedPeg.y)),
        left: getElement(createId(selectedPeg.x, selectedPeg.y - 1)),
        right: getElement(createId(selectedPeg.x, selectedPeg.y + 1)),
        below: getElement(createId(selectedPeg.x + 1, selectedPeg.y))
    }

    var possible = {
        above: getElement(createId(selectedPeg.x - 2, selectedPeg.y)),
        left: getElement(createId(selectedPeg.x, selectedPeg.y - 2)),
        right: getElement(createId(selectedPeg.x, selectedPeg.y + 2)),
        below: getElement(createId(selectedPeg.x + 2, selectedPeg.y))
    }

    if (near.above.className === 'ballPlace' && possible.above.className === 'ballPlaceEmpty') {
        possible.above.className = 'ballPlaceAvailable'
    }

    if (near.left.className === 'ballPlace' && possible.left.className === 'ballPlaceEmpty') {
        possible.left.className = 'ballPlaceAvailable'
    }

    if (near.right.className === 'ballPlace' && possible.right.className === 'ballPlaceEmpty') {
        possible.right.className = 'ballPlaceAvailable'
    }

    if (near.below.className === 'ballPlace' && possible.below.className === 'ballPlaceEmpty') {
        possible.below.className = 'ballPlaceAvailable'
    }
}

var selectPeg = function (evt) {
    var peg = evt.target
    var idParts = peg.id && peg.id.length ? peg.id.split('-') : []
    if (idParts.length === 3) {
        unselectPeg()
        if (selectedPeg.x === parseInt(idParts[1]) && selectedPeg.y === parseInt(idParts[2])) {
            unselectPeg()
            selectedPeg.x = undefined
            selectedPeg.y = undefined
        }
        else {
            selectedPeg.x = parseInt(idParts[1])
            selectedPeg.y = parseInt(idParts[2])
            peg.className = 'ballSelected'
            showSuggestions()
        }
    }
    console.log(selectedPeg)
}

var addPegsEventHandlers = function (pegs) {
    for (let i = 0; i < pegs.length; i++) {
        pegs[i].onclick = selectPeg
    }
}
//#endregion

//Initialize the game
var init = function () {
    //localStorage.clear()
    var boardElement = document.getElementById('board')
    boardElement.innerHTML = generateBoard()
    var pegs = boardElement.getElementsByClassName('ballPlace')
    addPegsEventHandlers(pegs)


    drawGamesTable()
    var btnSaveGame = document.getElementById('saveGame')
    btnSaveGame.onclick = saveGame

    var btnLoadGame = document.getElementById('loadGame')
    btnLoadGame.onclick = loadGame

    var btnDeleteGame = document.getElementById('deleteGame')
    btnDeleteGame.onclick = deleteGame
}

window.onload = init