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

//Generates the button bellow the board
var generateControlButtons = function() {
    var html = '<div id="control">'
    html += '<button class="control" id="openNav">Menu</button>'
    html += '<button class="control" id="resetGame">Reiniciar</button>'
    html += '</div>'
    return html
}

//Generate the score
var showScore = function() {
    var html = '<div id="score"><h2>Puntaje: ' + totalScore + ' </h2></div>'
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
                openPopupForm('&#127881&#10024GANASTE&#10024&#127881')
            }
            else {
                openPopupForm('Estuviste cerca')
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

var startGame = function() {
    //Generate the board, the pegs and holes
    var boardElement = document.getElementById('board')
    boardElement.innerHTML = generateBoard()
    //Asing the click buttons to buttons
    var pegs = boardElement.getElementsByClassName('ballPlace')
    addPegsEventHandlers(pegs)
    var holes = boardElement.getElementsByClassName('ballPlaceEmpty')
    addHolesEventHandlers(holes)
    //Board control buttons
    document.getElementById('openNav').onclick = openNav
    document.getElementById('resetGame').onclick = resetGame
}

//Initialize the game
var init = function() {
    //localStorage.clear()
    loadGames()
    generateGamesTable()
    loadScores()
    generateScoreTable()
    startGame()
    //Save game buttons
    document.getElementById('closeNav').onclick = closeNav
    document.getElementById('saveGame').onclick = saveGame
    document.getElementById('loadGame').onclick = loadGame
    document.getElementById('deleteGame').onclick = deleteGame
    document.getElementById('showScores').onclick = openPopup
    //Popup buttons
    document.getElementById('closePopup').onclick = closePopup
    document.getElementById('saveScore').onclick = saveScore
    document.getElementById('resetGamePopup').onclick = resetGame
}

window.onload = init