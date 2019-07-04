var initialState = [
    [ undefined, undefined, 1, 1, 1, undefined, undefined],
    [ undefined, undefined, 1, 1, 1, undefined, undefined],
    [     1    ,     1    , 1, 1, 1,     1    ,     1    ],
    [     1    ,     1    , 1, 0, 1,     1    ,     1    ],
    [     1    ,     1    , 1, 1, 1,     1    ,     1    ],
    [ undefined, undefined, 1, 1, 1, undefined, undefined],
    [ undefined, undefined, 1, 1, 1, undefined, undefined]
]

for (row = 0; row < initialState.length; row++) {
    console.log('Row')
    for (column = 0; column < initialState[row].length; column++) {
        console.log(initialState[row][column])
    }
}