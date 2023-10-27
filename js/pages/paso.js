

const tipoEleccion = 1;
const tipoRecuento = 1;
fetch("https://resultados.mininterior.gob.ar/api/menu/periodos")
        .then(res=> res.json(res))
        .then((res) => {           
                    var selectAnio = document.getElementById("anio");
                     res.forEach(anio => {
                        
                         const  nuevaOption= document.createElement("option");
                         nuevaOption.textContent = anio;

                         nuevaOption.innerHTML = `
                         ${anio}
                        `;
                        nuevaOption.value= anio
                        selectAnio.appendChild(nuevaOption);

                        console.log(nuevaOption.value)
                     });
                     onsole.log(nuevaOption.value) //no me toma el valor de nuevaOption
                         fetch("https://resultados.mininterior.gob.ar/api/menu?año=" + anio) 
                         .then(res=> res.json(res))
                         .then((res) => {
                                     const selectAnio = document.getElementById("cargo");
                                     res.forEach(cargo => {
                                         const  nuevaOption= document.createElement("option");
                                         nuevaOption.textContent = cargo;
                                         selectAnio.appendChild(nuevaOption);
                                         nuevaOption.innerHTML = `
                                         <option value="${cargo}" >${cargo}</option> 
                                         `;
                                         console.log()
                                     });
                               } )  
                    
              } )  

                           