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
var allSuggestions = []
var totalScore = 0
var savedGames = []
var savedScores = []

var startGame = function() {
    var boardElement = document.getElementById('board')
    boardElement.innerHTML = generateBoard()
    var pegs = boardElement.getElementsByClassName('ballPlace')
    addPegsEventHandlers(pegs)
    var holes = boardElement.getElementsByClassName('ballPlaceEmpty')
    addHolesEventHandlers(holes)
}

//Show the save menu
//Change the style of the vertical menu
var openNav = function() {
    document.getElementById('verticalMenu').classList.add('width')
    document.getElementById('content').classList.add('marginLeft')
}

//Hide the save menu
//Change the style of the vertical menu
var closeNav = function() {
    document.getElementById('verticalMenu').classList.remove('width')
    document.getElementById('content').classList.remove('marginLeft')
}

var closePopup = function() {
    //Change by class the overlay to hidden
    overlay = document.getElementsByClassName('overlay')[0]
    overlay.classList.remove('active')
    overlay.getElementsByTagName('form')[0].classList.add('inactive')
}

var showPopupMessage = function(message) {
    var divMessage = document.getElementById('message')
    divMessage.innerHTML = '<h2>' + message + '</h2>'
}

var openPopup = function(message) {
    //Change by class the overlay to visible
    overlay = document.getElementsByClassName('overlay')[0]
    overlay.classList.add('active')
    //Show the form to save the score on the high scores
    overlay.getElementsByTagName('form')[0].classList.remove('inactive')
    showPopupMessage(message)
}

var openPopupBtn = function() {
    closeNav()
    //Change by class the overlay to visible
    overlay = document.getElementsByClassName('overlay')[0]
    overlay.classList.add('active')
    //Only show the High scores, it dosent show the form to save the score
    overlay.getElementsByTagName('form')[0].classList.add('inactive')
    var divMessage = document.getElementById('message')
    divMessage.innerText = ''
}

//#region Save Game functions
//Returns the date and hour of today
var getDate = function() {
    var date = new Date()
    var yyyy = date.getFullYear()
    var dd = date.getDate()
    var mm = (date.getMonth() + 1)
    //Puts the 0 for the numbers below 2 digits
    if(dd < 10) {
        dd = '0' + dd
    }
    if(mm < 10) {
        mm = '0' + mm
    }
    var currentDay = yyyy + '-' + mm + '-' + dd
    var hours = date.getHours()
    var minutes = date.getMinutes()
    var seconds = date.getSeconds()
    //Puts the 0 for the numbers below 2 digits
    if(hours < 10) {
        hours = '0' + hours
    }
    if(minutes < 10) {
        minutes = '0' + minutes
    }
    if(seconds < 10) {
        seconds = '0' + seconds
    }
    return currentDay + 'T' + hours + ':' + minutes + ':' + seconds
}

var compareDateScore = function(a, b) {
    //Order by best score and lastest date
    return b.score - a.score || new Date(b.date) - new Date(a.date) 
}

var saveScore = function() {
    var nameTxt = document.getElementById('scoreName').value
    //Validations - CHECK
    if(nameTxt.length < 3) {
        alert('Debes escribir por lo menos 3 caracteres')
        return
    }
    if(nameTxt.length > 6) {
        alert('Maximo 6 caracteres')
        return
    }
    //Create a new object
    var newScore = {
        date: getDate(),
        name: nameTxt,
        score: totalScore
    }
    //Clean the textbox
    document.getElementById('scoreName').value = ''
    //Save the first 10 best scores
    savedScores.push(newScore)
    //Order by date and score
    savedScores.sort(compareDateScore)
    //Slice the array to top 10
    savedScores = savedScores.slice(0,10)
    //Save the scores on localstorage parsing the array to JSON format
    localStorage.setItem('savedScores', JSON.stringify(savedScores))
    closePopup()
    resetGame()
}

var loadScores = function() {
    //Get the array from localstorage and parse the from JSON format
    savedScores = JSON.parse(localStorage.getItem('savedScores'))
    if(savedScores === null) {
        savedScores = []
    }
}

var generateSavedScore = function(index) {
    //Generate one save score item 
    var html = '<li class="savedScore">' 
    html += savedScores[index].date + ' - ' + savedScores[index].name + ' - ' + savedScores[index].score
    html += '</li>'
    return html
}

var generateScoreTable = function() {
    //Generate the high score table
    var html = '<ul>'
    for(let i = 0; i < savedScores.length; i++) {
        html += generateSavedScore(i)
    }
    html += '</ul>'
    return html
}

var saveGame = function() {
    var nameTxt = document.getElementById('nameTxt').value
    //Checks the length of the name for save the game
    if(nameTxt.length < 3) {
        alert('Debes escribir por lo menos 3 caracteres')
        return
    }
    if(nameTxt.length > 13) {
        alert('Debes escribir hasta 13 caracteres')
        return
    }
    //Asign the board to an object called newGame
    var newGame = {
        date: getDate(),
        name: nameTxt,
        score: totalScore,
        board: board
    }
    document.getElementById('nameTxt').value = ''
    //Save the games on localstorage parsing the array to JSON format
    savedGames.push(newGame)
    localStorage.setItem('savedGames', JSON.stringify(savedGames))
    generateGamesTable()
    closeNav()
}

