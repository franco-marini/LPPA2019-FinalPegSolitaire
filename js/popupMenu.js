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

var openPopupForm = function(message) {
    //Change by class the overlay to visible
    overlay = document.getElementsByClassName('overlay')[0]
    overlay.classList.add('active')
    //Show the form to save the score on the high scores
    overlay.getElementsByTagName('form')[0].classList.remove('inactive')
    showPopupMessage(message)
}

var openPopup = function() {
    closeNav()
    //Change by class the overlay to visible
    overlay = document.getElementsByClassName('overlay')[0]
    overlay.classList.add('active')
    //Only show the High scores, it dosent show the form to save the score
    overlay.getElementsByTagName('form')[0].classList.add('inactive')
    var divMessage = document.getElementById('message')
    divMessage.innerText = ''
}