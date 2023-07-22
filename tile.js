export class Tile {
    constructor(id,row,col,bomb){
        this.id = id
        this.row = row
        this.col = col
        this.bomb = bomb
        this.scanned = false
        this.flagged = false
    }   

    bombCheck() {

    }
}