var compareDate = function(a, b) {
    //Order by newer the saved games by date
    return new Date(b.date) - new Date(a.date)
}

var loadGames = function() {
    //Get the array from localstorage and parse the from JSON format
    savedGames = JSON.parse(localStorage.getItem('savedGames'))
    if(savedGames === null) {
        //Fix the problem with the array when is null
        savedGames = []
    }
    //Sort by date all the saved games
    savedGames.sort(compareDate)
}

var generateGamesTable = function() {
    var divList = document.getElementById('listGames')
    //generate with HTML structure a list of the saved games
    divList.innerHTML = '<ul>'
    for(let i = 0; i < savedGames.length; i++) {
        divList.innerHTML += '<li class="savedGame">' + savedGames[i].date + ' - ' + savedGames[i].name + ' <input type="radio" name="rbtGame" value="' + savedGames[i].date + '"></li>'
    }
    divList.innerHTML += '</ul>'
}

var findGame = function() {
    //Get all the elements with the name rbtGame (radio button)
    var rates = document.getElementsByName('rbtGame')
    var rateValue
    //Checks which radio button is selected
    for(let i = 0; i < rates.length; i++) {
        if(rates[i].checked) {
            //Save the value of the radiobutton seleced
            rateValue = rates[i].value
        }
    }
    //Compares the radio button selected with all the saved games
    var game
    for(let i = 0; i < savedGames.length; i++) {
        //Search for the equal date
        if(savedGames[i].date == rateValue) {
            game = savedGames[i]
        }
    }
    return game
}

var loadGame = function() {
    board = findGame().board
    totalScore = findGame().score
    startGame()
    closeNav()
}

var deleteGame = function() {
    for(let i = 0; i < savedGames.length; i++) {
        if(savedGames[i].date == findGame().date) {
            savedGames.splice(i, 1)
        }
    }
    localStorage.setItem('savedGames', JSON.stringify(savedGames))
    generateGamesTable()
}

var resetGame = function() {
    location.reload()
}
//#endregion

var showScore = function() {
    var html = '<div id="score"><h2>Puntaje: ' + totalScore + ' </h2></div>'
    return html
}

//#region Functional of the game
//Creates an id for a peg
var createId = function(rowN, colN) {
    return 'peg-' + rowN + '-' + colN
}

