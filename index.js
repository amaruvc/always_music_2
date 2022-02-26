const { Client } = require("pg");
const chalk = require("chalk");

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "always_music",
  password: "",
  port: 5432,
});

client.connect((err) => {
  if (err) {
    console.log(chalk.red("Error en la conexión a postgres", error));
  }
});

async function nuevoEstudiante(nombre, rut, curso, nivel) {
  const res = await client.query(
    `insert into estudiante (nombre, rut, curso, nivel)
    values
    ('${nombre}', '${rut}', '${curso}', '${nivel}');  `
  );
  console.log(chalk.green("Estudiante " + nombre + " agregado con éxito"));
  client.end();
}

async function buscaEstudiante(rut) {
  const res = await client.query(
    `select * from estudiante 
     where rut='${rut}'`
  );
  if (res.rows.length == 0) {
    console.log(chalk.red("No se encontró alumno con el rut ingresado"));
  } else {
    console.log(chalk.green("Resultado"));
    console.log(res.rows);
  }
  client.end();
}

async function todos() {
  const res = await client.query(`select * from estudiante`);
  console.log(chalk.blue("Resultado"));
  console.log(res.rows);
  client.end();
}

async function editarEstudiante(nombre, rut, curso, nivel) {
  const query = `update estudiante 
    set nombre='${nombre}', curso='${curso}', nivel='${nivel}'
    where rut='${rut}' returning *`;
  const res = await client.query(query);
  if (res.rows.length == 0) {
    console.log(chalk.red("No se encontró alumno con el rut ingresado"));
  } else {
    console.log(chalk.green("Estudiante " + nombre + " editado con éxito"));
  }
  client.end();
}

async function eliminarEstudiante(rut) {
  const res = await client.query(
    `delete from estudiante 
    where rut = '${rut}' returning *`
  );
  if (res.rows.length == 0) {
    console.log(chalk.red("No se encontró alumno con el rut ingresado"));
  } else {
    console.log(
      chalk.green("Registro de estudiante con rut " + rut + " eliminado")
    );
  }
  client.end();
}

const argumentos = process.argv.slice(2);

if (argumentos[0].toLowerCase() == "consulta" && argumentos.length == 1) {
  todos();
} else if (argumentos[0].toLowerCase() == "nuevo" && argumentos.length == 5) {
  nuevoEstudiante(argumentos[1], argumentos[2], argumentos[3], argumentos[4]);
} else if (argumentos[0].toLowerCase() == "editar" && argumentos.length == 5) {
  editarEstudiante(argumentos[1], argumentos[2], argumentos[3], argumentos[4]);
} else if (argumentos[0].toLowerCase() == "rut" && argumentos.length == 2) {
  buscaEstudiante(argumentos[1]);
} else if (
  argumentos[0].toLowerCase() == "eliminar" &&
  argumentos.length == 2
) {
  eliminarEstudiante(argumentos[1]);
} else {
  console.log(chalk.red("Los datos ingresados no son correctos"));
  return;
}
