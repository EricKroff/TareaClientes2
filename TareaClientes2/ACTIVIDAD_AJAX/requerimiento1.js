/* Declaramos la ruta y recurso como constante ya que su valor no cambia. */
const URL_DESTINO = "http://127.0.0.1:5500/AI_DOM_FORMLARIOS_GRUPO";
const RECURSO = 'datos.json';

 
/* Meteremos todo en un "document.addEventListener" para asegurarnos de que el codigo JS se ejecutará una vez que el DOM esté cargado por completo para poder ser manipulado. */
document.addEventListener('DOMContentLoaded', function () {


    peticionAjax();

    // FUNCIONALIDAD DE BOTON REFRESCAR
    document.getElementById('refreshButton').addEventListener('click', function () {
        peticionAjax();
    });


    // PETICIÓN AJAX
    function peticionAjax() {
        
        let xmlHttp = new XMLHttpRequest();

        xmlHttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    procesarRespuestaJSON(this.responseText);
                } else {
                    alert("Error al cargar datos JSON");
                }
            }
        }

        xmlHttp.open('GET', RECURSO, true);
        xmlHttp.send(null);
    }


    // PROCESAMOS JSON
    function procesarRespuestaJSON(jsonDoc) {
        var datos = JSON.parse(jsonDoc);
        llenarTamanosPizza(datos.tamanosPizza);
        llenarIngredientes(datos.ingredientes);
    }


    // LLENAMOS PIZZA
    function llenarTamanosPizza(tamanosPizza) {
        var tamanosPizzaDiv = document.getElementById('tamanopizza');

        for (var i = 0; i < tamanosPizza.length; i++) {
            var input = document.createElement("input");
            input.type = "radio";
            input.name = "tamanoPizza";
            input.value = tamanosPizza[i];

            var label = document.createElement("label");
            label.innerHTML = tamanosPizza[i];

            tamanosPizzaDiv.appendChild(input);
            tamanosPizzaDiv.appendChild(label);
        }
    }

    //LLENAMOS INGREDIENTES
    function llenarIngredientes(ingredientes) {
        var ingredientesDiv = document.getElementById('ingredientes');

        for (var i = 0; i < ingredientes.length; i++) {
            var input = document.createElement("input");
            input.type = "checkbox";
            input.name = "ingrediente";
            input.value = ingredientes[i];

            var label = document.createElement("label");
            label.innerHTML = ingredientes[i];

            ingredientesDiv.appendChild(input);
            ingredientesDiv.appendChild(label);
        }
    }

    // "ERROR": EL RESULTADO TOTAL SOLO ME DURA UNOS MILISEGUNDOS EN PANTALLA

    // Añadimos un event listener al botón de procesar pedido
    document.getElementById('procesarPedidoButton').addEventListener('click', function () {
        
        // Obtenemos tamaño de la pizza seleccionado
        var tamanoSeleccionado = obtenerSeleccion('tamanoPizza');

        // Obtenemos los ingredientes seleccionados
        var ingredientesSeleccionados = obtenerSeleccionMultiple('ingrediente');

        // Realizamos llamada al servidor
        obtenerPrecios(tamanoSeleccionado, ingredientesSeleccionados);
    });

    // Función para obtener la selección de un grupo de radio o checkbox
    function obtenerSeleccion(nombreGrupo) {
        var grupo = document.getElementsByName(nombreGrupo);

        for (var i = 0; i < grupo.length; i++) {
            if (grupo[i].checked) {
                return grupo[i].value;
            }
        }

        return null; // Ninguna opción seleccionada
    }

    // Función para obtener múltiples selecciones de checkboxes
    function obtenerSeleccionMultiple(nombreGrupo) {
        var grupo = document.getElementsByName(nombreGrupo);
        var seleccionados = [];

        for (var i = 0; i < grupo.length; i++) {
            if (grupo[i].checked) {
                seleccionados.push(grupo[i].value);
            }
        }

        return seleccionados;
    }

    // Función para obtener precios del servidor mediante AJAX
    function obtenerPrecios(tamanoPizza, ingredientesSeleccionados) {
        
        // NUEV0 JSON CON DATOS DE LOS PRECIOS
        var urlPrecios = "precios.json";
        
        let xmlHttp = new XMLHttpRequest();

        xmlHttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    procesarRespuestaPrecios(this.responseText, tamanoPizza, ingredientesSeleccionados);
                } else {
                    alert("Error al cargar datos de precios JSON");
                }
            }
        }

        xmlHttp.open('GET', urlPrecios, true);
        xmlHttp.send(null);
    }

    // Función para procesar la respuesta de precios y mostrar el precio total
    function procesarRespuestaPrecios(jsonDoc, tamanoPizza, ingredientesSeleccionados) {
    
        var precios = JSON.parse(jsonDoc);

        //Indicamos el precio del tamaño de pizza seleccionado
        var precioTamanoPizza = precios.tamanosPizza[tamanoPizza];

        // Sumamos precios de los ingredientes seleccionados
        var precioIngredientes = 0;
        for (var i = 0; i < ingredientesSeleccionados.length; i++) {
            precioIngredientes += precios.ingredientes[ingredientesSeleccionados[i]];
        }

        // Calculamos precio total sumando el precio del tamaño de pizza y el de los ingredientes
        var precioTotal = precioTamanoPizza + precioIngredientes;

        // Mostramos resultado en el elemento con id 'precioTotal'
        var precioTotalElement = document.getElementById('precioTotal');

        // Añadimos hijo de 'precioTotal'
        var h4Element = document.createElement("h4");
        h4Element.textContent = "Precio Total: $" + precioTotal.toFixed(2);
        precioTotalElement.appendChild(h4Element);
}


// event.preventDefault(); : esto fue una prueba para el error anteriormente mencionado.s



});