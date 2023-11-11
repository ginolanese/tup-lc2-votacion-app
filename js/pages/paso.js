import { provinciasSVG } from "./mapas.js";

const periodosURL = "https://resultados.mininterior.gob.ar/api/menu/periodos";
const cargoURL = "https://resultados.mininterior.gob.ar/api/menu?año=";
const getResultados = "https://resultados.mininterior.gob.ar/api/resultados/getResultados"

//Se usa el $ para poder distingir con mayor facilidad los elementos directos del DOM
const $selectAnio = document.getElementById("anio");
const $selectCargo = document.getElementById("cargo");
const $selectDistrito = document.getElementById("distrito");
const $seccionSelect = document.getElementById("seccion");
const $inputSeccionProvincial = document.getElementById("hdSeccionProvincial") //!esta oculto para el usuario y solo guarda IDSecccionProvincial
const $botonFiltrar = document.getElementById('filtrar')
const $msjRojoError = document.getElementById("error")
const $msjVerdeExito = document.getElementById("exito")
const $msjAmarilloAdver = document.getElementById("adver")
const $cuadros = document.querySelector("#cuadros")
const $tituloSubTitulo = document.querySelector("#sec-titulo")
const $contenido = document.querySelector("#sec-contenido")
const $btnAgregarInforme = document.querySelector("#agregar-informe")


//!!span para cambiar con el filtro.
const $spanMesasComputadas = document.getElementById("mesas-computadas-porsen")
const $spanElectores = document.getElementById("electores")
const $spanSobreRecuento = document.getElementById("sobre-recuento")

const $spanMapaSvg = document.querySelector("#svg-mapa")

//!Guardamos los datos a medida que se van filtrando en estas Variables
let periodosSelect = "" //? año seleciconad
let cargoSelect = "" //? ID de cargo para ir filtrando
let distritoSelect = "" //? ID de distrito para ir filtrando
let seccionSeleccionadaID = ""  //? ID SeccionProvincial del Input escondido/invicible. para el filtrado
let idSeccionProv = "" //? ID de la Seccion probicial del Select para el filtrado
const tipoEleccion = 1; //? tipo 1 eleccion PASOS
const tipoRecuento = 1;
let valorCargo = ""
let valorDistrito = ""
let valorSeccion = ""
let valorTipoEleccion = ""
let valorSvg = ""
let valorCantidadElectores = ""
let valorMesasTotalizadas = ""
let valorParticipacionPorcentaje = ""

reconoceTipoElecion()
//*---------------Start-----------------------


document.addEventListener('DOMContentLoaded', () => {
  mostrarMensaje($msjAmarilloAdver, `Debe seleccionar los valores a filtrar y hacer clic en el botón FILTRAR`, 90000)

});
mostrarMensaje($msjAmarilloAdver, "HOlas buenas tardes señores")

document.addEventListener('DOMContentLoaded', seleccionAnio); //cuando sudeda este evento se llama automaticamente la funcion async
$selectAnio.addEventListener('change', seleccionCargo); //cuando el <select> cambie se llama a la siguiente fun
$selectCargo.addEventListener('change', seleccionDistrito); //cuando el <select> cambie se llama a la siguiente fun
$selectDistrito.addEventListener('change', seleccionSeccionProv); //cuando el <select> cambie se llama a la siguiente fun
$seccionSelect.addEventListener('change', seleccionCargo); //cuando el <select> cambie se llama a la siguiente fun
$seccionSelect.addEventListener('change', () => {
  let opcionSeleccionada = $seccionSelect.options[$seccionSelect.selectedIndex];
  valorSeccion = opcionSeleccionada.textContent; // el texto de la opción seleccionada
});

$botonFiltrar.addEventListener('click', filtrar);
$btnAgregarInforme.addEventListener("click", agregarAInforme);



