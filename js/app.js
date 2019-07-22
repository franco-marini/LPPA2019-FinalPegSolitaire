var board = [
    [undefined, undefined, { value: 1 }, { value: 1 }, { value: 1 }, undefined, undefined],
    [undefined, undefined, { value: 1 }, { value: 1 }, { value: 1 }, undefined, undefined],
    [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
    [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }],
    [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
    [undefined, undefined, { value: 1 }, { value: 1 }, { value: 1 }, undefined, undefined],
    [undefined, undefined, { value: 1 }, { value: 1 }, { value: 1 }, undefined, undefined]
]


var startGame = function(){
    var boardElement = document.getElementById('board')
    boardElement.innerHTML = generateBoard()
    var pegs = boardElement.getElementsByClassName('ballPlace')
    addPegsEventHandlers(pegs)
    var holes = boardElement.getElementsByClassName('ballPlaceEmpty')
    addHolesEventHandlers(holes)
}

//Returns the date and hour of today
function getDate() {
    var date = new Date()
    var yyyy = date.getFullYear()
    var dd = date.getDate()
    var mm = (date.getMonth() + 1)
    //Puts the 0 for the numbers below 2 digits
    if (dd < 10) {
        dd = "0" + dd
    }
    if (mm < 10) {
        mm = "0" + mm
    }
    var currentDay = yyyy + "-" + mm + "-" + dd
    var hours = date.getHours()
    var minutes = date.getMinutes()
    var seconds = date.getSeconds()
    //Puts the 0 for the numbers below 2 digits
    if (hours < 10) {
        hours = "0" + hours
    }
    if (minutes < 10) {
        minutes = "0" + minutes
    }
    if (seconds < 10) {
        seconds = "0" + seconds
    }
    return currentDay + "T" + hours + ":" + minutes + ":" + seconds
}

function compare(a, b) {
    //Order by descend the saved games by date
    return new Date(b.date) - new Date(a.date);
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
            //Converts/Parse JSON string into an object
            storedGames.push(JSON.parse(game))
        }
    }
    storedGames.sort(compare)
    return storedGames
}

function drawGamesTable() {
    var list = loadGames()
    var divList = document.getElementById('listGames')
    //Draw with HTML structure a list of the saved games
    divList.innerHTML = '<ul>'
    for (let i = 0; i < list.length; i++) {
        divList.innerHTML += '<li>' + list[i].date + " - " + list[i].name + ' <input type="radio" name="rbtGame" value="' + list[i].date + '">' + '</li>'
    }
    divList.innerHTML += '</ul>'
}

