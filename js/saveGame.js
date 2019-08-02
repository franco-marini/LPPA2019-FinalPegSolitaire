var savedGames = []

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

var generateSavedGame = function(index) {
    //Generate one saved game item
    var html = '<li class="savedGame">'
    html += savedGames[index].date + ' - ' + savedGames[index].name
    html += ' <input type="radio" name="rbtGame" value="' + savedGames[index].date + '">'
    html += '</li>'
    return html
}

var generateGamesTable = function() {
    //Generate save game table
    var html = '<ul>'
    for(let i = 0; i < savedGames.length; i++) {
        html += generateSavedGame(i)
    }
    html += '</ul>'
    document.getElementById('listGames').innerHTML = html
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
    savedGames.splice(savedGames.indexOf(findGame()), 1)
    localStorage.setItem('savedGames', JSON.stringify(savedGames))
    generateGamesTable()
}