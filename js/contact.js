var emailTo = 'francoma98@hotmail.com'
var emailCC = 'franco-marini@outlook.com'
var subject = 'Contacto'
var message = 'Hola jejej'

var sendEmail = function() {
    console.log('enviar')
    location.href = "mailto:"+emailTo
}

var init = function() {
    document.getElementById('send').onclick = sendEmail
}


window.onload = init