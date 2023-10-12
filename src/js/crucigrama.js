let matrizOpciones = [];
let jugadores;
let totalCaracteres = 0;
cargarOpciones();

//variable que nos dira si juega el player 1 o el 2
let turno = true;

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
  const palabras = matrizOpciones.map((opcion) => opcion.palabra);
  const imagenes = matrizOpciones.map((opcion) => opcion.rutaImagen);

  llenarPistas(imagenes);
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
    posicionCelda.textContent = numeroPalabra; // Posición basada en 1, no en 0
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
      input.style.userSelect = "none";
      input.style.color = "transparent";
      input.maxLength = 1;
      input.id = `input-${i}-${j}`;
      input.setAttribute("data-value", palabraActual[j] || "");

      input.addEventListener("keydown", function (event) {
        // Verifica si la tecla presionada es una tecla alfanumerica para validar si es la de la palabra
        //del crucigrama
        const dataValue = event.target.getAttribute("data-value");
        if (event.key.length === 1 & validarLetras.test(event.key)) {
          if (dataValue === event.key.toUpperCase()) {
            event.target.value = event.key.toUpperCase();
            event.target.style.color = "#F2F3F4";
            event.target.style.fontWeight = "bold";
            event.target.style.backgroundColor = "#58D68D";
            event.target.disabled = true;

            const mensajeBuena = ['Buenisima','Reebiennn','Si señorrr','Crackkk!'];            
            const indiceAleatorio = Math.floor(Math.random() * mensajeBuena.length);
            const palabraAleatoria = mensajeBuena[indiceAleatorio];
            Swal.fire({
              title: "¡"+palabraAleatoria+"!",
              text: "Letra Correcta, continua jugando",
              icon: "success",
              timer: 2000,
            });

            actualizarTurno("correcto");
            asignarTurno();
            asignarPuntos();
            restarCaracter();
          } else {
            const mensajeMala = ['Mala Ahí','Equivocado pa','No señorrr','No hay nadie peor que tu','Pfff Nooo'];            
            const indiceAleatorio = Math.floor(Math.random() * mensajeMala.length);
            const palabraAleatoria = mensajeMala[indiceAleatorio];
            Swal.fire({
              title: "¡"+palabraAleatoria+"!",
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


function llenarPistas(imagenes) {
  const boxContainer = document.querySelector(".box");
  imagenes.forEach((imagen, indice) => {
    
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");
    
    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title");
    titleDiv.textContent = indice + 1; 
    imageContainer.appendChild(titleDiv);
    
    const imageElement = document.createElement("img");
    imageElement.src = imagen;
    
    imageContainer.appendChild(imageElement);
    
    boxContainer.appendChild(imageContainer);
  });
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
        icon: "info",
      });
    } else if (jugadores[0].puntos === jugadores[1].puntos) {
      Swal.fire({
        title: "¡Juego Terminado!",
        text: "La partida queda empatada en puntos",
        icon: "info",
      });
    } else {
      Swal.fire({
        title: "¡Juego Terminado!",
        text: jugadores[1].usuario + " gana la partida",
        icon: "info",
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

document.getElementById("btn-regresar").addEventListener("click", function () {
  window.location.href = "../index.html";
});

document.getElementById("btn-comojugar").addEventListener("click", function () {
  window.open("../assets/Doc/ComoJugar.pdf", "_blank");
});
