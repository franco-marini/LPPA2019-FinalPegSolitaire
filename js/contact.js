var emailTo = 'franco-marini@outlook.com'
var emailCC
var message

//Function to check letters and numbers
var checkAlphaNumeric = function(inputTxt) {
    //Regular expression to allow only letters, numbers and spaces
    var letterNumber = /^[a-z\d\s]+$/i
    //Checks if the input text is alphanumeric
    if(letterNumber.test(inputTxt)) {
        return true
    }
    else { 
        return false
    }
}

//Function to check the email format
var checkEmail = function(email) {
    //Regular expression to allow emails 
    var reEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    //Checks if the email contains the regular expression
    if(reEmail.test(email)){
        return true
    }
    else {
        return false
    }
  }

var sendEmail = function() {
    //Get all the textbox values
    var nameTxt = document.forms[0].elements.namedItem('name').value
    var emailTxt = document.forms[0].elements.namedItem('email').value
    var messageTxt = document.forms[0].elements.namedItem('message').value
    //Validate them
    //Check if the name if alphanumeric
    if(!checkAlphaNumeric(nameTxt)) {
        alert('Uno de los caracteres del nombre no es alfanumerico')
        return
    }
    //Check the email format
    if(!checkEmail(emailTxt)) {
        alert('El email no es valido')
        return
    }   
    //Check if the message length is mora than 5 characters
    if(messageTxt.length <= 4) {
        alert('El mensaje es muy corto')
        return
    }
    emailCC = emailTxt
    message = messageTxt
    //Send the email when all the validations are correct
    launchMailClient()
    //Clean the values
    document.forms[0].elements.namedItem('name').value = ''
    document.forms[0].elements.namedItem('email').value = ''
    document.forms[0].elements.namedItem('message').value = ''
}

var launchMailClient = function() {
    //Launch the default mail client
    location.href = 'mailto:'+emailTo+'?cc='+emailCC+'&subject=Contacto&body='+message
}

var init = function() {
    document.getElementById('send').onclick = sendEmail
}


window.onload = init