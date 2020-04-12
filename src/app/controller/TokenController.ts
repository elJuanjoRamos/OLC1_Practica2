import {Token} from '../models/Token';

export class TokenController{

    //GLOVAL VARIABLES
    private arrayListToken: Token[] = [];
    private arrayListError: Token[] = [];


    //SINGLETON
    private static instance: TokenController;

    private constructor() { }

    public static getInstance(): TokenController {
        if (!TokenController.instance) {
            TokenController.instance = new TokenController();
        }
        return TokenController.instance;
    }

    //Methods
    InsertToken(row: number, col:number, lexema: string, description:string){
        var tok = new Token(lexema, description, row, col);
        this.arrayListToken.push(tok);
    }
    InsertError(row: number, col:number, lexema: string, description:string){
        var tok = new Token(lexema, description, row, col);
        this.arrayListError.push(tok);
    }

    show(){
        this.arrayListToken.forEach(e => {
            console.log(e.toString());
        });
    }
    showError(){
        this.arrayListError.forEach(e => {
            console.error(e.toString());
        });
    }
    clear(){
        this.arrayListToken = [];
        this.arrayListError = [];
    }        
    
    public get getArrayListToken() : Token[] {
        return this.arrayListToken;
    }
    
    public get getArrayListError() : number {
        return this.arrayListError.length; 
    }

}