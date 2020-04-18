public class Example
{
    //DECLARACION VARIABLES
    int a;
    String b;
    bool c;
    char d;
    double e;

    /*
    DECLARACION MUCHAS VARIABLES
    */
    int a, b, c, d, e;//VARIABLES
    String nombre, apellido, apodo;//VARIABLES
    bool esHoja, esHijo;//VARIABLES
    char sexo, orientacion;/*CHAR PENDIENTE*/
    double edad, peso, tamano;/*DOUBLE PENDIENTE*/

    //DECLARACION VARIABLES INICIALIZADAS
    int a = 1232;//NUMERO
    String b = "HOLA MUNDO";//String
    bool c = true;//FALSE
    char d = "a";/*CHAR PENDIENTE*/
    double e = 12321;/*DOUBLE PENDIENTE*/

    /*
    DECLARACION MUCHAS VARIABLES
    */
    int a = 2, b = 2, c=3, d=2, e = 2;//ASIGNACIONES
    String nombre=1, apellido=2, apodo = "Rafis";//ASGINACIONES
    bool esHoja=2, esHijo = true;//ASIGNACIONES
    char sexo=2, orientacion = "a";/*CHAR PENDIENTE*/
    double edad=1, peso=2, tamano = 12;/*DOUBLE PENDIENTE*/

    //DECLARACION CON METODOS
    int hola = holaMundo();
    String hola = holaMundo();
    bool hola = holaMundo();
    char hola = holaMundo();
    double hola = holaMundo();


    void Main(String[] args)
    {
        if(a=b) {

        }
       return;
    }
    void OtroMetodo(String a, bool b, char c, double d, int e) {
        break;
    }

    int metodo(int a, int b, int c) {
        return 1+2*3/3;
    }

    int metodo(int a, int b, int c) {
        return a+b+c;
    }

    String metodo() {
        return "Hola Mundo";
    }

    char metodo() {
        return "Hola Mundo" + b + " " + c;
    }

    double metodo() {
        return true;
    }

    bool metodo() {
        return false;
    }

}