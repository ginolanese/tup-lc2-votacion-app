
const tipoEleccion = 1;
const tipoRecuento = 1;
var periodosSelect; // Declaración de la variable periodosSelect
fetch("https://resultados.mininterior.gob.ar/api/menu/periodos")
    .then((res) => res.json())
    .then((res) => {
        var selectAnio = document.getElementById("anio");
        res.forEach((anio) => {
            const nuevaOption = document.createElement("option");
            nuevaOption.textContent = anio;
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
                          datosFiltros.forEach(eleccion => {
                            if (eleccion.IdEleccion == tipoEleccion){
                                eleccion.Cargos.forEach((cargo) => { 
                                    const  nuevaOption= document.createElement("option");
                                    nuevaOption.textContent = cargo.Cargo ;
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
