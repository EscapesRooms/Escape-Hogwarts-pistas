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

if (datos.tipo === "coordenadas") {
  document.getElementById("texto").innerHTML =
    "Completa los números ocultos para descubrir la siguiente localización.";
  document.getElementById("respuesta").style.display = "none";
  document.getElementById("comprobarBtn").textContent =
    "🪄 Comprobar coordenadas";
  pintarCoordenadas();
}

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
  if (datos.tipo === "coordenadas") {
    comprobarCoordenadas();
    return;
  }

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

function pintarCoordenadas() {
  const contenedor = document.getElementById("respuesta-coordenadas");
  const coordenadas = document.createElement("div");
  let numeroOculto = 0;

  coordenadas.className = "coordenadas";
  coordenadas.setAttribute("aria-label", "Coordenadas con números ocultos");

  datos.coordenadas.forEach((parte, indice) => {
    if (!parte.oculto) {
      coordenadas.appendChild(document.createTextNode(parte.texto));
      return;
    }

    const entrada = document.createElement("input");
    numeroOculto++;

    entrada.className = "numero-coordenada";
    entrada.type = "text";
    entrada.inputMode = "numeric";
    entrada.maxLength = 1;
    entrada.dataset.indice = indice;
    entrada.setAttribute("aria-label", `Número oculto ${numeroOculto}`);
    entrada.addEventListener("input", () => comprobarNumero(entrada, parte.respuesta));
    coordenadas.appendChild(entrada);
  });

  contenedor.appendChild(coordenadas);
}

function comprobarNumero(entrada, respuesta) {
  entrada.value = entrada.value.replace(/\D/g, "").slice(0, 1);

  if (entrada.value === respuesta) {
    entrada.classList.remove("numero-incorrecto");
    entrada.classList.add("numero-correcto");
    entrada.disabled = true;
  } else {
    entrada.classList.remove("numero-correcto");
    entrada.classList.toggle("numero-incorrecto", entrada.value.length > 0);
  }
}

function comprobarCoordenadas() {
  const entradas = document.querySelectorAll(".numero-coordenada");
  const completas = [...entradas].every(entrada => entrada.disabled);
  const resultado = document.getElementById("resultado");

  if (!completas) {
    resultado.className = "incorrecto";
    resultado.textContent = "❌ Aún quedan números por descubrir.";
    return;
  }

  resultado.className = "correcto";
  resultado.innerHTML =
    "✅ Coordenadas descubiertas.<br><br>⚡ La magia ha revelado algo:<br><br><strong>" +
    datos.destino +
    "</strong><br><br><a class=\"enlace-mapa\" href=\"https://www.google.com/maps/search/?api=1&query=41.442361,2.177472\" target=\"_blank\" rel=\"noopener noreferrer\">📍 Abrir coordenadas en Google Maps</a><br><small>41°26'32.5\"N 2°10'38.9\"E</small>";
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