//*-------------end--------------
//!! ----------AÑO CON FUNCION ASYNC--------------
async function seleccionAnio() {
  console.log(" ----INICIA LA FUN ASYNC DE seleccionAnio---- ")

  try {
    borrarTodosLosHijos() //!Deberia borrar todos los hijos de los select
    resetFiltro()//!deberia reiniciar el filtro
    const respuesta = await fetch(periodosURL); //?aca use await para pausar la ejecución del programa hasta que la API devuelva algo, los datos en crudo se guardan en la variable respuesta.

    if (respuesta.ok) {
      borrarHijos($selectAnio)
      const anios = await respuesta.json();
      console.log("----Json, Año para Cargo----")
      console.log(anios)

      anios.forEach((anio) => { //?se recorre todo el json()
        const nuevaOption = document.createElement("option"); //? Se Crea una etiqueta <opcion> se le agrega el value y su texto (en este caso el año)
        nuevaOption.value = anio;
        nuevaOption.innerHTML = ` ${anio}`;
        $selectAnio.appendChild(nuevaOption); //? <la nueva etiqueta se agrega como hija de <select> de nuesto html.
      });
    }
    else {
      mostrarMensaje($msjRojoError, "Error: Se pordujo un error al intentar agregar reusultados al informe");
    }
  }
  catch (error) {  //!Si en try aparece un error se va a pasar al parametro "error" y entra directamente a catch().
    mostrarMensaje($msjRojoError, "Error: Se pordujo un error al intentar agregar reusultados al informe")
    console.log("algo salio mal.. puede que el servico este caido.")
    console.log(error)

  }
  console.log(" ----FINALIZA LA FUN ASYNC DE seleccionAnio---- ")
}

//!! ------------CARGO CON FUN ASYNC-----------
async function seleccionCargo() {
  console.log(" ----INICIA LA FUN ASYNC DE seleccionCargo---- ")
  periodosSelect = $selectAnio.value //!!YA se selecciona para el filtro final. Creo que habria que validarlo, si realmente tiene un valor, pero creo que no hace falta, talvez el no validar puede dar un error.

  try {
    const respuesta = await fetch(cargoURL + periodosSelect);
    if (respuesta.ok) {
      borrarHijos($selectCargo)
      const elecciones = await respuesta.json();
      console.log("----Json, año para elecciones----")
      console.log(elecciones)

      elecciones.forEach((cargo) => {
        if (cargo.IdEleccion == tipoEleccion) {  //?Se selecciona el tipo 1 de todos los cargos
          cargo.Cargos.forEach((cargo) => { //?se recorre todo el json()
            const nuevaOption = document.createElement("option"); //? Se Crea una etiqueta <opcion> se le agrega el value y su texto
            nuevaOption.value = cargo.IdCargo;
            nuevaOption.innerHTML = `${cargo.Cargo}`;
            $selectCargo.appendChild(nuevaOption); //?la nueva etiqueta se agrega como hija de <select> de nuesto html.
          })
        }
      });
    }
    else {
      mostrarMensaje($msjRojoError, "Error: Se pordujo un error al intentar agregar reusultados al informe");
    }
  }
  catch (error) { //!Si en try aparece un error se va a pasar al parametro "error" y entra directamente a catch().
    mostrarMensaje($msjRojoError, "Error: Se pordujo un error al intentar agregar reusultados al informe")
    console.log("algo salio mal.. puede que el servico este caido.")
    console.log(error)

  }
  console.log(" ----FINALIZA LA FUN ASYNC DE seleccionCargo---- ")

}

