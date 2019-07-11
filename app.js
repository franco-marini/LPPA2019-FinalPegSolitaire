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

var getElement = function(id){
    var element = document.getElementById(id)
    return element || {}
}

var showSuggestions = function () {
    var near= {
        above:  getElement(createId(selectedPeg.x-1,selectedPeg.y)),
        left:   getElement(createId(selectedPeg.x,selectedPeg.y-1)),
        right:  getElement(createId(selectedPeg.x,selectedPeg.y+1)),
        below:  getElement(createId(selectedPeg.x+1,selectedPeg.y))
    }

    var possible= {
        above:  getElement(createId(selectedPeg.x-2,selectedPeg.y)),
        left:   getElement(createId(selectedPeg.x,selectedPeg.y-2)),
        right:  getElement(createId(selectedPeg.x,selectedPeg.y+2)),
        below:  getElement(createId(selectedPeg.x+2,selectedPeg.y))
    }

    if(near.above.className === 'ballPlace' && possible.above.className === 'ballPlaceEmpty'){
        possible.above.className = 'ballPlaceAvailable'
    }

    if(near.left.className === 'ballPlace' && possible.left.className === 'ballPlaceEmpty'){
        possible.left.className = 'ballPlaceAvailable'
    }

    if(near.right.className === 'ballPlace' && possible.right.className === 'ballPlaceEmpty'){
        possible.right.className = 'ballPlaceAvailable'
    }

    if(near.below.className === 'ballPlace' && possible.below.className === 'ballPlaceEmpty'){
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

//Initialize the game
var init = function () {
    var boardElement = document.getElementById('board')
    boardElement.innerHTML = generateBoard()
    var pegs = boardElement.getElementsByClassName('ballPlace')
    addPegsEventHandlers(pegs)
}

window.onload = init