
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
            selectAnio.appendChild(nuevaOption);
        });

        // Asigna el elemento select a la variable periodosSelect
        periodosSelect = selectAnio;
        periodosSelect.addEventListener("change", function () {
            console.log(periodosSelect.value)
            fetch("https://resultados.mininterior.gob.ar/api/menu?año=" +   periodosSelect.value)
            .then(res=> res.json(res))
            .then((datosFiltros) => {
                          const selectAnio = document.getElementById("cargo");
                          datosFiltros.forEach(eleccion => {
                            if (eleccion.IdEleccion == tipoEleccion){
                                alert("se encontro");
                                console.log(eleccion.IdEleccion)
                                
                            }
                            console.log(eleccion)
                            //   const  nuevaOption= document.createElement("option");
                            //   nuevaOption.textContent = eleccion;
                            //   selectAnio.appendChild(nuevaOption);
                            //   nuevaOption.innerHTML = `
                            //   <option value="${eleccion.Cargos}" >${eleccion.Cargos[1].Cargo}</option> 
                            //   `;
                            //   console.log(cargo);
                          });
                    } )  
            
        })
    });
