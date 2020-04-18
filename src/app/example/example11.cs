class MyProgram
{
    void Main()
    {
        /*
        #################### Archivo de entrada #1 #################
        ## El objetivo de este archivo es evaluar el manejo   ######
        ## correcto de la tabla de simbolos.                  ######
        ## Los tipos aceptados son:                           ######
        ####### Int
        ####### Float
        ####### Char
        ####### String
        ####### Boolean
        */
        //Declaraciones basicas
        int x,y,z =520; // x=520 ,y=520 ,z = 520
        double x1,y1,z1 = 3.14; // x1 = 3.14, 3.14, 3.14
        bool x2,y2,z2 = true; // x2 = true, y2=true, z2= true
        char x3,y3,z3 = 'x'; // x3='x' , y3='x', z3='x'
        string x4,y4,z4 = "CadenaDefecto"; // x4="CadenaDefecto", y4="CadenaDefecto", z4="CadenaDefecto"
        Console.Write(">>>>>>>>> Enteros <<<<<<<<<<<<<<<<");
        Console.Write("x debe ser 520, segun la tabla de simbolos tiene ["+x+"]");
        Console.Write("y debe ser 520, segun la tabla de simbolos tiene ["+y+"]");
        Console.Write("z debe ser 520, segun la tabla de simbolos tiene ["+z+"]");
        Console.Write(">>>>>>>>> Float  <<<<<<<<<<<<<<<<<");
        Console.Write("X1 debe ser 3.14, segun la tabla de simbolos tiene ["+x1+"]");
        Console.Write("y1 debe ser 3.14, segun la tabla de simbolos tiene ["+y1+"]");
        Console.Write("z1 debe ser 3.14, segun la tabla de simbolos tiene ["+z1+"]");
        Console.Write(">>>>>>>>> Bool  <<<<<<<<<<<<<<<<<");
        Console.Write("X2 debe ser true, segun la tabla de simbolos tiene ["+x2+"]");
        Console.Write("y2 debe ser true, segun la tabla de simbolos tiene ["+y2+"]");
        Console.Write("z2 debe ser true, segun la tabla de simbolos tiene ["+z2+"]");
        Console.Write(">>>>>>>>> Char  <<<<<<<<<<<<<<<<<");
        Console.Write("X3 debe ser x, segun la tabla de simbolos tiene ["+x3+"]");
        Console.Write("y3 debe ser x, segun la tabla de simbolos tiene ["+y3+"]");
        Console.Write("z3 debe ser x, segun la tabla de simbolos tiene ["+z3+"]");
        Console.Write(">>>>>>>>> String  <<<<<<<<<<<<<<<<<");
        Console.Write("X4 debe ser CadenaDefecto, segun la tabla de simbolos tiene ["+x4+"]");
        Console.Write("y4 debe ser CadenaDefecto, segun la tabla de simbolos tiene ["+y4+"]");
        Console.Write("z4 debe ser CadenaDefecto, segun la tabla de simbolos tiene ["+z4+"]");
        Console.Write("Si funciona todo, hasta el momento tengo 40 pts.");
        Console.Write("    ");
        Console.Write("    ");
        Console.Write("    ");
        //Asignacion y expresiones aritmeticas...........
        x = 50*2+10/2; //105
        y = 3*3+5-2; //12
        z = (10*5)-(45/3)+5; //40
        Console.Write(">>>>>>>>> Enteros <<<<<<<<<<<<<<<<");
        Console.Write("x debe ser 105, segun la tabla de simbolos tiene ["+x+"]");
        Console.Write("y debe ser 12, segun la tabla de simbolos tiene ["+y+"]");
        Console.Write("z debe ser 40, segun la tabla de simbolos tiene ["+z+"]");
        x1 = 3.14*10.20+5.20/2.60; //34.028
        y1 = 7.36+(5.12/2.00)-(3.16*2.00); //3.6
        z1 = 5.5+(4.4-2.3)*0.5; //6.55
        Console.Write(">>>>>>>>> Float <<<<<<<<<<<<<<<<");
        Console.Write("X1 debe ser 34.028, segun la tabla de simbolos tiene ["+x1+"]");
        Console.Write("y1 debe ser 3.6, segun la tabla de simbolos tiene ["+y1+"]");
        Console.Write("z1 debe ser 6.55, segun la tabla de simbolos tiene ["+z1+"]");
        x2 = true;//true
        y2 = false;//false
        z2 =2;//false
        Console.Write(">>>>>>>>> Bool  <<<<<<<<<<<<<<<<<");
        Console.Write("X2 debe ser true, segun la tabla de simbolos tiene ["+x2+"]");
        Console.Write("y2 debe ser false, segun la tabla de simbolos tiene ["+y2+"]");
        Console.Write("z2 debe ser false, segun la tabla de simbolos tiene ["+z2+"]");
        x3 = 'a';
        y3 = 'b';
        z3 = 'c';
        Console.Write(">>>>>>>>> Char  <<<<<<<<<<<<<<<<<");
        Console.Write("X3 debe ser a, segun la tabla de simbolos tiene ["+x3+"]");
        Console.Write("y3 debe ser b, segun la tabla de simbolos tiene ["+y3+"]");
        Console.Write("z3 debe ser c, segun la tabla de simbolos tiene ["+z3+"]");
        x4 = "Cadena de prueba";
        y4 = "Cadena de prueba";
        z4 = "Cadena de prueba";
        Console.Write(">>>>>>>>> String  <<<<<<<<<<<<<<<<<");
        Console.Write("X4 debe ser Cadena de prueba 1, segun la tabla de simbolos tiene ["+x4+"]");
        Console.Write("y4 debe ser Cadena de prueba 2, segun la tabla de simbolos tiene ["+y4+"]");
        Console.Write("z4 debe ser Cadena de prueba 3, segun la tabla de simbolos tiene ["+z4+"]");
        Console.Write("Si funciona todo, hasta el momento tengo 70 pts.");

        Console.Write(">>>>>>>>>>>>>>> CASO #1 <<<<<<<<<<<<<<<<<<<");
        double sueldo=10500.70;
    	if (sueldo>3000) 
        {
    	    Console.Write("Esta persona debe abonar impuestos");
    	} 
        Console.Write(">>>>>>>>>>>>>>> CASO #2 <<<<<<<<<<<<<<<<<<<");
        int num1, num2;
        num1 = 10;
        num2 = 20;
        if (num1 > num2)
        {
            Console.Write("Esta mal "+num1);
        }
        else
        {
            Console.Write("Esta bien "+num2);
        }
        Console.Write(">>>>>>>>>>>>>>> CASO #3 <<<<<<<<<<<<<<<<<<<");
        int nota1,nota2,nota3;
    	nota1=8;
    	nota2=5;
    	nota3=9;
        double promedio;
        promedio=(nota1 + nota2 + nota3) / 3;
    	if (promedio>=7) 
        {
    	    Console.Write("Promocionado con [7.33]"+promedio);
    	}
        Console.Write(">>>>>>>>>>>>>>> CASO #4 <<<<<<<<<<<<<<<<<<<");
        int num;
    	num=9;
    	if ((num*1)<(10+0)) 
        {
    	    Console.Write("Esta bien, Tiene un dígito");
    	}
        else 
        {
    	    Console.Write("Esta mal, Tiene dos dígitos");
    	}       
        Console.Write("(x+50-10/2)*2= 190 R://");
    }
}