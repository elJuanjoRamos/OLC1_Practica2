import { Token } from '../models/Token';
import { TokenPyton } from '../models/TokenPyton';
import { TableController } from '../controller/TableController';
import { typeWithParameters } from '@angular/compiler/src/render3/util';

export class TraductorController {

    private static instance: TraductorController;
    private arrayListToken: Token[] = [];
    private tableController: any;
    private index:number = 0;
    private currentToken:Token = null;
    private esMetodo:boolean = false;
    private esFuncion:boolean = false;
    private esSwitchRepeticion:number = 0;
    private esRepeticion:number = 0;
    //Prueba 
    private traductor: string = "";
    private arrayTraducido: TokenPyton[] = [];
    private htmlElements: string[] = [];
    private jsonElements: TokenPyton[] = [];
    private dataType = ['PR_void','PR_int', 'PR_double', 'PR_char', 'PR_bool', 'PR_string'];
    private strError = "";

    //PARTE DE TABLA DE SIMBOLOS
    //tipo de la variable
    private type: string = "";
    private ambit: string = "Global";
    private typeTemp: string = "";
    //identificador de la variable
    private id: string = "";
    //fila  de la variable
    private row: number = 0;


    constructor(){
        this.tableController = TableController.getInstance();
    }

    public static getInstance(): TraductorController {
        if (!TraductorController.instance) {
            TraductorController.instance = new TraductorController();
        }
        return TraductorController.instance;
    }

    obtenerLista(arrayListToken:Token[])
    {
        this.arrayListToken = arrayListToken;
        this.index = 0;
        this.currentToken = arrayListToken[this.index];
        this.inicio();
    }

    public inicio() {
        this.CommentDeclaration();
        this.Class();
        this.CommentDeclaration();
    }

     //Class Y METODO PRINCIPAL
    public Class() {
        if(this.currentToken.getDescription() == "PR_public") {
            this.Parea("PR_public");
            this.Parea("PR_class");
            this.ambit = "Global";
            this.traductor = "class " + this.currentToken.getLexema() + ":";
            this.InsertTraduction(this.traductor, "cadena");
            this.InsertTraduction("{", "TK_LlaveIzquierda");
            this.Parea("Identificador");
            this.Parea("TK_LlaveIzquierda");
            this.CommentDeclaration();
            this.GlobalDecalration();
            this.CommentDeclaration();
            this.Parea("TK_LlaveDerecha");
            this.InsertTraduction("}", "TK_LlaveDerecha");
            
        } else {
            this.Parea("PR_class");
            this.traductor = "class " + this.currentToken.getLexema() + ":";
            this.InsertTraduction(this.traductor, "cadena");
            this.InsertTraduction("{", "TK_LlaveIzquierda");
            this.Parea("Identificador");
            this.Parea("TK_LlaveIzquierda");
            this.CommentDeclaration();
            this.GlobalDecalration();
            this.CommentDeclaration();
            this.Parea("TK_LlaveDerecha");
            this.InsertTraduction("}", "TK_LlaveDerecha");
        }
    }

    public GlobalDecalration() {
        this.CommentDeclaration();
        this.declaration();
        this.CommentDeclaration();
        this.otraGlobalDecalration();
        this.CommentDeclaration();
    }

    public declaration(){
        if(this.currentToken.getDescription()!=null) {
            if(this.currentToken.getDescription() == 'PR_void') {
                this.Parea("PR_void");
                this.type = "Metodo Void";
                this.currentToken = this.arrayListToken[this.index];
                if(this.currentToken.getDescription() == 'PR_main') {
                    this.InsertVariable(this.type, "Main", this.currentToken.getRow(), "Global");
                    this.ambit = "Metodo Main";
                    this.traductor =  this.traductor + "def main ";
                    this.CommentDeclaration();
                    this.MainMethod();
                    this.CommentDeclaration();
                } else if(this.currentToken.getDescription() == 'Identificador') {
                    this.id = this.currentToken.getLexema();
                    this.row = this.currentToken.getRow();
                    this.InsertVariable(this.type, this.id, this.row, "Global");
                    this.ambit = "Metodo "+this.currentToken.getLexema() ;
                    this.VoidMethod();
                }
            } else if(this.dataType.includes(this.currentToken.getDescription())) { 
                this.CommentDeclaration();
                this.TypeDeclaration();
                this.CommentDeclaration();
            }
        }
    }

    public TypeDeclaration() {


        if(this.dataType.includes(this.currentToken.getDescription())) {
            this.type = this.currentToken.getLexema();
            this.typeTemp = this.currentToken.getLexema();
            this.Parea(this.currentToken.getDescription());
            //traduce el identificicador
            this.traductor = this.traductor + this.currentToken.getLexema();
            this.id = this.currentToken.getLexema();
            this.row = this.currentToken.getRow();
            this.Parea("Identificador");
            this.GlobalVariableAsignate();
            this.currentToken = this.arrayListToken[this.index];
            //ES FUNCION
            if(this.currentToken.getDescription() == "TK_Parentesis_Izq") {
                this.esFuncion = true;
                this.InsertVariable("Funcion " + this.type, this.id, this.row, this.ambit);
                this.ambit = "Funcion " + this.traductor;
                this.traductor = "def " + this.traductor + "(";
                this.Parea("TK_Parentesis_Izq");
                this.declarationParameters();
                this.traductor = this.traductor+ "):";
                this.InsertTraduction(this.traductor, "cadena");
                this.InsertTraduction("{", "TK_LlaveIzquierda");
                this.Parea("TK_Parentesis_Der");
                this.Parea("TK_LlaveIzquierda");
                this.CommentDeclaration();
                this.DeclarationList();
                this.CommentDeclaration();
                this.InsertTraduction("}", "TK_LlaveDerecha");
                this.Parea("TK_LlaveDerecha");
                this.ambit = "Global";
                this.esFuncion = false;
            } else if(this.currentToken.getDescription() == "TK_Coma") {
                this.traductor = "var " + this.traductor;
                this.InsertVariable(this.type, this.id, this.row, this.ambit);   
                this.type = this.typeTemp;
                this.listaAsignacionGlobal();
                this.Parea("TK_PuntoComa");
            } else if(this.currentToken.getDescription() == "TK_PuntoComa") {
                this.traductor = "var " + this.traductor; 
                this.Parea("TK_PuntoComa");
                this.InsertTraduction(this.traductor, "cadena");
                this.InsertVariable(this.type, this.id, this.row, this.ambit);   
            }
        
    }
}

    public listaAsignacionGlobal() {
        this.moreGlobalElements();
    }

    public AsignationGlobalList2() {
        this.traductor = this.traductor + this.currentToken.getLexema();
        this.id = this.currentToken.getLexema();
        this.row = this.currentToken.getRow();
        this.InsertVariable(this.type, this.id, this.row, this.ambit); 
        this.type = this.typeTemp;
        this.Parea("Identificador");
        this.GlobalVariableAsignate();
        this.moreGlobalElements();
    }

