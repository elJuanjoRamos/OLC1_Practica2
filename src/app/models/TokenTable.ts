export class TokenTable {

    id: string;
    type: string;
    ambit: string;
    row: number;
    
    constructor(l: string, des: string,a: string, r: number) {
        this.id = l;
        this.type = des;
        this.row = r;
        this.ambit = a;
    }
    getId() {
        return this.id;
    }
    getDescription() {
        return this.type;
    }
    getRow() {
        return this.row;
    }
    getAmbit() {
        return this.ambit;
    }

    toString(){
        return {
            "id" : this.id,
            "type" : this.type,
            "row" : this.row,
            "ambit" : this.ambit
        };
    }

}