//Get the position of the peg from an id
var getPositionFromId = function(id) {
    //Checks if the id is not null and if id has length, if is true split the string
    var idParts = id && id.length ? id.split('-') : []
    //Checks if the array has 3 elements
    if(idParts.length === 3) {
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
var generateCell = function(cell, rowN, colN) {
    //Id is the location of the peg
    //Depend of the value, set the class 
    var html = '<button id="' + createId(rowN, colN) + '" class="'
    if(cell && cell.value) {
        html += 'ballPlace'
    }
    else if(cell && cell.value == 0) {
        html += 'ballPlaceEmpty'
    }
    else {
        html += 'hidden'
    }
    html += '"></button>'
    return html
}

//Generate the row
var generateRow = function(row, rowN) {
    var html = '<div class="row">'
    for(let column = 0; column < row.length; column++) {
        html += generateCell(row[column], rowN, column)
    }
    html += '</div>'
    return html
}

var generateControlButtons = function() {
    var html = '<div id="control">'
    html += '<button class="control" id="openNav">Guardar</button>'
    html += '<button class="control" id="resetGame">Reiniciar</button>'
    html += '</div>'
    return html
}

//Generate all the rows for the game
var generateBoard = function() {
    //Show the score on the top of the board
    var html = showScore() + '<div class="board">'
    for(let row = 0; row < board.length; row++) {
        html += generateRow(board[row], row)
    }
    html += '</div>'
    //Create the buttons to control the reset or the vertical menu
    html += generateControlButtons()
    return html
}

//Changes the class when unselect a peg
var unselectPeg = function() {
    //Checks if there is a selected peg
    if(selectedPeg.x !== undefined && selectedPeg.y !== undefined) {
        var prevSelectedId = createId(selectedPeg.x, selectedPeg.y)
        document.getElementById(prevSelectedId).className = 'ballPlace'
        var suggestions = document.getElementsByClassName('ballPlaceAvailable')
        for(let i = 0; i < suggestions.length; i++) {
            suggestions[i].className = 'ballPlaceEmpty'
        }
    }
}

//Returns an element by the id
var getElement = function(id) {
    var element = document.getElementById(id)
    return element || {}
}

//Returns from position the near peg
var getNearPeg = function(x, y) {
    var near = {
        above: getElement(createId(x - 1, y)),
        left: getElement(createId(x, y - 1)),
        right: getElement(createId(x, y + 1)),
        below: getElement(createId(x + 1, y))
    }
    return near
}

//Returns from position the possible peg
var getPossiblePeg = function(x, y) {
    var possible = {
        above: getElement(createId(x - 2, y)),
        left: getElement(createId(x, y - 2)),
        right: getElement(createId(x, y + 2)),
        below: getElement(createId(x + 2, y))
    }
    return possible
}

var showSuggestions = function() {
    //Get the elements which are near the selected peg
    var near = getNearPeg(selectedPeg.x, selectedPeg.y)
    //Get the elements which are possible moves of the selected peg
    var possible = getPossiblePeg(selectedPeg.x, selectedPeg.y)
    //Changes the class of buttons which are possible move in all axis
    if(near.above.className === 'ballPlace' && possible.above.className === 'ballPlaceEmpty') {
        possible.above.className = 'ballPlaceAvailable'
        suggestions.push(possible.above.id)
    }
    if(near.left.className === 'ballPlace' && possible.left.className === 'ballPlaceEmpty') {
        possible.left.className = 'ballPlaceAvailable'
        suggestions.push(possible.left.id)
    }
    if(near.right.className === 'ballPlace' && possible.right.className === 'ballPlaceEmpty') {
        possible.right.className = 'ballPlaceAvailable'
        suggestions.push(possible.right.id)
    }
    if(near.below.className === 'ballPlace' && possible.below.className === 'ballPlaceEmpty') {
        possible.below.className = 'ballPlaceAvailable'
        suggestions.push(possible.below.id)
    }
}

var selectPeg = function(evt) {
    //Clean the suggestions
    suggestions = []
    //Gets the peg
    var peg = evt.target
    //Convert the id (x, y) into int numbers
    var pos = getPositionFromId(peg.id)
    if(pos.x !== undefined && pos.y !== undefined) {
        //Restores the classes
        unselectPeg()
        //Checks if the new selected peg is the same
        if(selectedPeg.x === pos.x && selectedPeg.y === pos.y) {
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

//Asign to all the pegs the function--> selectPeg
var addPegsEventHandlers = function(pegs) {
    for(let i = 0; i < pegs.length; i++) {
        pegs[i].onclick = selectPeg
    }
}

var checkPlayerLoose = function() {
    //Get all the elements with the class ballPlace
    var pegs = document.getElementsByClassName('ballPlace')
    allSuggestions = []
    for(let i = 0; i < pegs.length; i++) {
        var pos = getPositionFromId(pegs[i].id)
        if(pos.x !== undefined && pos.y !== undefined) {
            //Get the elements which are near the selected peg
            var near = getNearPeg(pos.x, pos.y)
            //Get the elements which are possible moves of the selected peg
            var possible = getPossiblePeg(pos.x, pos.y)
            //Changes the class of buttons which are possible move in all axis
            if(near.above.className === 'ballPlace' && possible.above.className === 'ballPlaceEmpty') {
                allSuggestions.push(possible.above.id)
            }
            if(near.left.className === 'ballPlace' && possible.left.className === 'ballPlaceEmpty') {
                allSuggestions.push(possible.left.id)
            }
            if(near.right.className === 'ballPlace' && possible.right.className === 'ballPlaceEmpty') {
                allSuggestions.push(possible.right.id)
            }
            if(near.below.className === 'ballPlace' && possible.below.className === 'ballPlaceEmpty') {
                allSuggestions.push(possible.below.id)
            }
        }
    }
    if(allSuggestions.length === 0) {
        return true
    }
    else {
        return false
    }
}

var movePeg = function(evt) {
    //Gets the peg clicked
    var id = evt.target.id
    var pos = getPositionFromId(id)
    if(pos.x !== undefined && pos.y !== undefined) {
        //Returns true if the element is in the array suggestions 
        if(suggestions.includes(id)) {
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
        if(checkPlayerLoose()) {
            var pegs = document.getElementsByClassName('ballPlace')
            if(pegs.length === 1) {
                openPopup('&#127881&#10024GANASTE&#10024&#127881')
            }
            else {
                openPopup('Estuviste cerca')
            }
        }
    }
}

//Asign to all the holes the function--> movePeg
var addHolesEventHandlers = function(holes) {
    for(let i = 0; i < holes.length; i++) {
        holes[i].onclick = movePeg
    }
}
//#endregion

//Initialize the game
var init = function() {
    //localStorage.clear()
    loadGames()
    generateGamesTable()
    loadScores()
    document.getElementById('bestScores').innerHTML = generateScoreTable()
    startGame()
    //Save game buttons
    document.getElementById('closeNav').onclick = closeNav
    document.getElementById('saveGame').onclick = saveGame
    document.getElementById('loadGame').onclick = loadGame
    document.getElementById('deleteGame').onclick = deleteGame
    document.getElementById('showScores').onclick = openPopupBtn
    //Board control buttons
    document.getElementById('openNav').onclick = openNav
    document.getElementById('resetGame').onclick = resetGame
    //Popup buttons
    document.getElementById('closePopup').onclick = closePopup
    document.getElementById('saveScore').onclick = saveScore
    document.getElementById('resetGamePopup').onclick = resetGame
}

window.onload = init