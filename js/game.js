// --------------------------------------------------
// 1) Cargamos la pista actual desde la URL
//    Ejemplo: ?pista=0, ?pista=1, ?pista=2
// --------------------------------------------------
const parametro =
  new URLSearchParams(window.location.search).get("pista") || "1";

// Si la pista no existe, usamos la 1 para no romper la página
const datos = pistas[parametro] || pistas["1"];

// --------------------------------------------------
// 2) Pintamos la pista en el HTML
// --------------------------------------------------
document.getElementById("titulo").innerHTML = datos.titulo;
document.getElementById("texto").innerHTML = datos.texto;
document.getElementById("ayuda").innerHTML = datos.ayuda;

// Si la pista no tiene ayuda, ocultamos el botón
if (datos.ayuda === "") {
  document
    .querySelector('button[onclick="mostrarAyuda()"]')
    .style.display = "none";
}

// --------------------------------------------------
// 3) Función para normalizar texto
//    Quita mayúsculas, tildes, espacios y caracteres raros
//    para poder comparar respuestas fácilmente
// --------------------------------------------------
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .trim();
}

// --------------------------------------------------
// 4) Función para comprobar la respuesta del usuario
// --------------------------------------------------
function comprobar() {
  // Leemos el valor que ha escrito el usuario
  const valor = document.getElementById("respuesta").value;

  // Comparamos la respuesta con la solución correcta
  if (normalizar(valor) === normalizar(datos.respuesta)) {
    document.getElementById("resultado").className = "correcto";

    // Regla especial solo para la pista 0:
    // en la pista 0 se omite la frase "La magia ha revelado algo"
    if (parametro === "0") {
      document.getElementById("resultado").innerHTML =
        "✅ Correcto.<br><br><strong>" +
        datos.destino +
        "</strong>";
    } else {
      document.getElementById("resultado").innerHTML =
        "✅ Correcto.<br><br>⚡ La magia ha revelado algo:<br><br><strong>" +
        datos.destino +
        "</strong>";
    }

    return; // Salimos para no seguir ejecutando la lógica
  }

  // Si la respuesta es incorrecta
  document.getElementById("resultado").className = "incorrecto";
  document.getElementById("resultado").innerHTML =
    "❌ La respuesta no parece correcta. Inténtalo de nuevo.";
}

// --------------------------------------------------
// 5) Función para mostrar la ayuda
// --------------------------------------------------
function mostrarAyuda() {
  document.getElementById("ayuda").style.display = "block";
}

// --------------------------------------------------
// 6) Música de fondo
// --------------------------------------------------
const music = document.getElementById("music");

function toggleMusic() {
  if (music.paused) {
    music.play();
  } else {
    music.pause();
  }
}

// Reproducimos la música al primer click del usuario
document.addEventListener(
  "click",
  () => {
    if (music.paused) {
      music.play().catch(() => {});
    }
  },
  { once: true }
);