    public moreGlobalElements() {
        if(this.currentToken.getDescription() == "TK_Coma") {
            this.traductor = this.traductor + ",";
            this.Parea("TK_Coma");
            this.AsignationGlobalList2();
        } else {
            //EPSILON
        }
    }

    public GlobalVariableAsignate() {

        if(this.currentToken.getDescription() == "TK_Igual") {
            this.Parea("TK_Igual");
            this.traductor = this.traductor + "=";
            this.expresion();
        } else {
            //EPSILON
        }
    }

    public valorVariableGlobal() {
        if(this.currentToken.getDescription() == "Digito") {
            this.Parea("Digito");
        } else if(this.currentToken.getDescription() == "Cadena") {
            this.Parea("Cadena");
        //FALTA CARACTER
        } else if(this.currentToken.getDescription() == "Caracter") {
            this.Parea("Caracter");
        } else if(this.currentToken.getDescription() == "PR_true") {
            this.Parea("PR_true");
        } else if(this.currentToken.getDescription() == "PR_false") {
            this.Parea("PR_false");
        } else if(this.currentToken.getDescription() == "Identificador") {
            this.Parea("Identificador");
            this.valorMetodoGlobal();
        }
    }

    public valorMetodoGlobal() {
        if(this.currentToken.getDescription() == "TK_Parentesis_Izq") {
            this.Parea("TK_Parentesis_Izq");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.getDescription() == "TK_Parentesis_Der") {
                this.Parea("TK_Parentesis_Der");
            } else {
                //LISTADO DE ASIGNACIONES
                this.ParametersListAsignacion();
                this.Parea("TK_Parentesis_Der");
            }
            
        } else {
            //EPSILON
        }
    }

    public otraGlobalDecalration(){
        if(this.currentToken.getDescription()!=null) {
            if(this.currentToken.getDescription() == 'PR_void') {
                this.declaration();
                this.otraGlobalDecalration();
            }else if(this.dataType.includes(this.currentToken.getDescription())) {
                this.type = this.currentToken.getLexema();
                this.declaration();
                this.otraGlobalDecalration();
            }
        }
    }

    public MainMethod() {
        this.esMetodo = true;
        this.Parea("PR_main");
        this.Parea("TK_Parentesis_Izq");
        this.InsertTraduction(this.traductor+ "():", "cadena");
        this.InsertTraduction("{", "TK_LlaveIzquierda");
        this.MainParameters();
        this.Parea("TK_Parentesis_Der");
        this.Parea("TK_LlaveIzquierda");
        this.CommentDeclaration();
        this.DeclarationList();
        this.CommentDeclaration();
        this.Parea("TK_LlaveDerecha");
        this.InsertTraduction("}", "TK_LlaveDerecha");
        this.ambit = "Global";
        this.traductor = this.traductor + "if __name__ = \"__main__\": \n\t\tmain()";
        this.InsertTraduction(this.traductor, "cadena");
        this.esMetodo = false;
    }

    public VoidMethod() {
        this.esMetodo = true;
        this.traductor = "def " + this.traductor + this.currentToken.getLexema() + "(";
        this.Parea("Identificador");
        this.Parea("TK_Parentesis_Izq");
        this.declarationParameters();
        this.traductor = this.traductor  + "):";
        this.InsertTraduction(this.traductor, "cadena");
        this.InsertTraduction("{", "TK_LlaveIzquierda");

        this.Parea("TK_Parentesis_Der");
        this.Parea("TK_LlaveIzquierda");
        this.CommentDeclaration();
        this.DeclarationList();
        this.CommentDeclaration();
        this.Parea("TK_LlaveDerecha");
        this.ambit = "Global";
        this.InsertTraduction("}", "TK_LlaveDerecha");
        this.esMetodo = false;
    }

    public MainParameters() {
        if (this.currentToken.getDescription() == "PR_string")
        {
            this.Parea("PR_string");
            this.Parea("TK_Corchete_Izq");
            this.Parea("TK_Corchete_Der");
            this.Parea("Identificador");
        } else {
            //EPSILON
        }
    }
    //declaration PARAMETROS
    public declarationParameters(){
        if(this.dataType.includes(this.currentToken.getDescription())) {
            this.type = this.currentToken.getLexema();
            this.tipoVariable();
            this.ParametersList();
        } else {
            //EPSILON
        }
    }

    public ParametersList() {
        this.traductor = this.traductor + this.currentToken.getLexema();
        this.InsertVariable(this.type, this.currentToken.getLexema(), this.currentToken.getRow(), this.ambit); 
        this.Parea("Identificador");
        this.masParametros();
    }

    public masParametros() {
        if(this.currentToken.getDescription() == "TK_Coma") {
            this.traductor = this.traductor + ",";
            this.Parea("TK_Coma");
            this.tipoVariable();
            this.ParametersList();
        } else {
            //EPSILON
        }
    }


//#region TRADUCIDOS
    //declaration COMENTARIO
    public CommentDeclaration() {
        this.comentario();
        this.otherComment();
    }
    comentario() {
        if(this.currentToken!=null) {
            if (this.currentToken.getDescription() == ("ComentarioLinea"))
            {
                
                this.traductor = this.traductor + this.currentToken.getLexema().replace("//", "#");
                this.InsertTraduction(this.traductor, "cadena");
                this.Parea("ComentarioLinea");
            } else if (this.currentToken.getDescription() == ("ComentarioMultilinea"))
            {
                this.traductor = this.traductor + this.currentToken.getLexema().replace("/*", "'''") ;
                this.traductor = this.traductor.replace("*/", "'''");
                this.InsertTraduction(this.traductor, "cadena");
                this.Parea("ComentarioMultilinea");
            }
            else
            {
                //EPSILON
            }
        }
    }
    public otherComment() {
        if(this.currentToken!=null) {
            if (this.currentToken.getDescription() == ("ComentarioLinea")
            || this.currentToken.getDescription() == ("ComentarioMultilinea"))
            {
                this.comentario();
                this.otherComment();
            } else {
                //EPSILON
            }
        }
    }

