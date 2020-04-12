export class TokenVariable {
    lexema: string;
    type: string;
    row: number;
    
    constructor(l: string, des: string, r: number) {
        this.lexema = l;
        this.type = des;
        this.row = r;
    }
    getLexema() {
        return this.lexema;
    }
    getDescription() {
        return this.type;
    }
    getRow() {
        return this.row;
    }

    toString(){
        return {
            "lexema" : this.lexema,
            "type" : this.type,
            "row" : this.row,
        };
    }
}

