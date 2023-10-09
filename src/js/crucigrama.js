let matrizOpciones = [];
let jugadores;
let totalCaracteres = 0;
cargarOpciones();

//variable que nos dira si juega el player 1 o el 2
let turno = true;

// Esta variable guardara temporalmente la letra BUENA de cada campo del crucigrama
// Para compararla con el valor ingresado por la persona
let letraTemp = "";

//funcion que trae del archivo variables.json la matriz qeu tiene las opciones
async function cargarOpciones() {
  try {
    const response = await fetch("../../variables.json");
    const data = await response.json();
    matrizOpciones = data.opcionesCrucigrama;
    console.log(matrizOpciones);
    llenarCuadros(matrizOpciones);
    contarCaracteres();
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

//funcion que llena la matriz del crucigrama
function llenarCuadros(matrizOpciones) {
  const tabla = document.getElementById("tablaCrucigrama");

  // Obtener todas las palabras
  const palabras = matrizOpciones;

  // Encontrar la longitud máxima de las palabras
  const maxLongitud = Math.max(...palabras.map((word) => word.length));

  // Crear las filas y columnas  del crucigrama que se añadiran a la tabla
  for (let i = 0; i < palabras.length; i++) {
    const fila = document.createElement("tr");
    const palabraActual = palabras[i];
    const validarLetras = /^[a-zA-Z0-9]+$/;
    const numeroPalabra = i + 1;
    const posicionCelda = document.createElement("td");
    posicionCelda.id = numeroPalabra;
    posicionCelda.textContent = `#${numeroPalabra}`; // Posición basada en 1, no en 0
    fila.appendChild(posicionCelda);

    //recorremos siempre la cantidad de letras de la palabra mas larga
    for (let j = 0; j < maxLongitud; j++) {
      const celda = document.createElement("td");

      //creamos cada columna de la tabla como un input
      const input = document.createElement("input");
      input.type = "text";
      input.style.width = "30px";
      input.style.height = "30px";
      input.style.textAlign = "center";
      input.style.color = "transparent";
      input.maxLength = 1;
      input.id = `input-${i}-${j}`;

      // Asignamos la letra correspondiente si existe sino ponemos un vacio
      if (palabraActual[j] != "" && palabraActual[j] != undefined) {
        input.value = palabraActual[j];
      } else {
        console.log(palabraActual[j] + "esta vacia");
      }

      //Al hacer click en el input obtenemos el valor actual
      //para que cuando cambie comparemos si la letra es la de la palabra
      input.addEventListener("click", (event) => {
        if (event.target.value !== "") {
          // Solo establece letraTemp si el valor del input no está vacío
          letraTemp = event.target.value;
          event.target.value = "";
        }
      });

      //agrego un change para que en caso que se salga del input sin haber escrito nada
      //vuelva asignar su valor original
      input.addEventListener("blur", (ele)=>{
        if (ele.target.value === "") {
            // Solo establece letraTemp si el valor del input no está vacío
            ele.target.value = letraTemp            
          }
      })

      input.addEventListener("keydown", function (event) {
        // Verifica si la tecla presionada es una tecla alfanumerica para validar si es la de la palabra
        //del crucigrama

        if (validarLetras.test(event.key)) {
          if (letraTemp === event.key.toUpperCase()) {
            Swal.fire({
              title: "¡Felicidades!",
              text: "Letra Correcta, continua jugando",
              icon: "success",
              timer: 2000,
            });

            event.target.style.color = "#F2F3F4";
            event.target.style.fontWeight = "bold";
            event.target.style.backgroundColor = "#58D68D";
            event.target.value = letraTemp;
            event.target.disabled = true;

            actualizarTurno("correcto");
            asignarTurno();
            asignarPuntos();
            restarCaracter();
          } else {
            event.target.value = letraTemp;
            Swal.fire({
              title: "¡Mala Ahí!",
              text: "Letra Incorrecta, Pierdes el turno",
              icon: "error",
              timer: 2000,
            });
            actualizarTurno("incorrecto");
            asignarTurno();
          }
        }
      });

      // Si la palabra no ocupa todo el ancho de la celda, lo marcamos de negro
      if (j >= palabraActual.length) {
        input.style.backgroundColor = "black";
        input.readOnly = true; // Hacemos que el input sea de solo lectura
      }

      celda.appendChild(input);
      fila.appendChild(celda);
    }

    tabla.appendChild(fila);
  }

  llenarJugadores();
  asignarTurno();
}

//obtenemos la cantidad total de caracteres para saber cuando acaba el juego
function contarCaracteres() {
  for (let i = 0; i < matrizOpciones.length; i++) {
    // Obtiene la longitud de la palabra actual y la suma al total
    totalCaracteres += matrizOpciones[i].length;
  }
}

function restarCaracter() {
  totalCaracteres -= 1;

  if (totalCaracteres === 0) {
    if (jugadores[0].puntos > jugadores[1].puntos) {
      Swal.fire({
        title: "¡Juego Terminado!",
        text: jugadores[0].usuario + " gana la partida",
        icon: "info"
      });
    } else if (jugadores[0].puntos === jugadores[1].puntos) {
      Swal.fire({
        title: "¡Juego Terminado!",
        text: "La partida queda empatada en puntos",
        icon: "info"
      });
    } else {
      Swal.fire({
        title: "¡Juego Terminado!",
        text: jugadores[1].usuario + " gana la partida",
        icon: "info"        
      });
    }
  }
}
//Esta funcion recorre la variable guardada en el localStorage de los jugadores para
//llenar la informacion inicial del crucigrama
function llenarJugadores() {
  //Obtengo los jugadores del local storage
  jugadores = JSON.parse(localStorage.getItem("jugadores"));
  const player1 = jugadores[0];
  const player2 = jugadores[1];

  elementPlayer1 = document.getElementById("titleplayer1");
  elementPlayer2 = document.getElementById("titleplayer2");

  elementPlayer1.innerHTML = player1.usuario;
  elementPlayer2.innerHTML = player2.usuario;

  console.log(jugadores);
}

//Esta funcion valida la variable boleana turno para saber de qien es el turno de jugar
function asignarTurno() {
  const turnPlayer1 = document.getElementById("DivPlayer1");
  const turnPlayer2 = document.getElementById("DivPlayer2");
  const h3Player1 = document.getElementById("turnoPlayer1");
  const h3Player2 = document.getElementById("turnoPlayer2");

  if (turno) {
    turnPlayer1.style.backgroundColor = "#7F8C8D";
    h3Player1.innerHTML = "TuTurno";
    turnPlayer2.style.backgroundColor = "transparent";
    h3Player2.innerHTML = "";
  } else {
    turnPlayer2.style.backgroundColor = "#7F8C8D";
    h3Player2.innerHTML = "TuTurno";
    turnPlayer1.style.backgroundColor = "transparent";
    h3Player1.innerHTML = "";
  }
}

//esta funcion verifica si despues de jugar se debe cambiar de turno o no
function actualizarTurno(estado) {
  if (estado == "correcto") {
    turno = turno;
  } else {
    turno = !turno;
  }
}

//asigna los puntos al jugador en caso de acierto
function asignarPuntos() {
  const inpPoints1 = document.getElementById("inp-points1");
  const inpPoints2 = document.getElementById("inp-points2");

  if (turno) {
    jugadores[0].puntos = jugadores[0].puntos + 10;
    inpPoints1.value = jugadores[0].puntos;
  } else {
    jugadores[1].puntos = jugadores[1].puntos + 10;
    inpPoints2.value = jugadores[1].puntos;
  }
}
