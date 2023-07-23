export class Tile {
    constructor(id,row,col,bomb){
        this.id = id
        this.row = row
        this.col = col
        this.bomb = bomb
        this.checked = false
        this.flagged = false
    }
}