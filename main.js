import { Tile } from "./tile.js"

const columns = 10, rows = 10, bombs = ((columns*rows)/100)*20
let tiles = [], gameState = false

function createRows() {
    for(let i=0;i<rows;i++) {
        $("#gameContainer-section table").append(`<tr id="row${i}" style="background-color:green;"></tr>`)

        for(let j=0;j<columns;j++) {
            $(`#row${i}`).append(`<td id="row${i}col${j}" class="row${i} col${j}"></td>`)
            tiles.push(new Tile(`row${i}col${j}`,i,j,(Math.random() > 0.25 ? false : true)))
        }
    }
}
createRows()

//DEBUG BOMB MARKING
tiles.forEach(tile => {
    if (tile.bomb === true) $(`#${tile.id}`).html("X")
})

//Tile clicked
$("td").on("click", event => {
    let e = event.currentTarget
    $(`#${e.id}`).css("background-color",("green"))

    //Grabbing coords
    let origTile = tiles.filter(tile => {return tile.id === `${e.id}`})[0]
    console.log(origTile)

    //Is it a bomb?
    if (origTile.bomb === true) alert("Loss!")
    else tileCheck(origTile)
})

$("td").on("contextmenu", event => {
    event.preventDefault()
    let e = event.currentTarget
    
    $(`#${e.id}`).css("background-color",("red"))

    //Grabbing coords
    let origTile = tiles.filter(tile => {return tile.id === `${e.id}`})[0]
    console.log(origTile)

    if (origTile.flagged) {
        origTile.flagged = false
        $(`#${e.id}`).css("background-color",("lightgreen"))
    }
    else {
        origTile.flagged = true
        $(`#${e.id}`).css("background-color",("red"))
    }
})

function tileCheck(origTile) {
    if (!origTile.scanned) {
        origTile.scanned = true
        
        $(`#${origTile.id}`).css("background-color","lightgreen")
        
        //Getting neighbors
        let tempArray = tiles.filter(tile => {
            return tile.id !== origTile.id
            && (tile.row === origTile.row-1 || tile.row === origTile.row || tile.row === origTile.row+1)
            && (tile.col === origTile.col-1 || tile.col === origTile.col || tile.col === origTile.col+1)
        })
        
        //Is it touching a bomb?
        let bombNeighbors = 0
        for (let i = 0; i<tempArray.length; i++) if (tempArray[i].bomb === true) bombNeighbors++
        if (bombNeighbors > 0) $(`#${origTile.id}`).html(`${bombNeighbors}`)
        
        //Is it clear? 
        if (bombNeighbors === 0) for (let i=0;i<tempArray.length;i++)  tileCheck(tempArray[i])

        //Board cleared?
        if ( tiles.filter(tile => {return tile.bomb === false && tile.scanned === false}).length === 0 && gameState === false) {
            alert("You win!")
            gameState = true
        }
    }
}
