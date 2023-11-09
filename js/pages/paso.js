const periodosURL = "https://resultados.mininterior.gob.ar/api/menu/periodos";
const cargoURL = "https://resultados.mininterior.gob.ar/api/menu?año=";

//Se usa el $ para poder distingir con mayor facilidad los elementos directos del DOM
const $selectAnio = document.getElementById("anio");
const $selectCargo = document.getElementById("cargo");
const $selectDistrito = document.getElementById("distrito");
const $seccionSelect = document.getElementById("seccion");
const $inputSeccionProvincial = document.getElementById("hdSeccionProvincial")
const $botonFiltrar = document.getElementById('filtrar')
const $msjRojoError = document.getElementById("error")
const $msjVerdeExito = document.getElementById("exito")
const $msjAmarilloAdver = document.getElementById("adver")

const $mesasComputadasSpan = document.getElementById("mesas-computadas-porsen")

//!Guardamos los datos a medida que se van filtrando en estas Variables
let periodosSelect =""
let cargoSelect = ""
let distritoSelect = ""
let seccionSeleccionada = ""

const tipoEleccion = 1;
const tipoRecuento = 1;

fetch(periodosURL)
  .then((res) => res.json())
  .then((res) => {
    console.log(res);
    //-------------- año ----------------------------
    res.forEach((anio) => {
      const nuevaOption = document.createElement("option");
      nuevaOption.value = anio;
      nuevaOption.innerHTML = ` ${anio}`;
      $selectAnio.appendChild(nuevaOption);
      
    });
    // Asigna el elemento select a la variable periodosSelect
    periodosSelect = $selectAnio;
    periodosSelect.addEventListener("change", function () {
      console.log(periodosSelect.value);
      //-------------- Cargo ----------------------------
    mostrarMensaje($msjVerdeExito)

      fetch(cargoURL + periodosSelect.value)
        .then((res) => res.json(res))
        .then((datosFiltros) => {
          console.log(datosFiltros)
          while ($selectCargo.firstChild) {
            //elimina todos los elementos
            $selectCargo.removeChild($selectCargo.firstChild);
          }
          const nuevaOptionCargo = document.createElement("option");
          nuevaOptionCargo.textContent = "Cargo";
          nuevaOptionCargo.value = "Cargo";
          $selectCargo.appendChild(nuevaOptionCargo);
          datosFiltros.forEach((eleccion) => {
            console.log("ELECCIONES ")
            console.log(eleccion)
            if (eleccion.IdEleccion == tipoEleccion) {
              eleccion.Cargos.forEach((cargo) => {
                console.log("cargo")
                console.log(cargo)

                const nuevaOption = document.createElement("option");
                nuevaOption.value = cargo.IdCargo;
                nuevaOption.innerHTML = `${cargo.Cargo}`;
                console.log(cargo);
                $selectCargo.appendChild(nuevaOption);
              });
            }
          });

          //-------------- Distrito ----------------------------
          // corregir no filtra bien
          cargoSelect = $selectCargo
          cargoSelect.addEventListener("change", function () {
            console.log(cargoSelect.value);
            alert(cargoSelect.value);
            while ($selectDistrito.firstChild) {
              //elimina todos los elementos
              $selectDistrito.removeChild($selectDistrito.firstChild);
            }
            const nuevaOptionDistrito = document.createElement("option");
            nuevaOptionDistrito.textContent = "Distrito";
            nuevaOptionDistrito.value = "Distrito";
            $selectDistrito.appendChild(nuevaOptionDistrito);
            datosFiltros.forEach((eleccion) => {

              if (eleccion.IdEleccion == tipoEleccion) {
                eleccion.Cargos.forEach((cargo) => {
                  console.log(cargoSelect.value);
                  console.log(cargo.value);
                  cargo.Distritos.forEach((distrito) => {
                    console.log("distrito ")
                    console.log(distrito)
                    const nuevaOption = document.createElement("option");
                    nuevaOption.value = distrito.IdDistritos;

                    nuevaOption.innerHTML = `${distrito.Distrito}`;

                    console.log(cargo);
                    $selectDistrito.appendChild(nuevaOption);
                  });

                });
              }
            });
          });
        });

    });
  });


function mostrarMensaje(msj) {
  msj.classList.remove("escondido");
  setTimeout(() => {
    msj.classList.add("escondido");
  }, 4000);
}