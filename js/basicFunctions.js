//Returns the date and hour of today
var getDate = function () {
    var date = new Date()
    var yyyy = date.getFullYear()
    var dd = date.getDate()
    var mm = (date.getMonth() + 1)
    var hours = date.getHours()
    var minutes = date.getMinutes()
    var seconds = date.getSeconds()
    //Puts the 0 for the numbers below 2 digits
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    var currentDay = yyyy + '-' + mm + '-' + dd
    //Puts the 0 for the numbers below 2 digits
    if (hours < 10) {
        hours = '0' + hours
    }
    if (minutes < 10) {
        minutes = '0' + minutes
    }
    if (seconds < 10) {
        seconds = '0' + seconds
    }
    return currentDay + 'T' + hours + ':' + minutes + ':' + seconds
}

//Reloads the page
var resetGame = function () {
    location.reload()
}

var compareDate = function (a, b) {
    //Order by newer the saved games by date
    return new Date(b.date) - new Date(a.date)
}

var compareDateScore = function (a, b) {
    //Order by best score and lastest date
    return b.score - a.score || new Date(b.date) - new Date(a.date)
}