//!!-------------Distrito con fun ASYNC---------------------
async function seleccionDistrito() {
  console.log(" ----INICIA LA FUN ASYNC DE seleccionDistrito---- ")
  cargoSelect = $selectCargo.value //!se guarda el cargo elegido anteriormente
  try {
    const respuesta = await fetch(cargoURL + periodosSelect);
    if (respuesta.ok) {
      borrarHijos($selectDistrito)
      const elecciones = await respuesta.json();

      elecciones.forEach((eleccion) => {
        if (eleccion.IdEleccion == tipoEleccion) {  //?Se selecciona el tipo 1 de todos los cargos
          eleccion.Cargos.forEach((cargo) => { //se recorre todo el json()
            if (cargo.IdCargo == cargoSelect) { //? Se selecciona el cargo anteriormente seleccionado.
              valorCargo = `${cargo.Cargo}`

              console.log("----Json Cargo para Distrito----")
              console.log(cargo)

              cargo.Distritos.forEach((distrito) => {
                const nuevaOption = document.createElement("option"); //? Se Crea una etiqueta <opcion> se le agrega el value y su texto
                nuevaOption.value = distrito.IdDistrito;
                nuevaOption.innerHTML = `${distrito.Distrito}`;
                $selectDistrito.appendChild(nuevaOption)
              })
            }
          })
        }
      });
    }
    else {
      mostrarMensaje($msjRojoError, "Error: Se pordujo un error al intentar agregar reusultados al informe");
    }
  }
  catch (error) { //!Si en try aparece un error se va a pasar al parametro "error" y entra directamente a catch().
    mostrarMensaje($msjRojoError, "Error: Se pordujo un error al intentar agregar reusultados al informe")
    console.log("algo salio mal.. puede que el servico este caido.")
    console.log(error)

  }
  console.log(" ----FINALIZA LA FUN ASYNC DE seleccionDistrito---- ")
}

//!!-------------Seccion Provincial fun ASYNC---------------
async function seleccionSeccionProv() {
  console.log(" ----INICIA LA FUN ASYNC DE seleccionSeccionProv---- ")
  distritoSelect = $selectDistrito.value
  try {
    const respuesta = await fetch(cargoURL + periodosSelect);
    if (respuesta.ok) {
      const elecciones = await respuesta.json();
      borrarHijos($seccionSelect)

      elecciones.forEach((eleccion) => {
        if (eleccion.IdEleccion == tipoEleccion) {  //?Se selecciona el tipo 1 de todos los cargos
          eleccion.Cargos.forEach((cargo) => { //se recorre todo el json()
            if (cargo.IdCargo == cargoSelect) { //? Se selecciona el cargo anteriormente seleccionado.
              cargo.Distritos.forEach((distrito) => {
                if (distrito.IdDistrito == distritoSelect) {
                  valorDistrito = `${distrito.Distrito}`
                  console.log("----Json Distrito para SeccionProv----")
                  console.log(distrito)

                  distrito.SeccionesProvinciales.forEach((seccionProv) => {
                    idSeccionProv = seccionProv.IDSeccionProvincial;
                    $inputSeccionProvincial.value = idSeccionProv; //! agrega el valor al input oculto
                    seccionProv.Secciones.forEach((seccion) => {
                      console.log("----Json Selecciones Provinciales para Secciones----")
                      console.log(seccion)
                      const nuevaOption = document.createElement("option");
                      nuevaOption.value = seccion.IdSeccion;
                      nuevaOption.innerHTML = `${seccion.Seccion}`;
                      $seccionSelect.appendChild(nuevaOption)
                    })
                  })
                }
              })
            }
          })
        }
      })
    }

    else {
      mostrarMensaje($msjRojoError, "Error: Se pordujo un error al intentar agregar reusultados al informe");
    }
  }
  catch (error) { //!Si en try aparece un error se va a pasar al parametro "error" y entra directamente a catch().
    mostrarMensaje($msjRojoError, "Error: Se pordujo un error al intentar agregar reusultados al informe")
    console.log("algo salio mal.. puede que el servico este caido.")
    console.log(error)
  }
  console.log(" ----FINALIZA LA FUN ASYNC DE seleccionSeccionProv---- ")
}

