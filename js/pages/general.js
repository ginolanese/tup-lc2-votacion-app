const tipoEleccion = 1;
const tipoRecuento = 1;
var periodosSelect;
fetch("https://resultados.mininterior.gob.ar/api/menu/periodos")
        .then(res=> res.json(res))
        .then((res) => {
                    periodosSelect=res;
                    
                    const selectAnio = document.getElementById("anio");
                    periodosSelect.forEach(anio => {

                        const  nuevaOption= document.createElement("option");
                        nuevaOption.textContent = anio;
                        selectAnio.appendChild(nuevaOption);
                        nuevaOption.innerHTML = `
                        <option value="none-${anio}" >${anio}</option> 
                        `
                    });

            
                } )  
fetch("https://resultados.mininterior.gob.ar/api/menu?año=" + periodosSelect.value) 
                        .then(res=> res.json(res))
                        .then((res) => {console.log(res)} )
                        .catch((error) => {(console.error(error))} )
