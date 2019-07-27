var board = [
    [undefined, undefined, { value: 1 }, { value: 1 }, { value: 1 }, undefined, undefined],
    [undefined, undefined, { value: 1 }, { value: 1 }, { value: 1 }, undefined, undefined],
    [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
    [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 0 }, { value: 1 }, { value: 1 }, { value: 1 }],
    [{ value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }],
    [undefined, undefined, { value: 1 }, { value: 1 }, { value: 1 }, undefined, undefined],
    [undefined, undefined, { value: 1 }, { value: 1 }, { value: 1 }, undefined, undefined]
]

var selectedPeg = { x: undefined, y: undefined }
var suggestions = []
var vallSuggestions = []
var totalScore = 0

//#region Save Game functions
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

function saveGame() {
    var nameTxt = document.getElementById('nameTxt').value
    //Asign the board to an object called newGame
    //Checks the length of the name for save the game
    if (nameTxt.length < 3) {
        alert('Debes escribir por lo menos 3 caracteres')
        return;
    }
    if (nameTxt.length > 13) {
        alert('Debes escribir hasta 13 caracteres')
        return;
    }
    var newGame = {
        date: getDate(),
        name: nameTxt,
        score: totalScore,
        actualGame: board
    }
    document.getElementById('nameTxt').value = ''
    //Save the game with de date value as the primary key and parse the object to JSON format
    localStorage.setItem(getDate().toString(), JSON.stringify(newGame))
    drawGamesTable()
}

function compare(a, b) {
    //Order by descend the saved games by date
    return new Date(b.date) - new Date(a.date)
}

function loadGames() {
    var storedGames = []
    //Get all the items of localStorage, then save in a new variable the items parsing from JSON format
    for (var i = 0; i < localStorage.length; i++) {
        game = localStorage.getItem(localStorage.key(i))
        //Converts/Parse JSON string into an object
        storedGames.push(JSON.parse(game))
    }
    //Sort by date all the saved games
    storedGames.sort(compare)
    return storedGames
}

function drawGamesTable() {
    var list = loadGames()
    var divList = document.getElementById('listGames')
    //Draw with HTML structure a list of the saved games
    divList.innerHTML = '<ul>'
    for (let i = 0; i < list.length; i++) {
        divList.innerHTML += '<li class="savedGame">' + list[i].date + " - " + list[i].name + ' <input type="radio" name="rbtGame" value="' + list[i].date + '">' + '</li>'
    }
    divList.innerHTML += '</ul>'
}