//!!-----------Fun Filtrar-------------
async function filtrar() {
  idSeccionProv = $seccionSelect.value
  seccionSeleccionadaID = $inputSeccionProvincial.value
  let idCircuito = "";
  let IdMesa = "";

  if (periodosSelect === "" || cargoSelect === "" || distritoSelect === "" || idSeccionProv === "") {
    mostrarMensaje($msjAmarilloAdver, "No se encontró información para la consulta realizada");
    $tituloSubTitulo.classList.remove("escondido");
    return;
  }

  console.log(`---año: ${periodosSelect} Cargo: ${cargoSelect} distrito: ${distritoSelect} Seleccion ID(nul):${seccionSeleccionadaID} IDSelecciones Provinciales: ${idSeccionProv}---`)

  let parametros = `?anioEleccion=${periodosSelect}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${cargoSelect}&distritoId=${distritoSelect}seccionProvincialId=${seccionSeleccionadaID}&seccionId=${idSeccionProv}&circuitoId=${idCircuito}&mesaId=${IdMesa}`
  let url = getResultados + parametros
  console.log(url);
  try {
    const respuesta = await fetch(url)
    if (respuesta.ok) {
      const filtrado = await respuesta.json()
      console.log(filtrado);

      mostrarMensaje($msjVerdeExito, "Se agrego con éxito el resultado al informe")
      $tituloSubTitulo.classList.remove("escondido"); //!SE hace vicible
      $contenido.classList.remove("escondido");
      $cuadros.classList.remove("escondido");
      $tituloSubTitulo.querySelector("h1").textContent = `Elecciones ${periodosSelect} | ${valorTipoEleccion}`//!se agrega titulo y subtitulo. 
      let subTitulo = `${periodosSelect} > ${valorTipoEleccion} > ${valorCargo} > ${valorDistrito} > ${valorSeccion}`
      $tituloSubTitulo.querySelector("p").textContent = subTitulo

      valorCantidadElectores = filtrado.estadoRecuento.cantidadElectores
      valorMesasTotalizadas = filtrado.estadoRecuento.mesasTotalizadas
      valorParticipacionPorcentaje = filtrado.estadoRecuento.participacionPorcentaje

      $spanElectores.textContent = valorCantidadElectores
      $spanMesasComputadas.textContent = valorMesasTotalizadas
      $spanSobreRecuento.textContent = valorParticipacionPorcentaje
      valorSvg = buscaMapa(valorDistrito)
      $spanMapaSvg.innerHTML = valorSvg

    }
    else {
      mostrarMensaje($msjRojoError, "Error: Se pordujo un error al intentar agregar reusultados al informe");
      $tituloSubTitulo.classList.remove("escondido");

    }
  }
  catch (error) {
    mostrarMensaje($msjRojoError, "Error: Se pordujo un error al intentar agregar reusultados al informe")
    console.log("algo salio mal.. puede que el servico este caido.")
    console.log(error)
    $tituloSubTitulo.classList.remove("escondido");

  }
}

function buscaMapa(nombreProvincia) {
  let ProvEncontrado = provinciasSVG.find(provincia => provincia.provincia.toUpperCase() === nombreProvincia.toUpperCase());
  return ProvEncontrado.svg
}

function agregarAInforme() {
  let nuevaCadenaValores = `{periodosSelect}, {valorTipoEleccion}, {valorCargo}, {valorDistrito}, {valorSeccion}, {valorSvg}, {valorCantidadElectores}, {valorMesasTotalizadas}, {valorParticipacionPorcentaje}`//? Crea la lista de todosl lso valores filtrados.
  const listaInforme = []
  if (cadenaNuevaLsita. )
  const LISTA_A_AGREGAR_JSON = JSON.stringify(cadenaLsita) //?combierte la lista en una cadena.
  localStorage.setItem(`INFORMES`, LISTA_A_AGREGAR_JSON)//?guarda la lista/cadena en la key INFORMES
//borre la cadena cadena porque ya tengo una
//!!Coreegir lo de aabajo
  let informes = [];

  if (localStorage.getItem('INFORMES')) {
      informes = JSON.parse(localStorage.getItem('INFORMES'));
  }

  

  if (informes.includes(nuevoInforme)) {
      mostrarMensaje(mensajeAmarillo, "El informe ya se encuentra añadido.");
  } else {
      informes.push(nuevoInforme);
      localStorage.setItem('INFORMES', JSON.stringify(informes));
      mostrarMensaje(mensajeVerde, "Informe agregado con éxito");
  }
}





}
// fetch(periodosURL)
//   .then((res) => res.json())
//   .then((res) => {
//     console.log(res);
//     //-------------- año ----------------------------
//     res.forEach((anio) => {
//       const nuevaOption = document.createElement("option");
//       nuevaOption.value = anio;
//       nuevaOption.innerHTML = ` ${anio}`;
//       $selectAnio.appendChild(nuevaOption);

