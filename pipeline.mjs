import fs from "node:fs/promises";

async function extraerDatos() {
  const contenido = await fs.readFile("envios.json", "utf-8");
  const enviosArray = JSON.parse(contenido);
  return enviosArray;
}

async function procesarEnvios(enviosArray) {
  let arrayValidos = [];
  let arrayErrores = [];
  let idVistos = [];

  const estadosValidos = [
    "Preparando",
    "En tránsito",
    "Entregado",
    "Cancelado",
  ];
  const enviosValidos = ["Estándar", "Express", "Prioritario", "Ultra rápido"];

  for (let envio of enviosArray) {
    if (
      !Number.isInteger(envio.id) ||
      envio.id < 0 ||
      idVistos.includes(envio.id)
    ) {
      arrayErrores.push(envio);
      continue;
    }
    idVistos.push(envio.id);

    if (typeof envio.cliente !== "string" || envio.cliente === "") {
      arrayErrores.push(envio);
      continue;
    }

    if (typeof envio.ciudad_origen !== "string" || envio.ciudad_origen === "") {
      arrayErrores.push(envio);
      continue;
    }

    if (
      typeof envio.ciudad_destino !== "string" ||
      envio.ciudad_destino === ""
    ) {
      arrayErrores.push(envio);
      continue;
    }
    if (typeof envio.peso_kg !== "number" || envio.peso_kg <= 0) {
      arrayErrores.push(envio);
      continue;
    }
    if (typeof envio.costo !== "number" || envio.costo <= 0) {
      arrayErrores.push(envio);
      continue;
    }
    if (
      typeof envio.estado !== "string" ||
      !estadosValidos.includes(envio.estado)
    ) {
      arrayErrores.push(envio);
      continue;
    }

    if (
      typeof envio.tipo_envio !== "string" ||
      !enviosValidos.includes(envio.tipo_envio)
    ) {
      arrayErrores.push(envio);
      continue;
    }
    if (typeof envio.fecha !== "string" || envio.fecha === "") {
      arrayErrores.push(envio);
      continue;
    }
    arrayValidos.push(envio);
  }
  return {
    validos: arrayValidos,
    noValidos: arrayErrores,
  };
}

function transformarDatos(datosProcesados) {
  let enviosTransformados = [];

  for (let envio of datosProcesados) {
    envio.cliente = envio.cliente.toUpperCase().trim();
    envio.ciudad_origen = envio.ciudad_origen.toUpperCase().trim();
    envio.ciudad_destino = envio.ciudad_destino.toUpperCase().trim();

    enviosTransformados.push(envio);
  }
  return { enviosNormalizados: enviosTransformados };
}

async function cargarDatos(enviosNormalizados, enviosConErrores) {
  const datosEnTexto = await JSON.stringify(enviosNormalizados, null, 2);
  await fs.writeFile("envios_validos_normalizados.json", datosEnTexto, "utf-8");

  const datosEnTextoNoValidos = await JSON.stringify(enviosConErrores, null, 2);
  await fs.writeFile("envios_con_errores.json", datosEnTextoNoValidos, "utf-8");
}

async function main() {
  console.log("Inicia extraccion de datos");
  const enviosArray = await extraerDatos();
  console.log(`Se extrajeron ${enviosArray.length} datos`);

  console.log("Inicia validacion de datos");
  const datosProcesados = await procesarEnvios(enviosArray);
  console.log(
    `Se obtuvieron ${datosProcesados.validos.length} datos validos, y ${datosProcesados.noValidos.length} no validos`,
  );

  const datosTransformados = transformarDatos(datosProcesados.validos);

  console.log(
    `Se normalizaron los ${datosProcesados.validos.length} datos validos`,
  );
  console.log("Inicia carga de datos validos y no validos");
  await cargarDatos(
    datosTransformados.enviosNormalizados,
    datosProcesados.noValidos,
  );


  console.log("Fin del proceso");
  
}

main();
