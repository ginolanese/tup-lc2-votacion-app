import { provinciasSVG } from "./mapas.js"
/// COLORES DE ABRUPASIONES ///
const coloresAgrupaciones = [
    { idAgrupacion: "132", colorPleno: 'var(--grafica-amarillo)', colorLiviano: ' var(--grafica-amarillo-claro)' }, // --grafica-amarillo
    { idAgrupacion: "134", colorPleno: 'var(--grafica-celeste)', colorLiviano: 'var(--grafica-celeste-claro)' }, // --grafica-celeste
    { idAgrupacion: "136", colorPleno: 'var(--grafica-bordo)', colorLiviano: 'var(--grafica-bordo-claro)' }, // --grafica-bordo
    { idAgrupacion: "135", colorPleno: 'var(--grafica-lila)', colorLiviano: ' var(--grafica-lila-claro)' }, // --grafica-lila
    { idAgrupacion: "133", colorPleno: 'var(--grafica-lila2)', colorLiviano: 'var(--grafica-lila2-claro)' }, // --grafica-lila2
    { idAgrupacion: "1", colorPleno: 'var(--grafica-verde)', colorLiviano: 'var(--grafica-verde-claro)' }, // --grafica-gris
    { idAgrupacion: "131", colorPleno: 'rgb(102, 171, 60)', colorLiviano: 'rgba(102, 171, 60, 0.5)' }, // --grafica-verde
];
///////////////////////////////
const periodosURL = "https://resultados.mininterior.gob.ar/api/menu/periodos";
const cargoURL = "https://resultados.mininterior.gob.ar/api/menu?año=";
const getResultados = "https://resultados.mininterior.gob.ar/api/resultados/getResultados"
const tipoEleccion = 2; // 1 para PASO, 2 para GENERALES
const tipoRecuento = 1;



let textiCargo = ""
let textoDistrito = ""
let textoSeccion = ""

//
let seccionProvincial
let seccionProvincialId
let valoresTotalizadosPositivos

let periodosSelect = "";
let cargoSelect = "";
let distritoSelect = ""
let seccionSelect = ""
//
let cantidadElectores
let mesasTotalizadas
let participacionPorcentaje
let guardarSVG
// ID de cargo para filtrar
const $selectAnio = document.getElementById("anio");
const $selectCargo = document.getElementById("cargo");
const $selectDistrito = document.getElementById("distrito");
const $selectSeccion = document.getElementById("seccion");
const $inputSeccionProvincial = document.getElementById("hdSeccionProvincial");//!esta oculto para el usuario y solo guarda IDSecccionProvincial
//mensajes
const $mensajeRojo = document.getElementById("error");
const $mesajeVerde = document.getElementById("exito");
const $mesajeAmarillo = document.getElementById("adver");

// Subtitulos - Contenido - 
const $tituloSubTitulo = document.querySelector("#sec-titulo");
const $seccionContenido = document.getElementById("sec-contenido");
//Mesas - Electores - Escrutiados
const $mesasComputadas = document.getElementById("mesas-computadas-porsen");
const $cajaElectores = document.getElementById("electores");
const $participacion = document.getElementById("sobre-recuento");

//Filtrar
const $botonFiltrar = document.getElementById('filtrar');
//SVG
const $spanMapaSvg = document.querySelector("#svg-mapa");
const $cuadros = document.querySelector(".cuadros");

//AGREGAR INFORME
const $btnAgregarInforme = document.querySelector(".agregar-informe");
//"cuadros"
const $cuadroAgrupaciones = document.getElementById('cuadroAgrupaciones');
//BARRAS
const $cuadroBarras = document.getElementById("barras");
//
document.addEventListener("DOMContentLoaded", () => {
    mostrarMensaje($mesajeAmarillo, `Debe seleccionar los valores a filtrar y hacer clic en el botón FILTRAR`);
    seleccionAnio();  // Llamar directamente a la función al cargar el DOM
});

// Event Listeners

