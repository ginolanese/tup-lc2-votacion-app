const periodosURL = "https://resultados.mininterior.gob.ar/api/menu/periodos";
const cargoURL = "https://resultados.mininterior.gob.ar/api/menu?año=";


const tipoEleccion = 1;
const tipoRecuento = 1;
var periodosSelect; // Declaración de la variable periodosSelect
var cargoSelect;
fetch(periodosURL)
  .then((res) => res.json())
  .then((res) => {
    console.log(res);
    //-------------- año ----------------------------
    var selectAnio = document.getElementById("anio");
    res.forEach((anio) => {
      const nuevaOption = document.createElement("option");
      nuevaOption.value = anio;
      nuevaOption.innerHTML = `
                               ${anio}
                               `;
      selectAnio.appendChild(nuevaOption);
    });

    // Asigna el elemento select a la variable periodosSelect
    periodosSelect = selectAnio;
    periodosSelect.addEventListener("change", function () {
      console.log(periodosSelect.value);
      //-------------- Cargo ----------------------------

      fetch(cargoURL + periodosSelect.value)
        .then((res) => res.json(res))
        .then((datosFiltros) => {
          console.log(datosFiltros)
          const selectCrgo = document.getElementById("cargo");
          while (selectCrgo.firstChild) {
            //elimina todos los elementos
            selectCrgo.removeChild(selectCrgo.firstChild);
          }
          const nuevaOptionCargo = document.createElement("option");
          nuevaOptionCargo.textContent = "Cargo";
          nuevaOptionCargo.value = "Cargo";
          selectCrgo.appendChild(nuevaOptionCargo);
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
                selectCrgo.appendChild(nuevaOption);
              });
            }
          });

          //-------------- Distrito ----------------------------
          // corregir no filtra bien
          cargoSelect = selectCrgo
          cargoSelect.addEventListener("change", function () {
            console.log(cargoSelect.value);
            alert(cargoSelect.value);
            const selectDistrito = document.getElementById("distrito");
            while (selectDistrito.firstChild) {
              //elimina todos los elementos
              selectDistrito.removeChild(selectDistrito.firstChild);
            }
            const nuevaOptionDistrito = document.createElement("option");
            nuevaOptionDistrito.textContent = "Distrito";
            nuevaOptionDistrito.value = "Distrito";
            selectDistrito.appendChild(nuevaOptionDistrito);
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
                    selectDistrito.appendChild(nuevaOption);
                  });

                });
              }
            });
          });
        });

    });
  });

