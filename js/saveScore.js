var savedScores = []

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
    document.getElementById('bestScores').innerHTML = html
}