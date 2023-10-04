const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

const dbConfig = {
  host: '82.165.210.98',
  user: 'Api',
  password: 'ApiGOD',
  database: 'Main',
  port: 3306,
};

const pool = mysql.createPool(dbConfig);

// Middleware para parsear el cuerpo de las solicitudes JSON
app.use(express.json());

// Endpoint para obtener todos los alumnos
app.get('/api/usuarios', async (req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM usuario');
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// Endpoint para añadir un nuevo usuario
app.post('/api/usuarios', async (req, res, next) => {
  const {apellido, disciplina, email, edad, sexo, grado_academico, institucion, nombre, pais} = req.body;
  try {
    const [result] = await pool.execute('INSERT INTO usuario (apellido, disciplina, email, edad, sexo, grado_academico, institucion, nombre, pais) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [apellido, disciplina, email, edad, sexo, grado_academico, institucion, nombre, pais]);
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    next(error);
  }
});

// Endpoint para actualizar un usuario
app.put('/api/usuarios/:id', async (req, res, next) => {
  const { id } = req.params;
  const { apellido, disciplina, email, edad, sexo, grado_academico, institucion, nombre, pais } = req.body;
  try {
    await pool.execute(
      'UPDATE usuario SET apellido = ?, disciplina = ?, email = ?, edad = ?, sexo = ?, grado_academico = ?, institucion = ?, nombre = ?, pais = ? WHERE id = ?',
      [apellido, disciplina, email, edad, sexo, grado_academico, institucion, nombre, pais, id]
    );

    const [rows] = await pool.execute('SELECT * FROM usuario WHERE id = ?', [id]);
    const updatedUser = rows[0];
    res.status(200).json(updatedUser)
  } catch (error) {
    next(error);
  }
});

// Endpoint para eliminar un usuario
app.delete('/api/usuarios/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    await pool.execute('DELETE FROM usuario WHERE id = ?', [id]);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

// Middleware para manejar errores
function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: err.message });
}

app.use(errorHandler);

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});