function findGame() {
    //Brings all the saved games in localStorage
    var storedGames = loadGames()
    //Get all the elements with the name rbtGame (radio button)
    var rates = document.getElementsByName('rbtGame')
    var rateValue
    //Checks which radio button is selected
    for (var i = 0; i < rates.length; i++) {
        if (rates[i].checked) {
            //Save the value of the radiobutton seleced
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
    totalScore = findGame().score
    startGame()
}

function deleteGame() {
    localStorage.removeItem(findGame().date)
    drawGamesTable()
}

var resetGame = function () {
    location.reload()
}
//#endregion

var showScore = function () {
    var html = '<div id="score"><h2>Puntaje: ' + totalScore + ' </h2></div>'
    return html
}

//#region Functional of the game

//Creates an id for a peg
var createId = function (rowN, colN) {
    return 'peg-' + rowN + '-' + colN
}

//Get the position of the peg from an id
var getPositionFromId = function (id) {
    //Checks if the id is not null and if id has length, if is true split the string
    var idParts = id && id.length ? id.split('-') : []
    //Checks if the array has 3 elements
    if (idParts.length === 3) {
        //Returns the value x and y
        return {
            x: parseInt(idParts[1]),
            y: parseInt(idParts[2])
        }
    }
    //if not, returns nothing
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
    //Show the score on the top of the board
    var html = showScore() + '<div class="board">'
    for (row = 0; row < board.length; row++) {
        html += generateRow(board[row], row)
    }
    html += '</div>'
    //Create a button to show the vertical menu
    html += '<button id="openNav">Guardar juego</button> '
    return html
}

//Changes the class when unselect a peg
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

//Returns from position the near peg
var getNearPeg = function(x, y){
    var near = {
        above: getElement(createId(x - 1, y)),
        left: getElement(createId(x, y - 1)),
        right: getElement(createId(x, y + 1)),
        below: getElement(createId(x + 1, y))
    }
    return near 
}

//Returns from position the possible peg
var getPossiblePeg = function(x, y){
    var possible = {
        above: getElement(createId(x - 2, y)),
        left: getElement(createId(x, y - 2)),
        right: getElement(createId(x, y + 2)),
        below: getElement(createId(x + 2, y))
    }
    return possible 
}

var showSuggestions = function () {
    //Get the elements which are near the selected peg
    var near = getNearPeg(selectedPeg.x, selectedPeg.y)
    //Get the elements which are possible moves of the selected peg
    var possible = getPossiblePeg(selectedPeg.x, selectedPeg.y)
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

var checkPlayerLoose = function () {
    //Get all the elements with the class ballPlace
    var pegs = document.getElementsByClassName('ballPlace')
    allSuggestions = []
    for (i = 0; i < pegs.length; i++) {
        var pos = getPositionFromId(pegs[i].id)
        if (pos.x !== undefined && pos.y !== undefined) {
            //Get the elements which are near the selected peg
            var near = getNearPeg(pos.x, pos.y)
            //Get the elements which are possible moves of the selected peg
            var possible = getPossiblePeg(pos.x, pos.y)
            //Changes the class of buttons which are possible move in all axis
            if (near.above.className === 'ballPlace' && possible.above.className === 'ballPlaceEmpty') {
                allSuggestions.push(possible.above.id)
            }
            if (near.left.className === 'ballPlace' && possible.left.className === 'ballPlaceEmpty') {
                allSuggestions.push(possible.left.id)
            }
            if (near.right.className === 'ballPlace' && possible.right.className === 'ballPlaceEmpty') {
                allSuggestions.push(possible.right.id)
            }
            if (near.below.className === 'ballPlace' && possible.below.className === 'ballPlaceEmpty') {
                allSuggestions.push(possible.below.id)
            }
        }
    }
    if(allSuggestions.length === 0){
        return true;
    }
    else{
        return false;
    }
}

var selectPeg = function (evt) {
    //Clean the suggestions
    suggestions = []
    //Gets the peg
    var peg = evt.target
    //Convert the id (x, y) into int numbers
    var pos = getPositionFromId(peg.id)
    if (pos.x !== undefined && pos.y !== undefined) {
        //Restores the classes
        unselectPeg()
        //Checks if the new selected peg is the same
        if (selectedPeg.x === pos.x && selectedPeg.y === pos.y) {
            unselectPeg()
            selectedPeg.x = undefined
            selectedPeg.y = undefined
        }
        else {
            //Solution for suggestions for a previos selected peg 
            unselectPeg()
            //Asign the values of the selected peg
            selectedPeg.x = pos.x
            selectedPeg.y = pos.y
            //Change the class of the selected peg
            peg.className = 'ballSelected'
            showSuggestions()
        }
    }
}

//Asign to all the pegs the function --> selectPeg
var addPegsEventHandlers = function (pegs) {
    for (let i = 0; i < pegs.length; i++) {
        pegs[i].onclick = selectPeg
    }
}

var movePeg = function (evt) {
    //Gets the peg clicked
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
            //Reset the values of the selected peg
            selectedPeg = { x: undefined, y: undefined }
            //Clean the suggestions
            suggestions = []
            //Increase the score
            totalScore += 10
            init()
        }
        if(checkPlayerLoose()){
            var pegs = document.getElementsByClassName('ballPlace')
            if(pegs.length === 1){
                alert('GANASTE')
            }
            else{
                alert('PERDISTE')
            }
        }
    }
}

//Asign to all the holes the function --> movePeg
var addHolesEventHandlers = function (holes) {
    for (let i = 0; i < holes.length; i++) {
        holes[i].onclick = movePeg
    }
}
//#endregion

var startGame = function () {
    var boardElement = document.getElementById('board')
    boardElement.innerHTML = generateBoard()
    var pegs = boardElement.getElementsByClassName('ballPlace')
    addPegsEventHandlers(pegs)
    var holes = boardElement.getElementsByClassName('ballPlaceEmpty')
    addHolesEventHandlers(holes)
}

//Show the save menu
//Change the style of the vertical menu
function openNav() {
    document.getElementById("verticalMenu").style.width = "290px"
    document.getElementById("content").style.marginLeft = "290px"
}
//Hide the save menu
//Change the style of the vertical menu
function closeNav() {
    document.getElementById("verticalMenu").style.width = "0"
    document.getElementById("content").style.marginLeft = "0"
}

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
    var btnOpenNav = document.getElementById('openNav')
    btnOpenNav.onclick = openNav
    var btnCloseNav = document.getElementById('closeNav')
    btnCloseNav.onclick = closeNav
}

window.onload = init