$selectAnio.addEventListener("change", seleccionCargo);
$selectCargo.addEventListener("change", seleccionDistrito);
$selectDistrito.addEventListener("change", seleccionSeccion)
$selectSeccion.addEventListener('change', () => {
    let opcionSeleccionada = $selectSeccion.options[$selectSeccion.selectedIndex];
    textoSeccion = opcionSeleccionada.textContent; // el texto de la opción seleccionada
    console.log(`AÑO: ${periodosSelect} | CARGO: ${textiCargo} | DISTRITO: ${textoDistrito} | SECCION:${textoSeccion}`);
});
$botonFiltrar.addEventListener('click', filtrar);
let guardado_datos = []
let eleccion_JSON
// Cargar años
function seleccionAnio() {
    console.log(" ----INICIA LA FUNCIÓN DE seleccionAnio---- ");

    borrarHijos($selectAnio);
    periodosSelect = "";
    cargoSelect = "";
    distritoSelect = "";
    seccionSelect = "";

    textiCargo = ""
    textoDistrito = ""
    textoSeccion = ""
    mostrarValorFiltro()
    fetch(periodosURL)
        .then((respuesta) => {
            if (respuesta.ok) {
                console.log("----Json, Año para Año----");
                return respuesta.json();
            } else {
                mostrarMensaje($mensajeRojo, "Error al cargar los periodos");
                throw new Error("Error al cargar los periodos");
            }
        })
        .then((anios) => {
            console.log(anios);
            anios.forEach((anio) => {
                const nuevaOption = document.createElement("option");
                nuevaOption.value = anio;
                nuevaOption.innerHTML = ` ${anio}`;
                $selectAnio.appendChild(nuevaOption);
            });

        })
        .catch((error) => {
            console.log(error);
            mostrarMensaje($mensajeRojo, "Error al cargar los periodos");
        });
}

// Cargar cargos según el año seleccionado
function seleccionCargo() {
    console.log(" ----INICIA LA FUNCIÓN DE seleccionCargo---- ");
    borrarHijos($selectCargo);
    borrarHijos($selectDistrito)
    borrarHijos($selectSeccion)
    cargoSelect = ""
    periodosSelect = $selectAnio.value; // Guardamos el año seleccionado
    console.log(periodosSelect)

    mostrarValorFiltro()
    fetch(cargoURL + periodosSelect)
        .then((respuesta) => {
            if (respuesta.ok) {
                console.log("----Json, Año para Cargos----");
                return respuesta.json();
            } else {
                mostrarMensaje($mensajeRojo, "Error al cargar los cargos");
                throw new Error("Error al cargar los cargos");
            }
        })
        .then((data) => {
            // Filtramos los cargos por tipo de elección
            data.forEach((cargo) => {
                if (cargo.IdEleccion == tipoEleccion) {
                    cargo.Cargos.forEach((cargoData) => {
                        const nuevaOption = document.createElement("option");
                        nuevaOption.value = cargoData.IdCargo;
                        nuevaOption.innerHTML = `${cargoData.Cargo}`;
                        $selectCargo.appendChild(nuevaOption);
                    });
                }
            });
            eleccion_JSON = data
        })
        .catch((error) => {
            console.log(error);
            mostrarMensaje($mensajeRojo, "Error al cargar los cargos");
        });
}

// Lógica para cargar distritos
function seleccionDistrito() {

    borrarHijos($selectDistrito)
    borrarHijos($selectSeccion)
    mostrarValorFiltro()
    cargoSelect = ""
    cargoSelect = $selectCargo.value
    console.log(cargoSelect)

    console.log(" ----INICIA el FUN DE seleccionDistrito---- ")
    eleccion_JSON.forEach(
        (eleccion) => {
            if (eleccion.IdEleccion == tipoEleccion) {//?Se selecciona el tipo 2 de todos los cargos
                eleccion.Cargos.forEach((cargo) => { //se recorre todo el json()
                    if (cargo.IdCargo == cargoSelect) {
                        textiCargo = `${cargo.Cargo}`
                        cargo.Distritos.forEach((distrito) => {
                            console.log(distrito);
                            const nuevaOption = document.createElement("option"); //? Se Crea una etiqueta <opcion> se le agrega el value y su texto
                            nuevaOption.value = distrito.IdDistrito;
                            nuevaOption.innerHTML = `${distrito.Distrito}`;
                            $selectDistrito.appendChild(nuevaOption)
                        })

                    }
                }
                )
            }
        }
    );
    console.log(" ----FINALIZA la FUN DE seleccionDistrito---- ")
}


function seleccionSeccion() {
    console.log(" ----INICIA LA FUN de seleccionSeccionProv---- ")
    distritoSelect = $selectDistrito.value;
    console.log()
    borrarHijos($selectSeccion);
    mostrarValorFiltro()

    eleccion_JSON.forEach((eleccion) => {
        if (eleccion.IdEleccion == tipoEleccion) {  //?Se selecciona el tipo 1 de todos los cargos
            eleccion.Cargos.forEach((cargo) => { //se recorre todo el json()
                if (cargo.IdCargo == cargoSelect) { //? Se selecciona el cargo anteriormente seleccionado.
                    cargo.Distritos.forEach((distrito) => {
                        if (distrito.IdDistrito == distritoSelect) {
                            textoDistrito = `${distrito.Distrito}`
                            console.log("##################")
                            console.log(distrito)
                            console.log("##################")
                            distrito.SeccionesProvinciales.forEach((seccionProv) => {
                                // if (!seccionProv.IDSeccionProvincial) {
                                seccionProvincial = `${seccionProv.SeccionProvincial}`;
                                console.log("******* seccionProvincial")
                                console.log(seccionProvincial);
                                console.log("******* seccionProvincialId")
                                $inputSeccionProvincial.value = seccionProv.IDSeccionProvincial;
                                console.log(seccionProvincialId);
                                // } else {
                                //     seccionProvincial = null
                                //     seccionProvincialId = null
                                // }
                                seccionProv.Secciones.forEach((seccion) => {
                                    console.log("----Json Selecciones Provinciales para Secciones----")
                                    //console.log(seccion)

                                    const nuevaOption = document.createElement("option");
                                    nuevaOption.value = seccion.IdSeccion;
                                    nuevaOption.innerHTML = `${seccion.Seccion}`;
                                    $selectSeccion.appendChild(nuevaOption)
                                })
                            })
                        }
                    })
                }
            })
        }

    })

    console.log(" ----FINALIZA LA FUN ASYNC DE seleccionSeccionProv---- ")

}

