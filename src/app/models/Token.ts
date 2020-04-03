export class Token {
    lexema: string;
    description: string;
    row: number;
    column: number;

    constructor(l: string, des: string, r: number, col: number) {
        this.lexema = l;
        this.description = des;
        this.row = r;
        this.column = col;
    }
    getLexema() {
        return this.lexema;
    }
    getDescription() {
        return this.description;
    }
    getRow() {
        return this.row;
    }
    getColum() {
        return this.column;
    }

    toString(){
        return {
            "lexema" : this.lexema,
            "description" : this.description,
            "row" : this.row,
            "col" : this.column
        };
    }
}

