import { Tile } from "./tile.js"


let tiles, gameState = true

function createTable() {
    let width = $(document).width()
    const columns = width < 530? 10 : (width < 700? 15 : 20)
    
    let height = $(document).height()
    const rows = height < 615? 10 : (height < 780? 15 : 20)
    
    tiles = new Array

    for(let i=0;i<rows;i++) {
        $("#gameContainer").append(`<tr id="row${i}" style="background-color:green;"></tr>`)

        for(let j=0;j<columns;j++) {
            $(`#row${i}`).append(`<td id="row${i}col${j}" class="row${i} col${j}"></td>`)
            tiles.push(new Tile(`row${i}col${j}`,i,j,(Math.random() > 0.18 ? false : true)))
        }
    }

    $("td").on("click", event => {tileClicked(event)})
    $("td").on("contextmenu", event => {tileRightClicked(event)})
}
createTable()

$("input").on("click",() => {
    $("#gameOver").css("display","none")
    $("#gameContainer").html("")
    gameState = true
    createTable()
})

//DEBUG BOMB MARKING
// tiles.forEach(tile => { if (tile.bomb === true) $(`#${tile.id}`).html("X")})

//Tile clicked
function tileClicked(event) {
    let e = event.currentTarget
    if (gameState === true) {
        
        //Grabbing coords
        let origTile = tiles.filter(tile => {return tile.id === `${e.id}`})[0]
        console.log(origTile)
        
        //Is it a bomb?
        if (origTile.bomb === true) {
            for (let i=0;i<tiles.length;i++) {
                if (tiles[i].bomb) {
                    $(`#${tiles[i].id}`).html("X")
                    $(`#${tiles[i].id}`).css("background-color",("red"))
                }
            }
            gameState = false
            $("#gameOver").html("You lose!")
            $("#gameOver").css("display","block")
    
        }
        else tileCheck(origTile)
    }
}

//Tile right clicked (flagged)
function tileRightClicked(event) {
    event.preventDefault()
    let e = event.currentTarget

    if (gameState === true) {
        
        //Grabbing coords
        let origTile = tiles.filter(tile => {return tile.id === `${e.id}`})[0]
        console.log(origTile)
        
        if (origTile.checked === false) {
            $(`#${e.id}`).css("background-color",("salmon"))
            
            if (origTile.flagged) {
                origTile.flagged = false
                $(`#${e.id}`).css("background-color",(origTile.checked ? "lightgreen" : "lightblue"))
            }
            else {
                origTile.flagged = true
                $(`#${e.id}`).css("background-color",("salmon"))
            }
        }   
    }
}

function tileCheck(origTile) {
    if (!origTile.checked) {
        origTile.checked = true
        
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
        if ( tiles.filter(tile => {return tile.bomb === false && tile.checked === false}).length === 0 && gameState === true) {
            $("#gameOver").html("You Win!")
            $("#gameOver").css("display","block")
            gameState = false
        }
    }
}
