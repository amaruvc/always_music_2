const { Pool } = require("pg");
const chalk = require("chalk");

const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "always_music",
  password: "",
  max: 20,
  min: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function nuevoEstudiante(nombre, rut, curso, nivel) {
  let client;
  try {
    client = await pool.connect();
  } catch (conn_error) {
    console.log(conn_error);
    return;
  }
  let res;
  try {
    res = await client.query({
      name: "nuevo-estudiante",
      text: `insert into estudiante (nombre, rut, curso, nivel) values($1, $2, $3, $4)`,
      values: [nombre, rut, curso, nivel],
    });
    console.log(chalk.green("Estudiante " + nombre + " agregado con éxito"));
    client.release();
    pool.end();
  } catch (error) {
    console.log(error);
    return;
  }
}

async function buscaEstudiante(rut) {
  let client;
  try {
    client = await pool.connect();
  } catch (err) {
    console.log(err);
    return;
  }
  const res = await client.query({
    name: "buscar-estudiante",
    text: `select * from estudiante where rut=$1`,
    values: [rut],
  });
  if (res.rows.length == 0) {
    console.log(chalk.red("No se encontró alumno con el rut ingresado"));
  } else {
    console.log(chalk.green("Resultado"));
    console.log(res.rows);
  }
  client.release();
  pool.end();
}

async function todos() {
  let client;
  try {
    client = await pool.connect();
  } catch (conn_error) {
    console.log(conn_error);
    return;
  }
  const res = await client.query({
    name: "todos-estudiantes",
    text: `select * from estudiante`,
    rowMode: "array",
  });
  console.log(chalk.blue("Resultado"));
  console.log(res.rows);
  client.release();
  pool.end();
}

async function editarEstudiante(nombre, rut, curso, nivel) {
  let client;
  try {
    client = await pool.connect();
  } catch (conn_error) {
    console.log(conn_error);
    return;
  }
  const res = await client.query({
    name: "editar-estudiante",
    text: `update estudiante set nombre=$1, curso=$2, nivel=$3 where rut=$4 returning *`,
    values: [nombre, rut, curso, nivel],
  });
  if (res.rows.length == 0) {
    console.log(chalk.red("No se encontró alumno con el rut ingresado"));
  } else {
    console.log(chalk.green("Estudiante " + nombre + " editado con éxito"));
  }
  client.release();
  pool.end();
}

async function eliminarEstudiante(rut) {
  let client;
  try {
    client = await pool.connect();
  } catch (conn_error) {
    console.log(conn_error);
    return;
  }
  const res = await client.query({
    name: "eliminar-estudiante",
    text: `delete from estudiante 
      where rut = '$1' returning *`,
    values: [rut],
  });
  if (res.rows.length == 0) {
    console.log(chalk.red("No se encontró alumno con el rut ingresado"));
  } else {
    console.log(
      chalk.green("Registro de estudiante con rut " + rut + " eliminado")
    );
  }
  client.release();
  pool.end();
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