//Funcion filtrar
function filtrar() {
    seccionSelect = ""
    seccionSelect = $selectSeccion.value;
    console.log(`AÑO: ${periodosSelect} | CARGO: ${textiCargo} | DISTRITO: ${textoDistrito} | SECCION:${textoSeccion}`);
    console.log(periodosSelect + " " + cargoSelect + " " + distritoSelect + " " + seccionSelect);

    // Validación de los campos
    if (!periodosSelect || !cargoSelect || !distritoSelect || seccionSelect === "none") {
        // Nota: Aquí se asegura que seccionSelect no sea vacío
        mostrarMensaje($mesajeAmarillo, "Por favor seleccione todos los campos requeridos.");


    } else {

        let p = `ANIO =  ${periodosSelect} - TIPO RECUENTO = ${tipoRecuento} - TIPO ELECCION =  ${tipoEleccion} - CARGO = ${cargoSelect} - DISTRITO = ${distritoSelect} - Seccion Provincial ID = ${seccionProvincialId} - Sesscon ID = ${seccionSelect} `;
        console.log(p)
        console.log(`?anioEleccion=${periodosSelect}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${cargoSelect}&distritoId=${distritoSelect}&seccionProvincialId=${$inputSeccionProvincial.value}&seccionId=${seccionSelect}&circuitoId=&mesaId=`)
        let consultaCompleta
        if (!$inputSeccionProvincial.value) {
            consultaCompleta = getResultados + `?anioEleccion=${periodosSelect}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${cargoSelect}&distritoId=${distritoSelect}&seccionProvincialId=${$inputSeccionProvincial.value}&seccionId=${seccionSelect}&circuitoId=&mesaId=`
            //alert("VERDE")
        }
        else {
            //alert("ROJO")
            consultaCompleta = getResultados + `?anioEleccion=${periodosSelect}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${cargoSelect}&distritoId=${distritoSelect}&seccionProvincialId=&seccionId=${seccionSelect}&circuitoId=&mesaId=`
        }
        fetch(consultaCompleta)
            .then((respuesta) => {
                if (respuesta.ok) {
                    console.log("----Json, Año para Cargos----");
                    return respuesta.json();
                }
            })
            .then((datos) => {
                console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                console.log(datos);


                console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                $tituloSubTitulo.querySelector("h1").textContent = `Elecciones ${periodosSelect} | ${tipoEleccion == 1 ? "Pasos" : "Generales"}`;
                $tituloSubTitulo.querySelector("p").textContent = `${periodosSelect} > ${tipoEleccion == 1 ? "Pasos" : "Generales"} > ${textiCargo} > ${textoDistrito} > ${textoSeccion}`;

                console.log("CANTIDAD DE ELECTORES ");
                console.log(datos.estadoRecuento);
                cantidadElectores = datos.estadoRecuento.cantidadElectores
                mesasTotalizadas = datos.estadoRecuento.mesasTotalizadas
                participacionPorcentaje = datos.estadoRecuento.participacionPorcentaje
                $cajaElectores.textContent = cantidadElectores;
                $mesasComputadas.textContent = mesasTotalizadas;
                $participacion.textContent = participacionPorcentaje + "%";

                valoresTotalizadosPositivos = datos.valoresTotalizadosPositivos
                console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                console.log(valoresTotalizadosPositivos)
                console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");


                console.log("------------------- MAPAS -----------------------");
                console.log(provinciasSVG);
                console.log("DISTRITO A COMPARAR = " + textoDistrito);
                let svgEncontrado = provinciasSVG.find(provinciaSVG => provinciaSVG.provincia.toUpperCase() == textoDistrito.toUpperCase());
                let svgEncontradoProvincia = svgEncontrado.provincia
                console.log(svgEncontradoProvincia)

                // Opcional: Mostrar la sección o realizar alguna acción
                guardarSVG = svgEncontrado.svg
                $spanMapaSvg.innerHTML = guardarSVG
                console.log(svgEncontrado.svg)
                console.log($spanMapaSvg)
                $seccionContenido.classList.remove("escondido");
                $tituloSubTitulo.classList.remove("escondido");
                $cuadros.classList.remove("escondido")
                mostrarMensaje($mesajeVerde, "¡Todos los campos fueron seleccionados correctamente!");
                segundaParte(datos)
            }).catch(() =>
                mostrarMensaje($mensajeRojo, "Error: El servicio se a caido. Intente mas tarde")
            )
    }
}