//     });
//     // Asigna el elemento select a la variable periodosSelect
//     periodosSelect = $selectAnio;
//     periodosSelect.addEventListener("change", function () {
//       console.log(periodosSelect.value);
//       //-------------- Cargo ----------------------------
//       mostrarMensaje($msjVerdeExito)

//       fetch(cargoURL + periodosSelect.value)
//         .then((res) => res.json(res))
//         .then((datosFiltros) => {
//           console.log(datosFiltros)
//           console.log("ACAAAA")

//           while ($selectCargo.firstChild) {
//             //elimina todos los elementos
//             $selectCargo.removeChild($selectCargo.firstChild);
//           }
//           const nuevaOptionCargo = document.createElement("option");
//           nuevaOptionCargo.textContent = "Cargo";
//           nuevaOptionCargo.value = "Cargo";
//           $selectCargo.appendChild(nuevaOptionCargo);
//           datosFiltros.forEach((eleccion) => {
//             console.log("ELECCIONES ")
//             console.log(eleccion)
//             if (eleccion.IdEleccion == tipoEleccion) {
//               eleccion.Cargos.forEach((cargo) => {
//                 console.log("cargo")
//                 console.log(cargo)

//                 const nuevaOption = document.createElement("option");
//                 nuevaOption.value = cargo.IdCargo;
//                 nuevaOption.innerHTML = `${cargo.Cargo}`;
//                 console.log(cargo);
//                 $selectCargo.appendChild(nuevaOption);
//               });
//             }
//           });

//           //-------------- Distrito ----------------------------
//           // corregir no filtra bien
//           cargoSelect = $selectCargo
//           cargoSelect.addEventListener("change", function () {
//             console.log(cargoSelect.value);
//             alert(cargoSelect.value);
//             while ($selectDistrito.firstChild) {
//               //elimina todos los elementos
//               $selectDistrito.removeChild($selectDistrito.firstChild);
//             }
//             const nuevaOptionDistrito = document.createElement("option");
//             nuevaOptionDistrito.textContent = "Distrito";
//             nuevaOptionDistrito.value = "Distrito";
//             $selectDistrito.appendChild(nuevaOptionDistrito);
//             datosFiltros.forEach((eleccion) => {

//               if (eleccion.IdEleccion == tipoEleccion) {
//                 eleccion.Cargos.forEach((cargo) => {
//                   console.log(cargoSelect.value);
//                   console.log(cargo.value);
//                   cargo.Distritos.forEach((distrito) => {
//                     console.log("distrito ")
//                     console.log(distrito)
//                     const nuevaOption = document.createElement("option");
//                     nuevaOption.value = distrito.IdDistritos;

//                     nuevaOption.innerHTML = `${distrito.Distrito}`;

//                     console.log(cargo);
//                     $selectDistrito.appendChild(nuevaOption);
//                   });

//                 });
//               }
//             });
//           });
//         });

//     });
//   });

function mostrarMensaje(msj, cadena, tiempo = 4000) {
  msj.querySelector(`.mensaje`).textContent = cadena;
  msj.classList.remove("escondido");
  setTimeout(() => {
    msj.classList.add("escondido");
  }, tiempo);
}

function borrarHijos(padre) {
  let cantHijos = padre.options.length
  for (let i = 1; i <= cantHijos; i++) {
    padre.remove(1)
  }
}

function borrarTodosLosHijos() {
  borrarHijos($selectCargo)
  borrarHijos($selectDistrito)
  borrarHijos($seccionSelect)
}
function resetFiltro() {
  periodosSelect = ""
  cargoSelect = ""
  distritoSelect = ""
  seccionSeleccionadaID = ""
  idSeccionProv = ""
}


function reconoceTipoElecion() {
  if (tipoEleccion === 1) {
    valorTipoEleccion = "Pasos"
  }
  else {
    valorTipoEleccion = "Generales"
  }
}