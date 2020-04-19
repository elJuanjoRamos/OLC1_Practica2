import {TokenTable} from '../models/TokenTable';

export class TableController{

    //GLOVAL VARIABLES
    private arrayListVariable: TokenTable[] = [];


    //SINGLETON
    private static instance: TableController;

    private constructor() { }

    public static getInstance(): TableController {
        if (!TableController.instance) {
            TableController.instance = new TableController();
        }
        return TableController.instance;
    }

    //Methods
    InsertToken(id: string, type:string, ambit: string, row: number){
        var tok = new TokenTable(id, type, ambit, row);
        this.arrayListVariable.push(tok);
    }
    public searchVariable(id: string, ambit: string) : boolean {

        for (let i = 0; i < this.arrayListVariable.length; i++) {
            const e = this.arrayListVariable[i];
            if(e.getId() == id && e.getAmbit() == ambit ){
                return true;
                break;
            }   
        }
        return false;
    }
    clear(){
        this.arrayListVariable = [];
    }        
    
    public get getArrayList() : TokenTable[] {
        return this.arrayListVariable;
    }

}