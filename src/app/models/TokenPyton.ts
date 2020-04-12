export class TokenPyton {
    lexema: string;
    description: string;

    constructor(l: string, des: string) {
        this.lexema = l;
        this.description = des;
    }
    getLexema() {
        return this.lexema;
    }
    getDescription() {
        return this.description;
    }
    
    toString(){
        return this.lexema;
    }
}

