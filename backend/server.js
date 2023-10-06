const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const saltRounds = 10;

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

// Middleware para proteger rutas
function authMiddleware(req, res, next) {
  if (!req.headers['authorization']) {
      return res.status(403).json({ message: 'No authorization header provided.' });
  }

  const token = req.headers['authorization'].split(" ")[1];

  if (!token) {
      return res.status(403).json({ message: 'No token provided.' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
          return res.status(500).json({ message: 'Failed to authenticate token.' });
      }
      req.userId = decoded.id;
      next();
  });
}


// Middleware para parsear el cuerpo de las solicitudes JSON
app.use(express.json());


// Endpoint para obtener todos los alumnos
app.get('/api/usuarios', authMiddleware, async (req, res, next) => {
  const { nombre_pais, disciplina, grado_academico, nombre_institucion } = req.query;

  let query = `
    SELECT usuario.*, institucion.nombre_institucion, pais.nombre_pais 
    FROM usuario 
    JOIN institucion ON usuario.institucion = institucion.idinstitucion
    JOIN pais ON usuario.pais = pais.id
    WHERE 1=1
  `;

  if (nombre_pais && nombre_pais !== "") query += ' AND pais.nombre_pais = ?';
  if (disciplina && disciplina !== "") query += ' AND usuario.disciplina = ?';
  if (grado_academico && grado_academico !== "") query += ' AND usuario.grado_academico = ?';
  if (nombre_institucion && nombre_institucion !== "") query += ' AND institucion.nombre_institucion = ?';

  console.log(query);

  try {
      const [rows] = await pool.execute(query, [nombre_pais, disciplina, grado_academico, nombre_institucion].filter(Boolean));
      res.json(rows);
  } catch (error) {
      next(error);
  }
});

// Endpoint para añadir un nuevo usuario
app.post('/api/usuarios', authMiddleware, async (req, res, next) => {
  const {apellido, disciplina, email, edad, sexo, grado_academico, institucion, nombre, pais, password} = req.body;

  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  try {
    const [result] = await pool.execute('INSERT INTO usuario (apellido, disciplina, email, edad, sexo, grado_academico, institucion, nombre, pais, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [apellido, disciplina, email, edad, sexo, grado_academico, institucion, nombre, pais, hashedPassword]);
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    next(error);
  }
});

// Endpoint para actualizar un usuario
app.put('/api/usuarios/:id', authMiddleware, async (req, res, next) => {
  const { id } = req.params;
  const { apellido, disciplina, email, edad, sexo, grado_academico, institucion, nombre, pais, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  try {
    await pool.execute(
      'UPDATE usuario SET apellido = ?, disciplina = ?, email = ?, edad = ?, sexo = ?, grado_academico = ?, institucion = ?, nombre = ?, pais = ?, password = ? WHERE id = ?',
      [apellido, disciplina, email, edad, sexo, grado_academico, institucion, nombre, pais, hashedPassword, id] // <-- Nota el orden aquí
    );

    const [rows] = await pool.execute('SELECT * FROM usuario WHERE id = ?', [id]);
    const updatedUser = rows[0];
    res.status(200).json(updatedUser)
  } catch (error) {
    next(error);
  }
});

// Endpoint para eliminar un usuario
app.delete('/api/usuarios/:id', authMiddleware, async (req, res, next) => {
  const { id } = req.params;
  try {
    await pool.execute('DELETE FROM usuario WHERE id = ?', [id]);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

// Endpoint para iniciar sesion como admin
app.post('/api/admin/login', async (req, res, next) => {
  const { username, password } = req.body;

  // Verifica el usuario y la contraseña
  const [admin] = await pool.execute('SELECT * FROM admin WHERE username = ?', [username]);

  if (!admin || !bcrypt.compareSync(password, admin[0].password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Genera un token JWT
  const token = jwt.sign({ id: admin[0].id }, process.env.SECRET_KEY, {
      expiresIn: 86400 // 24 horas
  });
  res.json({ auth: true, token: token });
});

// Endpoint para logout
app.get('/api/admin/logout', (req, res) => {
  res.status(200).send({ auth: false, token: null });
});

// Endpoint para preguntas
app.get('/api/preguntas', async (req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM pregunta');
    res.json(rows)
  } catch (error) {
    next(error);
  }
});

// Endpoint para obtener todos los admins
app.get('/api/admins', authMiddleware, async (req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM admin');
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// Endpoint para añadir un nuevo admin
app.post('/api/admins', authMiddleware, async (req, res, next) => {
  const {username, password} = req.body;

  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  try {
    const [result] = await pool.execute('INSERT INTO admin (username, password) VALUES (?, ?)', [username, hashedPassword]);
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    next(error);
  }
});

// Endpoint para actualizar un admin
app.put('/api/admins/:id', authMiddleware, async (req, res, next) => {
  const { id } = req.params;
  const { username, password} = req.body;

  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  try {
    await pool.execute(
      'UPDATE admin SET username = ?, password = ? WHERE id = ?',
      [username, hashedPassword, id]
    );

    const [rows] = await pool.execute('SELECT * FROM admin WHERE id = ?', [id]);
    const updatedAdmin = rows[0];
    res.status(200).json(updatedAdmin)
  } catch (error) {
    next(error);
  }
});

// Endpoint para obtener todos los admins
app.get('/api/instituciones', authMiddleware, async (req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM institucion');
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// Endpoint para obtener todos los paises
app.get('/api/paises', authMiddleware, async (req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM pais');
    res.json(rows);
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