import fs from "node:fs/promises";

async function extraerDatos() {
    const contenido = await fs.readFile("envios.json", "utf-8");
    const enviosArray = JSON.parse(contenido);
    return enviosArray;
}

async function procesarEnvios(enviosArray) {
    let arrayValidos = []
    let arrayErrores = []

    for (let envio of enviosArray) {
        const estadosValidos = ["Preparando", "En tránsito", "Entregado", "Cancelado"]

        if (!Number.isInteger(envio.id) || envio.id === "" || envio.id < 0) {
            arrayErrores.push(envio)
            continue
        }
        if (typeof envio.cliente !== "string" || envio.cliente === "") {
            arrayErrores.push(envio)
            continue
        }
        if (typeof envio.ciudad_origen !== "string" || envio.ciudad_origen === "") {
            arrayErrores.push(envio)
            continue
        }
        if (typeof envio.ciudad_destino !== "string" || envio.ciudad_destino === "") {
            arrayErrores.push(envio)
            continue
        }
        if (typeof envio.peso_kg !== "number" || envio.peso_kg <= 0) {
            arrayErrores.push(envio)
            continue
        }
        if(typeof envio.costo !== "number" || envio.costo <= 0){
            arrayErrores.push(envio)
            continue
        }
        if(typeof envio.estado !== "string" || !estadosValidos.includes(envio.estado)){
            arrayErrores.push(envio)
            continue
        }
        
    }
    }


    console.log(await extraerDatos());








