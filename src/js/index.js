let peliculas;
const ruteImage = "assets/Peliculas/";
const navRegistrar = document.getElementById("nav-registrar");
cargarPeliculas();
async function cargarPeliculas() {
  try {
    const response = await fetch("../variables.json");
    const data = await response.json();
    peliculas = data.peliculas;
    console.log(peliculas);
    fillCards();
    localStorage.clear();
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

function fillCards() {
  // Recorrer el array de películas
  peliculas.forEach((peli) => {
    // Crear card
    const card = document.createElement("div");
    card.className = "col-md-3";

    const cardDiv = document.createElement("div");
    cardDiv.className = "card mb-3 d-flex flex-column";

    const img = document.createElement("img");
    img.style.width = "100%";
    img.src = `${ruteImage}${peli.imagen}`;
    img.className = "card-img-top";

    const body = document.createElement("div");
    body.className = "card-body d-flex flex-column";

    const titulo = document.createElement("h5");
    titulo.textContent = peli.titulo;
    titulo.className = "card-title";
    

    const anio = document.createElement("h6");
    anio.className = "card-anio";
    anio.textContent = `Año:  ${peli.anio}`;

    const director = document.createElement("h6");
    director.className = "card-director";
    director.textContent = `Director:  ${peli.director}`;

    const desc = document.createElement("p");
    desc.textContent = peli.descripcion;
    desc.className = "card-text";

    // Agregar elementos
    body.appendChild(titulo);
    body.appendChild(anio);
    body.appendChild(director);
    body.appendChild(desc);
    cardDiv.appendChild(img);
    cardDiv.appendChild(body);
    card.appendChild(cardDiv);

    // Agregar card al HTML
    document.getElementById("peliculas").appendChild(card);
  });
  igualarAlturaCards();
}

function igualarAlturaCards() {
  const cards = document.querySelectorAll(".card-body");
  let maxHeight = 0;

  //Se busca la altura maxima de las tarjeta
  cards.forEach((card) => {
    const height = card.offsetHeight;
    maxHeight = height > maxHeight ? height : maxHeight;
  });

  //Se actualiza la altura de lamas grande a todas
  cards.forEach((card) => {
    card.style.height = `${maxHeight}px`;
  });
}

document.getElementById("nav-registrar").addEventListener("click", function() {
  window.location.href = "views/registro.html";
});


document.getElementById("btn-comojugar").addEventListener("click", function () {
  window.open("/src/assets/Doc/ComoJugar.pdf", "_blank");
});
