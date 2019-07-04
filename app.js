var initialState = [
    [ undefined, undefined, 1, 1, 1, undefined, undefined],
    [ undefined, undefined, 1, 1, 1, undefined, undefined],
    [     1    ,     1    , 1, 1, 1,     1    ,     1    ],
    [     1    ,     1    , 1, 0, 1,     1    ,     1    ],
    [     1    ,     1    , 1, 1, 1,     1    ,     1    ],
    [ undefined, undefined, 1, 1, 1, undefined, undefined],
    [ undefined, undefined, 1, 1, 1, undefined, undefined]
]

//Declare varible and HTML structure
var dynamicBoard = '<ul>'
for (row = 0; row < initialState.length; row++) {
    dynamicBoard += '<li>' 
    for (column = 0; column < initialState[row].length; column++) {
        if(initialState[row][column] == 1 || initialState[row][column] == 0 ){
            dynamicBoard += '<button></button>'
        }
    }
    dynamicBoard += '</li>'
}
dynamicBoard += '</ul>'

console.log(dynamicBoard)

window.onload = function(){
//Obteain the element 'board' on the HML
const boardElement = document.getElementById('board')
//Show HTML 
boardElement.innerHTML = dynamicBoard;
}