function findGame() {
    //Brings all the saved games in localStorage
    var storedGames = loadGames()
    //Get all the elements with the name rbtGame (radio button)
    var rates = document.getElementsByName('rbtGame')
    var rateValue
    //Checks which radio button is select
    for (var i = 0; i < rates.length; i++) {
        if (rates[i].checked) {
            rateValue = rates[i].value
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

function loadGame() {
    board = findGame().actualGame
    startGame()
}

function deleteGame() {
    localStorage.removeItem(findGame().date)
    drawGamesTable()
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

var resetGame = function () {
    location.reload()
}

//#region Functional of the game
var selectedPeg = { x: undefined, y: undefined }
var suggestions = []

//Creates an id for a peg
var createId = function (rowN, colN) {
    return 'peg-' + rowN + '-' + colN
}

//Get the position od the peg from an id
var getPositionFromId = function (id) {
    var idParts = id && id.length ? id.split('-') : []
    if (idParts.length === 3) {
        return {
            x: parseInt(idParts[1]),
            y: parseInt(idParts[2])
        }
    }
    return {}
}

//Generate all de the cells in one row
var generateCell = function (cell, rowN, colN) {
    //Id is the location of the peg
    //Depend of the value, set the class 
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
    //Checks if there is a selected peg
    if (selectedPeg.x !== undefined && selectedPeg.y !== undefined) {
        var prevSelectedId = createId(selectedPeg.x, selectedPeg.y)
        document.getElementById(prevSelectedId).className = 'ballPlace'
        var suggestions = document.getElementsByClassName('ballPlaceAvailable')
        for (let i = 0; i < suggestions.length; i++) {
            suggestions[i].className = 'ballPlaceEmpty'
        }
    }
}

//Returns an element by the id
var getElement = function (id) {
    var element = document.getElementById(id)
    return element || {}
}

var showSuggestions = function () {
    //Get the elements which are near the selected peg
    var near = {
        above: getElement(createId(selectedPeg.x - 1, selectedPeg.y)),
        left: getElement(createId(selectedPeg.x, selectedPeg.y - 1)),
        right: getElement(createId(selectedPeg.x, selectedPeg.y + 1)),
        below: getElement(createId(selectedPeg.x + 1, selectedPeg.y))
    }
    //Get the elements which are possible moves of the selected peg
    var possible = {
        above: getElement(createId(selectedPeg.x - 2, selectedPeg.y)),
        left: getElement(createId(selectedPeg.x, selectedPeg.y - 2)),
        right: getElement(createId(selectedPeg.x, selectedPeg.y + 2)),
        below: getElement(createId(selectedPeg.x + 2, selectedPeg.y))
    }
    //Changes the class of buttons which are possible move in all axis
    if (near.above.className === 'ballPlace' && possible.above.className === 'ballPlaceEmpty') {
        possible.above.className = 'ballPlaceAvailable'
        suggestions.push(possible.above.id)
    }
    if (near.left.className === 'ballPlace' && possible.left.className === 'ballPlaceEmpty') {
        possible.left.className = 'ballPlaceAvailable'
        suggestions.push(possible.left.id)
    }
    if (near.right.className === 'ballPlace' && possible.right.className === 'ballPlaceEmpty') {
        possible.right.className = 'ballPlaceAvailable'
        suggestions.push(possible.right.id)
    }
    if (near.below.className === 'ballPlace' && possible.below.className === 'ballPlaceEmpty') {
        possible.below.className = 'ballPlaceAvailable'
        suggestions.push(possible.below.id)
    }
}

var selectPeg = function (evt) {
    //Clean the suggestions
    suggestions = []
    //Gets the peg
    var peg = evt.target
    //Convert the id (x, y) into int numbers
    var idParts = peg.id && peg.id.length ? peg.id.split('-') : []
    if (idParts.length === 3) {
        unselectPeg()
        //Checks if the new selected peg is the same
        if (selectedPeg.x === parseInt(idParts[1]) && selectedPeg.y === parseInt(idParts[2])) {
            unselectPeg()
            selectedPeg.x = undefined
            selectedPeg.y = undefined
        }
        else {
            //Solution for suggestions for a previos selected peg 
            unselectPeg()
            selectedPeg.x = parseInt(idParts[1])
            selectedPeg.y = parseInt(idParts[2])
            peg.className = 'ballSelected'
            showSuggestions()
        }
    }
}

var addPegsEventHandlers = function (pegs) {
    for (let i = 0; i < pegs.length; i++) {
        pegs[i].onclick = selectPeg
    }
}

var movePeg = function (evt) {
    var id = evt.target.id
    var pos = getPositionFromId(id)
    if (pos.x !== undefined && pos.y !== undefined) {
        //Returns true if the element is in the array suggestions 
        if (suggestions.includes(id)) {
            var oldRow = selectedPeg.x
            var oldCol = selectedPeg.y
            var newRow = pos.x
            var newCol = pos.y
            var midRow = oldRow + ((newRow - oldRow) / 2)
            var midCol = oldCol + ((newCol - oldCol) / 2)
            board[oldRow][oldCol] = { value: 0 }
            board[midRow][midCol] = { value: 0 }
            board[newRow][newCol] = { value: 1 }
            selectedPeg = { x: undefined, y: undefined }
            suggestions = []
            init()
        }
    }
}

var addHolesEventHandlers = function (holes) {
    for (let i = 0; i < holes.length; i++) {
        holes[i].onclick = movePeg
    }
}
//#endregion


//Initialize the game
var init = function () {
    //localStorage.clear()
    startGame()
    drawGamesTable()
    var btnSaveGame = document.getElementById('saveGame')
    btnSaveGame.onclick = saveGame
    var btnLoadGame = document.getElementById('loadGame')
    btnLoadGame.onclick = loadGame
    var btnDeleteGame = document.getElementById('deleteGame')
    btnDeleteGame.onclick = deleteGame
    var btnResetGame = document.getElementById('resetGame')
    btnResetGame.onclick = resetGame
}

window.onload = init