// Limpiar opciones del select
function borrarHijos(padre) {
    while (padre.options.length > 1) {
        padre.remove(1);
    }
}

// Función para mostrar mensajes
function mostrarMensaje(msj, cadena, tiempo = 4000) {
    msj.querySelector(".mensaje").textContent = cadena;
    msj.classList.remove("escondido");
    setTimeout(() => {
        msj.classList.add("escondido");
    }, tiempo);
}

function mostrarValorFiltro() {
    console.log("Filtros:  " + periodosSelect + " " + cargoSelect + " " + distritoSelect + " " + seccionSelect)
}

$btnAgregarInforme.addEventListener("click", () => {
    let nuevoArrayLS = `|${periodosSelect}|${tipoRecuento}|${tipoEleccion}|${cargoSelect}|${distritoSelect}|${$inputSeccionProvincial.value}|${seccionSelect}|${""}|${""}|${textiCargo}|${textoDistrito}|${textoSeccion}|${tipoEleccion == 1 ? "Pasos" : "Generales"}|${guardarSVG}|${cantidadElectores}|${mesasTotalizadas}|${participacionPorcentaje}`

    if (localStorage.getItem('INFORMES')) {
        guardado_datos = JSON.parse(localStorage.getItem('INFORMES'));
    }
    if (guardado_datos.includes(nuevoArrayLS)) {
        mostrarMensaje($mesajeAmarillo, "El informe ya se encuentra añadido.");
    } else {
        guardado_datos.push(nuevoArrayLS);
        localStorage.setItem('INFORMES', JSON.stringify(guardado_datos));
        mostrarMensaje($mesajeVerde, "Informe agregado con exito");
    }
});

/// #######################################              PARTE 2             ##############################################################


function segundaParte(data) {
    console.log("/\/\/\/\/\/\/\/\/\   PARTE 2 /\/\/\/\/\/\/\/\/\/");
    console.log(data);
    console.log($cuadroAgrupaciones);
    console.log($cuadroBarras);
    console.log(data.valoresTotalizadosPositivos
    );
    console.log(coloresAgrupaciones)

    let creandoAgrupaciones = "";
    let creandoBarras = "";
    let contadorBarras = 0;
    data.valoresTotalizadosPositivos.forEach((dato) => {
        console.log("#############");
        let id_aux = dato.idAgrupacion;
        let lor = coloresAgrupaciones.find(col => col.idAgrupacion == id_aux);
        console.log(lor);
        if (lor == undefined) {
            creandoAgrupaciones += `<div class="Agrupacion">
            <p>${dato.nombreAgrupacion}</p>
            <div class="progress" style="background: var(--grafica-gris-claro);">
                <div class="progress-bar" style="width:${dato.votosPorcentaje}%; background: var(--grafica-gris);">
                    <span class="progress-bar-text">${dato.votosPorcentaje}%</span>
                </div>
            </div>
            </div> `

            if (contadorBarras < 7) {
                contadorBarras += 1
                creandoBarras += `<div class="bar" id="partido-uno" style="--bar-value:${dato.votosPorcentaje}%;background: var(--grafica-gris-claro);" data-name="${dato.nombreAgrupacion}"
                                   title="Your Blog ${dato.nombreAgrupacion}"></div>`;
            }

        } else {
            creandoAgrupaciones += `<div class="Agrupacion"><p>${dato.nombreAgrupacion}</p>
            <div class="progress" style="background: ${lor.colorLiviano};">
                <div class="progress-bar" style="width:${dato.votosPorcentaje}%; background:${lor.colorPleno};">
                    <span class="progress-bar-text">${dato.votosPorcentaje}%</span>
                </div>
            </div>
            </div> `

            if (contadorBarras < 7) {
                contadorBarras += 1
                creandoBarras += `<div class="bar"  style="--bar-value:${dato.votosPorcentaje}%;background:${lor.colorPleno}" data-name="${dato.nombreAgrupacion}"
                                   title="Your Blog ${dato.nombreAgrupacion}"></div>`;
            }
        }

        $cuadroAgrupaciones.innerHTML = ` ${creandoAgrupaciones} `;
        $cuadroBarras.innerHTML = `${creandoBarras}`
    })





}