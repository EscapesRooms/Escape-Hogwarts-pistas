


const parametro =
new URLSearchParams(window.location.search)
.get("pista") || "1";

const datos = pistas[parametro];

document.getElementById("titulo").innerHTML =
datos.titulo;

document.getElementById("texto").innerHTML =
datos.texto;

document.getElementById("ayuda").innerHTML =
datos.ayuda;

if(datos.ayuda===""){
document.querySelector('button[onclick="mostrarAyuda()"]').style.display="none";
}

function normalizar(texto){

return texto
.toLowerCase()
.normalize("NFD")
.replace(/[\u0300-\u036f]/g,"")
.replace(/\s+/g,"")
.trim();

}

function comprobar() {
  // 1) Leemos el texto que ha escrito el usuario en el input
  const valor = document.getElementById("respuesta").value;

  // 2) Comparamos la respuesta introducida con la respuesta correcta
  //    normalizando mayúsculas, tildes, espacios y otros caracteres
  if (normalizar(valor) === normalizar(datos.respuesta)) {

    // Si la respuesta es correcta:
    document.getElementById("resultado").className = "correcto";

    // 3) Solo en la pista 0 ocultamos el texto:
    //    "La magia ha revelado algo:"
    //    En el resto de pistas se mantiene el mensaje completo
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

    // 4) Salimos de la función para no seguir ejecutando más
    return;
  }

  // 5) Si la respuesta no coincide:
  document.getElementById("resultado").className = "incorrecto";
  document.getElementById("resultado").innerHTML =
    "❌ La respuesta no parece correcta. Inténtalo de nuevo.";
}

const music=document.getElementById("music");

function toggleMusic(){

if(music.paused){

music.play();

}else{

music.pause();

}

}

document.addEventListener("click",()=>{

if(music.paused){

music.play().catch(()=>{});

}

},{once:true});
