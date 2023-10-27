
const tipoEleccion = 1;
const tipoRecuento = 1;
var periodosSelect; // Declaración de la variable periodosSelect
fetch("https://resultados.mininterior.gob.ar/api/menu/periodos")
    .then((res) => res.json())
    .then((res) => {
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
            console.log(periodosSelect.value)
            fetch("https://resultados.mininterior.gob.ar/api/menu?año=" +  periodosSelect.value)
            .then(res=> res.json(res))
            .then((datosFiltros) => {
                          const selectCrgo = document.getElementById("cargo");
                          while(selectCrgo.firstChild){//elimina todos los elementos 
                            selectCrgo.removeChild(selectCrgo.firstChild);
                            } 
                            const nuevaOptionCargo = document.createElement("option");
                            nuevaOptionCargo.textContent = "Cargo";
                            nuevaOptionCargo.value = "Cargo";
                            selectCrgo.appendChild(nuevaOptionCargo);
                            datosFiltros.forEach(eleccion => {

                            if (eleccion.IdEleccion == tipoEleccion){
                                eleccion.Cargos.forEach((cargo) => { 
                                    const  nuevaOption= document.createElement("option");
                                    nuevaOption.value = cargo.IdCargos;
                                    selectCrgo.appendChild(nuevaOption);
                                    nuevaOption.innerHTML = `
                                                                ${cargo.Cargo}
                                                            `;
                                    console.log(cargo);
                                });
                            }
                           
                          });
                    } )  
            
        })
    });
