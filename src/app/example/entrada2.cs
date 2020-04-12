/*
	RECUERDEN QUE LA GRAMATICA DEBE SER UNA  LL1
*/

class Entrada2{

	//Archivo sin errores... o eso creo xD
	int a = 12;

	void main(){
		String a = printSucess();
		llamada = suma(numero1, 5*8+6)-resta(numero1, 5*8+6) * (multiplicacion(numero1, 5*8+6)/ division(numero1, 5*8+6));		
	}


	double suma(double n1, double n2){
		return n1 + n2;		
	}
	double resta(double n1, double n2){
		return n1 - n2;		
	}
	double multiplicacion(double n1, double n2){
		return n1 * n2;		
	}
	double division(double n1, double n2){
		return n1 / n2;		
	}
	double mayorIgualQue(double n1, double n2){
		return n1 > n2 || n1 == n2;		
	}

	void printSucess(){
		string htmlSucess = "Este html esta correcto...!!!\n";
		Console.Write(htmlSucess);
		Console.Write('<html><head><title>Example 1</title></head><body style="background: skyblue"><h2>[OLC1]Practica 2</h2><p>Si<br>sale<br>compi<br>1<br>:)<br>html sin errores..!!!</p></body></html>');	
	}

}