//#endregion    
    

    //LISTA declaration
    public DeclarationList() {
        if(this.currentToken != null) {
            if(this.dataType.includes(this.currentToken.getDescription())) {
                this.declarationVariable();
            } else if (this.currentToken.getDescription() == ("ComentarioLinea")
            || this.currentToken.getDescription() == ("ComentarioMultilinea"))
            {
                this.CommentDeclaration();
            } else if (this.currentToken.getDescription() == ("PR_if"))
            {
                this.declarationIf();
            } else if (this.currentToken.getDescription() == ("PR_for"))
            {
                this.declarationFor();
            } else if (this.currentToken.getDescription() == ("PR_while"))
            {
                this.declarationWhile();
            } else if (this.currentToken.getDescription() == ("PR_switch"))
            {
                this.declarationSwitch();
            } else if (this.currentToken.getDescription() == ("PR_do"))
            {
                this.declarationDoWhile();
            } else if (this.currentToken.getDescription() == ("PR_console"))
            {
                this.declarationConsole();
            } else if (this.currentToken.getDescription() == ("Identificador"))
            {
                this.NoTypeDeclaration();
            } else if (this.currentToken.getDescription() == ("PR_return"))
            {
                this.declarationRetorno();
            } else if (this.currentToken.getDescription() == ("PR_break"))
            {
                this.break();
            } else if (this.currentToken.getDescription() == ("PR_continue"))
            {
                this.continue();
            } else {
                //EPSILON
            }
        }
    }
    public declarationRetorno() {
        if(this.esMetodo == true) {
            this.traductor = this.traductor + "return";
            this.Parea("PR_return");
            //TIPO DE RETORNO
            this.Parea("TK_PuntoComa");
        } else if(this.esFuncion == true) {
            this.traductor = this.traductor + "return ";
            this.Parea("PR_return");
            //TIPO DE RETORNO
            this.condicionesReturn();
            this.InsertTraduction(this.traductor, "cadena");
            this.Parea("TK_PuntoComa");
        }
        this.DeclarationList();
    }


    //declaration CONSOLA
    public declarationConsole() {
        this.traductor = this.traductor + "print(";
        this.Parea("PR_console");
        this.Parea("TK_Punto");
        this.Parea(this.currentToken.getDescription());
        this.Parea("TK_Parentesis_Izq");
        this.expresion();
        this.traductor = this.traductor + ")";
        this.Parea("TK_Parentesis_Der");
        this.Parea("TK_PuntoComa");
        this.InsertTraduction(this.traductor, "cadena");
        this.DeclarationList();
    }



    //#region  VARIABLE
    //declaration VARIABLE
    public declarationVariable() {
        this.CommentDeclaration();
        this.asignacion();
        this.CommentDeclaration();
        this.otraAsignacion();
        this.CommentDeclaration();
        this.DeclarationList();
    }
    public asignacion() {
        this.tipoVariable();
        this.listaAsignacion();
        this.asignacionVariable();
        this.Parea("TK_PuntoComa");
        this.InsertTraduction(this.traductor, "cadena");
        //this.InsertVariable(this.type, this.id, this.row, this.ambit);
    }

    public otraAsignacion() {
        if(this.currentToken != null) {
            if(this.dataType.includes(this.currentToken.getDescription())) {
                this.CommentDeclaration();
                this.asignacion();
                this.CommentDeclaration();
                this.otraAsignacion();
                this.CommentDeclaration();
                this.DeclarationList();
            }
        } else {
            //EPSILON
        }
    }

    public tipoVariable() {
        this.traductor = this.traductor+ "var ";
        if(this.currentToken.getDescription() == "PR_int") {
            this.Parea("PR_int");
            this.type = "int";
            this.typeTemp = "int";
        } else if(this.currentToken.getDescription() == "PR_double") {
            this.Parea("PR_double");
            this.type = "double";
            this.typeTemp = "double";
        } else if(this.currentToken.getDescription() == "PR_char") {
            this.Parea("PR_char");
            this.type = "char";
            this.typeTemp = "char";
        } else if(this.currentToken.getDescription() == "PR_bool") {
            this.Parea("PR_bool");
            this.type = "bool";
            this.typeTemp = "bool";
        } else if(this.currentToken.getDescription() == "PR_string") {
            this.Parea("PR_string");
            this.type = "string";
            this.typeTemp = "string"
        }
    }

    public listaAsignacion() {
        this.traductor = this.traductor + this.currentToken.getLexema();
        this.id = this.currentToken.getLexema();
        this.row = this.currentToken.getRow();
        this.Parea("Identificador");
        this.InsertVariable(this.type, this.id, this.row, this.ambit);
        this.type = this.typeTemp;
        if(this.currentToken.getDescription() == "TK_Igual") {
            this.Parea("TK_Igual");
            this.traductor = this.traductor + "=";
            this.expresion();
        } else {
            //EPSILON
        }
        this.masElementos();
    }


    public masElementos() {
        if(this.currentToken.getDescription() == "TK_Coma") {
            this.traductor = this.traductor + ",";
            this.Parea("TK_Coma");
            this.listaAsignacion();
        } else {
            this.InsertTraduction(this.traductor, "cadena");
            //EPSILON
        }
    }

    public asignacionVariable() {
        if(this.currentToken.getDescription() == "TK_Igual") {
            this.traductor = this.traductor + "= ";
            this.Parea("TK_Igual");
            this.expresion();
        } else {
            //EPSILON
        }
    }

    //#endregion


    


    
    //declaration IF ELSEIF ELSE
    public declarationIf() {
        this.traductor = this.traductor + "if ";
        this.Parea("PR_if");
        this.Parea("TK_Parentesis_Izq");
        this.condiciones();
        this.Parea("TK_Parentesis_Der");
        this.Parea("TK_LlaveIzquierda");

        this.InsertTraduction(this.traductor + ":", "cadena");
        this.InsertTraduction("{", "TK_LlaveIzquierda");
        this.CommentDeclaration();
        this.DeclarationList();
        this.CommentDeclaration();
        this.Parea("TK_LlaveDerecha");
        this.InsertTraduction("}", "TK_LlaveDerecha");
        this.CommentDeclaration();
        this.else();
        this.CommentDeclaration();
        this.DeclarationList();
        this.CommentDeclaration();
    }

    //CONDICION IF
    public condicion() {
        this.tipoCondicion();
        this.operacionRelacional();
        this.tipoCondicion();
    }

    public condicionFor(){
        this.Parea(this.currentToken.getDescription());
        this.operacionRelacionalFor();
        this.traductor = this.traductor + this.currentToken.getLexema();
        this.Parea(this.currentToken.getDescription());
    }

    public tipoCondicion() {
        this.traductor = this.traductor + this.currentToken.getLexema();
        if(this.currentToken.getDescription() == 'Identificador') {
            this.Parea("Identificador");
        } else if(this.currentToken.getDescription() == 'Cadena') {
            this.Parea("Cadena");
        } else if(this.currentToken.getDescription() == 'Digito') {
            this.Parea("Digito");
        } else if(this.currentToken.getDescription() == 'Cadena') {
            this.Parea("Cadena");
        } else if(this.currentToken.getDescription() == 'PR_null') {
            this.Parea("PR_null");
        } else if(this.currentToken.getDescription() == 'PR_true') {
            this.Parea("PR_true");
        } else if(this.currentToken.getDescription() == 'PR_false') {
            this.Parea("PR_false");
        } else if(this.currentToken.getDescription() == 'Decimal') {
            this.Parea("Decimal");
        }
    }

    public else() {
        if(this.currentToken.getDescription() == 'PR_else') {
            this.Parea("PR_else");
            this.tipoElse();
        } else {
            //EPSILON
        }
    }
    /* PRUEBA*/
    public tipoElse() {
        if(this.currentToken.getDescription() == 'PR_if') {
            this.traductor = this.traductor + "elif ";
            
            this.CommentDeclaration();
            this.declarationElseIf();
            this.CommentDeclaration();
            this.InsertTraduction("}", "TK_LlaveDerecha"); 
        } else if(this.currentToken.getDescription() == 'TK_LlaveIzquierda') {
            this.traductor = this.traductor + "else: "; 
            this.CommentDeclaration();
            this.declarationElse();
            this.CommentDeclaration();
            this.InsertTraduction("}", "TK_LlaveDerecha");

        }
    }

    public declarationElseIf() {
        this.CommentDeclaration();
        this.elseIf();
        this.CommentDeclaration();
        this.otroElseIf();
        this.CommentDeclaration();
    }

    public elseIf() {
        if(this.currentToken.getDescription() == 'PR_if') {
            this.Parea("PR_if");
            this.Parea("TK_Parentesis_Izq");
            this.condicion();
            this.Parea("TK_Parentesis_Der");
            this.Parea("TK_LlaveIzquierda");
            this.InsertTraduction(this.traductor, "cadena");
            this.InsertTraduction("{", "TK_LlaveIzquierda");
            this.CommentDeclaration();
            this.DeclarationList();
            this.CommentDeclaration();
            this.Parea("TK_LlaveDerecha");
        } else {
            //EPSILON
        }
    }

    public otroElseIf() {
        if(this.currentToken.getDescription() == 'PR_else') {
            this.CommentDeclaration();
            this.else()
            this.CommentDeclaration();
            this.elseIf();
            this.CommentDeclaration();
            this.otroElseIf();
            this.CommentDeclaration();
        } else {
            //EPSILON
        }
    }

    public declarationElse() {
        this.Parea("TK_LlaveIzquierda");
        this.CommentDeclaration();
        this.InsertTraduction(this.traductor + ":", "cadena");
        this.InsertTraduction("{", "TK_LlaveIzquierda");
        this.DeclarationList();
        this.CommentDeclaration();
        this.Parea("TK_LlaveDerecha");
    }

    public declarationFor() {
        this.esSwitchRepeticion++;
        this.esRepeticion++;
        this.Parea("PR_for");
        this.Parea("TK_Parentesis_Izq");
        //INICIALIZACION
        this.Parea("PR_int");
        this.traductor = this.traductor + "for " + this.currentToken.getLexema() + " in range(";
        this.Parea("Identificador");
        this.Parea("TK_Igual");
        this.traductor = this.traductor + this.currentToken.getLexema() + ", ";
        this.Parea("Digito");
        this.Parea("TK_PuntoComa");
        //CONDICION
        this.condicionFor();
        this.Parea("TK_PuntoComa");
        //INCREMENTO
        this.Parea("Identificador");
        if(this.currentToken.getDescription() == 'TK_Suma') {
            this.Parea("TK_Suma");
            this.Parea("TK_Suma");
            this.traductor = this.traductor + "):";
        } else if(this.currentToken.getDescription() == 'TK_Resta') {
            this.Parea("TK_Resta");
            this.Parea("TK_Resta");
            this.traductor = this.traductor + ", -1):";
        }
        this.InsertTraduction(this.traductor, "cadena");
        this.InsertTraduction("{", "TK_LlaveIzquierda");
        this.Parea("TK_Parentesis_Der");
        this.Parea("TK_LlaveIzquierda");
        this.CommentDeclaration();
        this.DeclarationList();
        this.CommentDeclaration();
        this.Parea("TK_LlaveDerecha");
        this.InsertTraduction("}", "TK_LlaveDerecha");
        this.esSwitchRepeticion--;
        this.esRepeticion--;
        this.CommentDeclaration();
        this.DeclarationList();
        this.CommentDeclaration();
    }

    public declarationWhile() {
        this.esSwitchRepeticion++;
        this.esRepeticion++;
        this.traductor = this.traductor + "while ";
        this.Parea("PR_while");
        this.Parea("TK_Parentesis_Izq");
        //CONDICION
        this.condiciones();
        this.Parea("TK_Parentesis_Der");
        this.Parea("TK_LlaveIzquierda");
        this.traductor = this.traductor + ":";
        this.InsertTraduction(this.traductor, "cadena");
        this.InsertTraduction("{", "TK_LlaveIzquierda");

        this.CommentDeclaration();
        this.DeclarationList();
        this.CommentDeclaration();
        this.InsertTraduction("}", "TK_LlaveDerecha");
        this.Parea("TK_LlaveDerecha");
        this.esSwitchRepeticion--;
        this.esRepeticion--;
        this.CommentDeclaration();
        this.DeclarationList();
        this.CommentDeclaration();
    }

    public declarationSwitch() {
        this.esSwitchRepeticion++;
        this.Parea("PR_switch");
        this.Parea("TK_Parentesis_Izq");
        this.traductor = this.traductor + "def switch(case,"+this.currentToken.getLexema() + "):";
        this.InsertTraduction(this.traductor, "cadena");
        this.InsertTraduction("{", "TK_LlaveIzquierda");
        this.InsertTraduction("switcher = {", "cadena");

        this.InsertTraduction("{", "TK_LlaveIzquierda");

        this.Parea("Identificador");
        this.Parea("TK_Parentesis_Der");
        this.Parea("TK_LlaveIzquierda");
        this.CommentDeclaration();
        this.cuerpoSwitch();
        this.CommentDeclaration();
        this.default();
        this.traductor = this.traductor + "}";
        this.InsertTraduction(this.traductor, "cadena");
        this.InsertTraduction("}", "TK_LlaveDerecha");
        
        this.CommentDeclaration();
        this.Parea("TK_LlaveDerecha");
        this.esSwitchRepeticion--;
        this.CommentDeclaration();
        this.DeclarationList();
        this.CommentDeclaration();
    }

    public cuerpoSwitch() {
        this.CommentDeclaration();
        this.case();
        this.CommentDeclaration();
        this.otroCase();
        this.CommentDeclaration();
    }

    public case() {
        if(this.currentToken != null) {
            if(this.currentToken.getDescription() == 'PR_case') {
                this.Parea("PR_case");
                this.tipoCase();
                this.InsertTraduction(this.traductor + ":", "cadena");
                this.InsertTraduction("{", "TK_LlaveIzquierda");
                this.Parea("TK_DosPuntos");
                this.CommentDeclaration();
                this.DeclarationList();
                this.CommentDeclaration();
                this.InsertTraduction("}", "TK_LlaveDerecha");
            } else {
                //EPSILON
            }
        }
    }

    public tipoCase() {
        this.traductor = this.traductor + this.currentToken.getLexema();
        if(this.currentToken.getDescription() == 'Identificador') {
            this.Parea("Identificador");
        } else if(this.currentToken.getDescription() == 'Cadena') {
            this.Parea("Cadena");
        } else if(this.currentToken.getDescription() == 'Digito') {
            this.Parea("Digito");
        } else if(this.currentToken.getDescription() == 'Cadena') {
            this.Parea("Cadena");
        } else if(this.currentToken.getDescription() == 'PR_null') {
            this.Parea("PR_null");
        }
    }

    public otroCase() {
        if(this.currentToken != null) {
            if(this.currentToken.getDescription() == 'PR_case') {
                this.traductor = this.traductor + ",";
                this.CommentDeclaration();
                this.case();
                this.CommentDeclaration();
                this.otroCase();
                this.CommentDeclaration();
            } else {
                //EPSILON
            }
        }
    }

    public break() {
        if(this.esSwitchRepeticion != 0) {
            if(this.currentToken.getDescription() != null) {
                this.Parea("PR_break");
                this.traductor = this.traductor + "break";
                this.InsertTraduction(this.traductor, "cadena");
                this.Parea("TK_PuntoComa");
                this.DeclarationList();
            }
        }
    }

    public continue() {
        if(this.esRepeticion != 0) {
            if(this.currentToken.getDescription() != null) {
                this.Parea("PR_continue");
                this.traductor = this.traductor + "continue";
                this.InsertTraduction(this.traductor, "cadena");

                this.Parea("TK_PuntoComa");
                this.DeclarationList();
            }
        }
    }

    public default() {
        if(this.currentToken != null) {
            if(this.currentToken.getDescription() == 'PR_default') {
                this.traductor = this.traductor + ",default";
                this.InsertTraduction(this.traductor + ":", "cadena");
                this.InsertTraduction("{", "TK_LlaveIzquierda");
                this.Parea("PR_default");
                this.Parea("TK_DosPuntos");
                this.CommentDeclaration();
                this.DeclarationList();
                this.CommentDeclaration();
                this.InsertTraduction("}", "TK_LlaveDerecha");
            } else {
                //EPSILON
            }
        }
    }


    public valorVariable() {
        if(this.currentToken.getDescription() == "Digito") {
            this.Parea("Digito");
        } else if(this.currentToken.getDescription() == "Cadena") {
            this.Parea("Cadena");
        //FALTA CARACTER
        } else if(this.currentToken.getDescription() == "Caracter") {
            this.Parea("Caracter");
        } else if(this.currentToken.getDescription() == "PR_true") {
            this.Parea("PR_true");
        } else if(this.currentToken.getDescription() == "PR_false") {
            this.Parea("PR_false");
        } else if(this.currentToken.getDescription() == "Identificador") {
            this.Parea("Identificador");
        }
    }

    public operacionRelacional() {
        if(this.currentToken.getDescription() == "TK_Menor") {
            this.Parea("TK_Menor");
            this.traductor = this.traductor + "<";
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.getDescription() == "TK_Igual") {
                this.traductor = this.traductor + "=";
                this.Parea("TK_Igual");
            } else {
                //EPSILON
            }
        } else if(this.currentToken.getDescription() == "TK_Mayor") {
            this.Parea("TK_Mayor");
            this.traductor = this.traductor + ">";
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.getDescription() == "TK_Igual") {
                this.traductor = this.traductor + "=";
                this.Parea("TK_Igual");
            } else {
                //EPSILON
            }
        } if(this.currentToken.getDescription() == "TK_Igual") {
            this.Parea("TK_Igual");
            this.Parea("TK_Igual");
            this.traductor = this.traductor + "==";
        } if(this.currentToken.getDescription() == "TK_Exclamacion") {
            this.Parea("TK_Exclamacion");
            this.Parea("TK_Igual");
            this.traductor = this.traductor + "!=";
        } 
    }
    public operacionRelacionalFor() {
        if(this.currentToken.getDescription() == "TK_Menor") {
            this.Parea("TK_Menor");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.getDescription() == "TK_Igual") {
                this.Parea("TK_Igual");
            } else {
                //EPSILON
            }
        } else if(this.currentToken.getDescription() == "TK_Mayor") {
            this.Parea("TK_Mayor");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.getDescription() == "TK_Igual") {
                this.Parea("TK_Igual");
            } else {
                //EPSILON
            }
        } 
    }
    public operacionLogicoAndOr() {
        if(this.currentToken.getDescription() == "TK_Pleca") {
            this.Parea("TK_Pleca");
            this.Parea("TK_Pleca");
        } else if(this.currentToken.getDescription() == "TK_&") {
            this.Parea("TK_&");
            this.Parea("TK_&");
        }
    }

    public operacionLogicoNot() {
        if(this.currentToken.getDescription() == "TK_Exclamacion") {
            this.Parea("TK_Exclamacion");
        }
    }

    public declarationDoWhile() {
        this.esSwitchRepeticion++;
        this.esRepeticion++;
        this.Parea("PR_do");
        this.traductor = this.traductor + "while True:"
        this.InsertTraduction(this.traductor, "cadena");
        this.InsertTraduction("{", "TK_LlaveIzquierda");
        this.Parea("TK_LlaveIzquierda");
        this.CommentDeclaration();
        this.DeclarationList();
        this.CommentDeclaration();
        this.Parea("TK_LlaveDerecha");
        this.Parea("PR_while");
        this.Parea("TK_Parentesis_Izq");
        //CONDICION
        this.traductor = this.traductor + "if (";
        this.condiciones();
        this.traductor = this.traductor + "):";
        this.InsertTraduction(this.traductor, "cadena");
        this.InsertTraduction("{", "TK_LlaveIzquierda");
        this.InsertTraduction("break", "cadena");
        this.InsertTraduction("}", "TK_LlaveDerecha");
        this.InsertTraduction("}", "TK_LlaveDerecha");
        this.Parea("TK_Parentesis_Der");
        this.Parea("TK_PuntoComa");
        this.esSwitchRepeticion--;
        this.esRepeticion--;
        this.CommentDeclaration();
        this.DeclarationList();
        this.CommentDeclaration();
    }

    //declaration SIN TIPO
    public NoTypeDeclaration() {
        this.traductor = this.traductor + this.currentToken.getLexema();
        this.id = this.currentToken.getLexema();
        this.Parea("Identificador");
        this.Parea("TK_Igual");
        this.traductor = this.traductor + "=";
        this.expresion();
        this.Parea("TK_PuntoComa");
        if(this.tableController.searchVariable(this.id, this.ambit) == false){
            this.strError = this.strError + "\n" + "*Error Sintactico: La variable '" + this.id + "' no ha sido declarada, Linea: "  + this.row; 
        } 
        this.InsertTraduction(this.traductor, "cadena");
        this.CommentDeclaration();
        this.DeclarationList();
        this.CommentDeclaration();
    }

    //EXPRESION
    public expresion() {
        this.termino();
        this.expresionPrima();
    }

    public termino() {
        this.factor();
        this.terminoPrima();
    }

    public expresionPrima() {
        if (this.currentToken.lexema == "+")
        {
            this.traductor = this.traductor + "+";
            this.Parea(this.currentToken.getDescription());
            this.evaluarSiguiente(this.currentToken.getDescription());
        }
        else if (this.currentToken.lexema == "-")
        {
            this.traductor = this.traductor + "-";
            this.Parea(this.currentToken.getDescription());
            this.evaluarSiguiente(this.currentToken.getDescription());
        }
        else if (this.currentToken.lexema == "|")
        {
            this.Parea(this.currentToken.getDescription());
            this.Parea(this.currentToken.getDescription());
            this.evaluarSiguiente(this.currentToken.getDescription());
        }else if (this.currentToken.lexema == "&")
        {
            this.Parea(this.currentToken.getDescription());
            this.Parea(this.currentToken.getDescription());
            this.evaluarSiguiente(this.currentToken.getDescription());
        } else
        if(this.currentToken.getDescription() == "TK_Menor") {
            this.Parea("TK_Menor");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.getDescription() == "TK_Igual") {
                this.Parea("TK_Igual");
                this.evaluarSiguiente(this.currentToken.getDescription());
            } else {
                //EPSILON
                this.evaluarSiguiente(this.currentToken.getDescription());
            }
        } else if(this.currentToken.getDescription() == "TK_Mayor") {
            this.Parea("TK_Mayor");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.getDescription() == "TK_Igual") {
                this.Parea("TK_Igual");
                this.evaluarSiguiente(this.currentToken.getDescription());
            } else {
                //EPSILON
                this.evaluarSiguiente(this.currentToken.getDescription());
            }
        } else if(this.currentToken.getDescription() == "TK_Igual") {
            this.Parea("TK_Igual");
            this.Parea("TK_Igual");
            this.evaluarSiguiente(this.currentToken.getDescription());
        } else if(this.currentToken.getDescription() == "TK_Exclamacion") {
            this.Parea("TK_Exclamacion");
            this.Parea("TK_Igual");
            this.evaluarSiguiente(this.currentToken.getDescription());
        }
        else
        {
            //EPSILON
        }
    }

    public evaluarSiguiente(texto:string) {
        if (this.currentToken.lexema != texto)
        {
            //console.error(this.currentToken.lexema)
            this.termino();
            this.expresionPrima();
        } else {
            //console.error(texto)
        }
    }

    public factor() {
        if (this.currentToken.lexema == "(")
        {
            this.Parea(this.currentToken.getDescription());
            this.expresion();
            this.Parea("TK_Parentesis_Der");
        }
        else if (this.currentToken.getDescription() == ("Digito") 
        || this.currentToken.getDescription() == ("Cadena")
        || this.currentToken.getDescription() == ("Decimal")
        || this.currentToken.getDescription() == ("Cadena_HTML")
        || this.currentToken.getDescription() == ("PR_true")
        || this.currentToken.getDescription() == ("Caracter")
        || this.currentToken.getDescription() == ("PR_false"))
        {
            if (this.currentToken.getDescription() == "Cadena_HTML") {
                this.getHtml(this.currentToken.getLexema());
            }
            this.traductor = this.traductor +this.currentToken.getLexema(); 
            this.Parea(this.currentToken.getDescription());
        } else if (this.currentToken.getDescription() == ("Identificador"))
        {
            this.traductor = this.traductor +this.currentToken.getLexema(); 
            this.Parea(this.currentToken.getDescription());
            this.valorMetodoGlobal();
        } else {
            console.error("Error se esperaba Digito o Cadena en lugar de " + this.currentToken.getDescription());
        }
    }

    public terminoPrima() {
        if (this.currentToken.lexema == "*")
        {
            this.traductor = this.traductor + "*"; 
            this.Parea(this.currentToken.getDescription());
            this.evaluarSiguiente(this.currentToken.getDescription());
        }
        else if (this.currentToken.lexema == "/")
        {
            this.traductor = this.traductor + "/";
            this.Parea(this.currentToken.getDescription());
            this.evaluarSiguiente(this.currentToken.getDescription());
        }
        else
        {
            //EPSILON
            //console.error(this.currentToken.lexema)
        }
    }

    public ParametersListAsignacion() {
        this.expresion();
        this.masParametrosAsignacion();
    }

    public masParametrosAsignacion() {
        if(this.currentToken.getDescription() == "TK_Coma") {
            this.Parea("TK_Coma");
            this.ParametersListAsignacion();
        } else {
            //EPSILON
        }
    }


     /*_______________________________________________NUEVAS CONDICIONES____________________________________________ */
     public condiciones() {
        if(this.currentToken.description != "TK_Parentesis_Der") {
            this.expresion2();
            this.masCondiciones();
        }
    }
    public masCondiciones() {
        if(this.currentToken.description == "TK_Pleca") {
            this.Parea("TK_Pleca");
            this.Parea("TK_Pleca");
            this.traductor = this.traductor + "||";
        }if(this.currentToken.description == "TK_&") {
            this.Parea("TK_&");
            this.Parea("TK_&");
            this.traductor = this.traductor + "&&";
        } else {
            //EPSILON
        }
        this.condiciones();
    }

    public expresion2() {
        this.termino2();
        this.expresionPrima2();
    }

    public termino2() {
        this.factor2();
        this.terminoPrima2();
    }
    public expresionPrima2() {
        if (this.currentToken.description != null)
        {
        if (this.currentToken.lexema == "+")
        {
            this.traductor = this.traductor + "+";
            this.Parea(this.currentToken.description);
            this.evaluarSiguiente2(this.currentToken.description);
        }
        else if (this.currentToken.lexema == "-")
        {
            this.traductor = this.traductor + "-";
            this.Parea(this.currentToken.description);
            this.evaluarSiguiente(this.currentToken.description);
        }else if(this.currentToken.description == "TK_Menor") {
            this.traductor = this.traductor + "<";
            this.Parea("TK_Menor");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.description == "TK_Igual") {
                this.Parea("TK_Igual");
                this.traductor = this.traductor + "=";
                this.evaluarSiguiente2(this.currentToken.description);
            } else {
                //EPSILON
                this.evaluarSiguiente2(this.currentToken.description);
            }
        } else if(this.currentToken.description == "TK_Mayor") {
            this.Parea("TK_Mayor");
            this.traductor= this.traductor + ">";
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.description == "TK_Igual") {
                this.Parea("TK_Igual");
                this.traductor= this.traductor + "=";
                this.evaluarSiguiente2(this.currentToken.description);
            } else {
                //EPSILON
                this.evaluarSiguiente2(this.currentToken.description);
            }
        } else if(this.currentToken.description == "TK_Igual") {
            this.Parea("TK_Igual");
            this.Parea("TK_Igual");
            this.traductor = this.traductor + "==";
            this.evaluarSiguiente2(this.currentToken.description);
        } else if(this.currentToken.description == "TK_Exclamacion") {
            this.Parea("TK_Exclamacion");
            this.Parea("TK_Igual");
            this.traductor = this.traductor + "!=";
            this.evaluarSiguiente2(this.currentToken.description);
        }
        else
        {
            //EPSILON
        }   
        }
    }
    
    public evaluarSiguiente2(texto:string) {
        if (this.currentToken.lexema != texto)
        {
            //console.error(this.currentToken.lexema)
            this.termino2();
            this.expresionPrima2();
        } else {
            //console.error(texto)
        }
    }

    public factor2() {
        if(this.currentToken.description!=null) {
            if (this.currentToken.lexema == "(")
            {
                this.Parea(this.currentToken.description);
                this.expresion2();
                this.Parea("TK_Parentesis_Der");
            }
            else if (this.currentToken.description == ("Digito") 
            || this.currentToken.description == ("Cadena")
            || this.currentToken.description == ("Decimal")
            || this.currentToken.description == ("Cadena_HTML")
            || this.currentToken.description == ("Caracter")
            || this.currentToken.description == ("PR_true")
            || this.currentToken.description == ("PR_false"))
            {
                this.traductor = this.traductor + this.currentToken.getLexema();
                this.Parea(this.currentToken.description);
            } else if (this.currentToken.description == ("Identificador"))
            {
                this.traductor = this.traductor + this.currentToken.getLexema();
                this.Parea(this.currentToken.description);
            } else if (this.currentToken.description == ("TK_Exclamacion"))
            {
                this.traductor = this.traductor + "!";
                this.Parea("TK_Exclamacion");
                this.currentToken = this.arrayListToken[this.index];
                if(this.currentToken.description == "Identificador") {
                    this.traductor = this.traductor + this.currentToken.getLexema();
                    this.Parea("Identificador");
                } else if(this.currentToken.description == "PR_true" || this.currentToken.description == "PR_false") {
                    this.traductor = this.traductor + this.currentToken.getLexema();
                    this.Parea(this.currentToken.description);
                }
            } else {
                console.error("Error se esperaba Digito o Cadena en lugar de " + this.currentToken.description);
            }
        }
    }

    public terminoPrima2() {
        if(this.currentToken.description!=null) {
            if (this.currentToken.lexema == "*")
            {
                this.traductor = this.traductor + "*";
                this.Parea(this.currentToken.description);
                this.evaluarSiguiente2(this.currentToken.description);
            }
            else if (this.currentToken.lexema == "/")
            {
                this.traductor = this.traductor + "/";
                this.Parea(this.currentToken.description);
                this.evaluarSiguiente2(this.currentToken.description);
            }
            else
            {
                //EPSILON
                //console.error(this.currentToken.lexema)
            }
        }
    }

     /*_______________________________________________CONDICIONES RETURN____________________________________________ */

     public condicionesReturn() {
        if(this.currentToken.description != "TK_PuntoComa") {
            this.expresion2();
            this.masCondicione3();
        }
    }

    public masCondicione3() {
        if(this.currentToken.description == "TK_Pleca") {
            this.Parea("TK_Pleca");
            this.Parea("TK_Pleca");
            this.traductor = this.traductor + "||";
        }if(this.currentToken.description == "TK_&") {
            this.Parea("TK_&");
            this.Parea("TK_&");
            this.traductor = this.traductor + "&&";
        } else {
            //EPSILON
        }
        this.condicionesReturn();
    }

    public expresion3() {
        this.termino3();
        this.expresionPrima3();
    }

    public termino3() {
        this.factor3();
        this.terminoPrima3();
    }

    public expresionPrima3() {
        if (this.currentToken.description != null)
        {
        if (this.currentToken.lexema == "+")
        {
            this.Parea(this.currentToken.description);
            this.evaluarSiguiente3(this.currentToken.description);
        }
        else if (this.currentToken.lexema == "-")
        {
            this.Parea(this.currentToken.description);
            this.evaluarSiguiente(this.currentToken.description);
        }else if(this.currentToken.description == "TK_Menor") {
            this.Parea("TK_Menor");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.description == "TK_Igual") {
                this.Parea("TK_Igual");
                this.evaluarSiguiente3(this.currentToken.description);
            } else {
                //EPSILON
                this.evaluarSiguiente3(this.currentToken.description);
            }
        } else if(this.currentToken.description == "TK_Mayor") {
            this.Parea("TK_Mayor");
            this.currentToken = this.arrayListToken[this.index];
            if(this.currentToken.description == "TK_Igual") {
                this.Parea("TK_Igual");
                this.evaluarSiguiente3(this.currentToken.description);
            } else {
                //EPSILON
                this.evaluarSiguiente3(this.currentToken.description);
            }
        } else if(this.currentToken.description == "TK_Igual") {
            this.Parea("TK_Igual");
            this.Parea("TK_Igual");
            this.evaluarSiguiente3(this.currentToken.description);
        } else if(this.currentToken.description == "TK_Exclamacion") {
            this.Parea("TK_Exclamacion");
            this.Parea("TK_Igual");
            this.evaluarSiguiente3(this.currentToken.description);
        }
        else
        {
            //EPSILON
        }   
        }
    }

    public evaluarSiguiente3(texto:string) {
        if (this.currentToken.lexema != texto)
        {
            //console.error(this.currentToken.lexema)
            this.termino3();
            this.expresionPrima3();
        } else {
            //console.error(texto)
        }
    }

    public factor3() {
        if(this.currentToken.description!=null) {
            if (this.currentToken.lexema == "(")
            {
                this.Parea(this.currentToken.description);
                this.expresion3();
                this.Parea("TK_Parentesis_Der");
            }
            else if (this.currentToken.description == ("Digito") 
            || this.currentToken.description == ("Cadena")
            || this.currentToken.description == ("Decimal")
            || this.currentToken.description == ("Cadena_HTML")
            || this.currentToken.description == ("Caracter")
            || this.currentToken.description == ("PR_true")
            || this.currentToken.description == ("PR_false"))
            {
                this.Parea(this.currentToken.description);
            } else if (this.currentToken.description == ("Identificador"))
            {
                this.Parea(this.currentToken.description);
            } else if (this.currentToken.description == ("TK_Exclamacion"))
            {
                this.Parea("TK_Exclamacion");
                this.currentToken = this.arrayListToken[this.index];
                if(this.currentToken.description == "Identificador") {
                    this.Parea("Identificador");
                } else if(this.currentToken.description == "PR_true" || this.currentToken.description == "PR_false") {
                    this.Parea(this.currentToken.description);
                }
            } else {
                console.error("Error se esperaba Digito o Cadena en lugar de " + this.currentToken.description);
            }
        }
    }

    public terminoPrima3() {
        if(this.currentToken.description!=null) {
            if (this.currentToken.lexema == "*")
            {
                this.traductor = this.traductor + "*";
                this.Parea(this.currentToken.description);
                this.evaluarSiguiente3(this.currentToken.description);
            }
            else if (this.currentToken.lexema == "/")
            {
                this.traductor = this.traductor + "/";
                this.Parea(this.currentToken.description);
                this.evaluarSiguiente3(this.currentToken.description);
            }
            else
            {
                //EPSILON
                //console.error(this.currentToken.lexema)
            }
        }
    }



    public Parea(token:string)
    {
        if(this.currentToken!=null){
            if (this.currentToken.getDescription()!=token)
            {
                //ERROR SI NO VIENE LO QUE DEBERIA
                console.error("Error se esperaba "+ token + " en lugar de " + this.currentToken.getDescription());
                //RECUPERACION MODO PANICO
                for (let index = this.index; index < this.arrayListToken.length; index++) {
                    console.log(this.currentToken.getDescription())
                    this.currentToken = this.arrayListToken[this.index];
                    if(this.currentToken.getDescription() == "TK_PuntoComa" 
                    || this.currentToken.getDescription() == "TK_LlaveDerecha"
                    || this.currentToken.getDescription() == "TK_LlaveIzquierda"
                    || this.currentToken.getDescription() == "PR_void"
                    || this.currentToken.getDescription() == "PR_int"
                    || this.currentToken.getDescription() == "PR_string"
                    || this.currentToken.getDescription() == "PR_double"
                    || this.currentToken.getDescription() == "PR_char"
                    || this.currentToken.getDescription() == "PR_bool") {
                        this.currentToken = this.arrayListToken[this.index];
                        break;
                    }
                    this.index += 1;
                }
            }
            //FLUJO CORRECTO
            if (this.currentToken.getDescription()==token)
            {
                console.log(this.currentToken.toString())
                this.index += 1;
                this.currentToken = this.arrayListToken[this.index];
            }
        }
    }


    public InsertVariable(type: string, id: string, row: number, ambit: string){
        if(this.tableController.searchVariable(id, ambit) == false){
            this.tableController.InsertToken(id, type, ambit, row);
        } else {
            this.strError = this.strError + "\n" + "*Error Sintactico: La variable '" + id + "' ya fue declarada, Linea: " + row;
        }
        this.row = 0;
        this.id = this.type = "";
    }

    /* OBTIENE LA CADENA HTML A TRADUCIR*/
    public getHtml( str:string ){
        str = str.replace("'", " ").trim();
        var newElement: string = "";

        for (let i = 0; i < str.length; i++) {
            const element = str[i];

            if(element == "<"){
                if(newElement != ""){
                    this.htmlElements.push(newElement.trim());
                }  
                newElement = "";
                newElement += element; 
                
                for (let j = i+1; j < str.length; j++) {
                    const e = str[j];
                    newElement += e;
                    if( e == ">"){
                        if( newElement.includes("</") ){
                            this.htmlElements.push("}");
                            this.htmlElements.push(newElement.trim());
                        } else {
                              
                            this.htmlElements.push(newElement.trim());
                            if (!newElement.includes("br") && !newElement.includes("hr")) {   
                                this.htmlElements.push("{");
                            }
                        }
                        i  = j;  
                        newElement = "";
                        break;
                    }  
                }
            } else {
                newElement += element; 
            }   
        }
        this.htmlElements.forEach(e => {
            if(!(e.includes("</"))){
                if( e.includes("<") && e.includes(">")){
                   if (e.toLocaleLowerCase().includes("style")) {
                    var splited = e.toLowerCase().split("style=");     
                    this.jsonElements.push( new TokenPyton( '"' + splited[0].replace('<', "").replace(">", "").toLocaleUpperCase() + '"' + ":{", "cadena") );
                    this.jsonElements.push( new TokenPyton("{", "TK_LlaveIzquierda") );         
                    this.jsonElements.push( new TokenPyton( '"' + "STYLE" + '":' + splited[1].replace('<', "").replace(">", ""), "cadena") );
                    
                    } else {
                            e = e.replace("<", '"').replace(">", '"');    
                            if (e.includes("hr") || e.includes("br") ) {
                                this.jsonElements.push( new TokenPyton(e.toLocaleUpperCase(), "cadena") );   
                            } else {
                                this.jsonElements.push( new TokenPyton(e.toLocaleUpperCase() + ":{", "cadena") );
                                this.jsonElements.push( new TokenPyton("{", "TK_LlaveIzquierda") );    
                            }
                        }
                } else {
                    if((e != "}") && (e != "{")){
                        this.jsonElements.push( new TokenPyton("\"TEXTO\": "+ '"' +e + '"', "cadena") );
                    }
                }
            } else {
                this.jsonElements.push( new TokenPyton("}", "cadena") );
                this.jsonElements.push( new TokenPyton("}", "TK_LlaveDerecha") );
            }
        });
       
    }
    /*INSERTA ELEMENTOS EN EL ARREGLO DE TRADUCCION*/
    public InsertTraduction( lexema: string, description: string ){
        if (lexema != "") {
            this.arrayTraducido.push( new TokenPyton(lexema, description) );
        }  
        this.traductor = "";
    }
    /* LIMPIA LOS ARREGLOS*/
    public ClearTraduction(){
        this.arrayTraducido = [];
        this.htmlElements = [];
        this.jsonElements = [];
        this.traductor = "";
        this.strError = "";
    } 


    /* METODOS PARA ORDENAR LA TRADUCCION*/
    public ShowTraduction(): string {
        var i:number = 0; 
        var tabs:string = "";
        var newElement:string = "";
        for (let index = 0; index < this.arrayTraducido.length; index++) {
            const element:TokenPyton = this.arrayTraducido[index];
            
            if (element.getDescription() == "TK_LlaveIzquierda") {
                i++;
                tabs = "";
                for (let j = 0; j < i; j++) {
                    tabs = tabs + "\t";
                }    
            } else if(element.getDescription() == "TK_LlaveDerecha"){
                i--;
                tabs = "";
                for (let j = 0; j < i; j++) {
                    tabs = tabs + "\t";
                }
            } else {
                newElement = newElement + "\n" + tabs + element.getLexema();
            }
        }
        return newElement;   
    }
    public ShowHTMLCode(): string {
        var i:number = 0; 
        var tabs:string = "";
        var newElement:string = "";
        for (let index = 0; index < this.htmlElements.length; index++) {
            const element:string = this.htmlElements[index];
            
            if (element == "{") {
                i++;
                tabs = "";
                for (let j = 0; j < i; j++) {
                    tabs = tabs + "\t";
                }    
            } else if(element == "}"){
                i--;
                tabs = "";
                for (let j = 0; j < i; j++) {
                    tabs = tabs + "\t";
                }
            } else {
                newElement = newElement + "\n" + tabs + element;
            }
        }
        return newElement;   
    }
    public ShowJSONCode(): string {
        var i:number = 0; 
        var tabs:string = "";
        var newElement:string = "";
        for (let index = 0; index < this.jsonElements.length; index++) {
            const element:TokenPyton = this.jsonElements[index];
            
            if (element.getDescription() == "TK_LlaveIzquierda") {
                i++;
                tabs = "";
                for (let j = 0; j < i; j++) {
                    tabs = tabs + "\t";
                }    
            } else if(element.getDescription() == "TK_LlaveDerecha"){
                i--;
                tabs = "";
                for (let j = 0; j < i; j++) {
                    tabs = tabs + "\t";
                }
            } else {
                newElement = newElement + "\n" + tabs + element.getLexema();
            }
        }
        return newElement;   
    }
    public GetError(): string {
        var str = this.strError;
        return str;
    }
}