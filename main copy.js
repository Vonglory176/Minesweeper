import { Tile } from "./tile.js"

const columns = 10, rows = 10, bombs = ((columns*rows)/100)*20
let tiles = []

function createRows() {
    for(let i=0;i<rows;i++) {
        $("#gameContainer-section table").append(`<tr id="row${i}" style="background-color:green;"></tr>`)
        tiles.push([])

        for(let j=0;j<columns;j++) {
            $(`#row${i}`).append(`<td id="row${i}col${j}" class="row${i} col${j}"></td>`)
            tiles[i].push(new Tile(`row${i}col${j}`,i,j,(Math.random() > 0.25 ? false : true)))
        }
    }
}

createRows()

//Is Bomb?
for (let i = 0; i<tiles.length; i++) {
    for (let j = 0; j<tiles[i].length; j++) {
        if (tiles[i][j].bomb === true) {
            // $(`#row${tiles[i][j].row}col${tiles[i][j].col}`).html("X")
            $(`#row${i}col${j}`).html("X")
        }
    }
}

//Tile clicked
$("td").on("click", event => {
    let e = event.currentTarget
    $(`#${e.id}`).css("background-color",("green"))

    // let origTile = tiles.filter(tile => {return tile.id === `${e.id}`})[0]
    // console.log(origTile)
    let origTile
    for (let i = 0; i<tiles.length; i++) {
        if (!origTile) origTile = tiles[i].filter(tile => {return tile.id === `${e.id}`})[0]
    }

    //Is it a bomb?
    if (origTile.bomb === true) alert("Loss!")
    else tileCheck(origTile)
})

$("td").on("contextmenu", event => {
    event.preventDefault()
    let e = event.currentTarget
    $(`#${e.id}`).css("background-color",("red"))
})

function tileCheck(origTile) {
    //Getting neighbors
    // let tempArray = tiles.filter(tile => {
    //     return tile.id !== htmlID
    //     && (tile.row === origTile.row-1 || tile.row === origTile.row || tile.row === origTile.row+1)
    //     && (tile.col === origTile.col-1 || tile.col === origTile.col || tile.col === origTile.col+1)
    // })
    if (!origTile.scanned) {
        origTile.scanned = true

        let tempArray = []
        for (let i = -1; i<2; i++) {
            for (let j = -1; j<2; j++) {
                if ((origTile.row+i >= 0 && origTile.col+j >= 0) && //Within 1 row
                    (origTile.row+i < rows && origTile.col+j < columns) && //Within 1 col
                    origTile.id !== tiles[origTile.row+i][origTile.col+j].id //Not its own coords
                    ) {
                        tempArray.push(tiles[origTile.row+i][origTile.col+j])
                        $(`#${tiles[origTile.row+i][origTile.col+j].id}`).css("background-color","lightgreen")
                }
            }
        }
    
        //Is it touching a bomb?
        let bombNeighbors = 0
        for (let i = 0; i<tempArray.length; i++) if (tempArray[i].bomb === true) bombNeighbors++
        if (bombNeighbors > 0) $(`#${origTile.id}`).html(`${bombNeighbors}`)
        
        //Is it clear? 
        if (bombNeighbors === 0) {
            for (let i=0;i<tempArray.length;i++)  tileCheck(tempArray[i])
        }
    }
}

//CLICK!
// Is it a bomb? (Game over)
// Is it touching a bomb? (Set Number)
// Is it clear? (Fire neighbor checks)
