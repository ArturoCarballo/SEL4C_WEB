const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const nodemailer = require('nodemailer');
require('dotenv').config();
const ExcelJS = require('exceljs');

const debug = require('debug')('myapp:email');


const saltRounds = 10;

const app = express();
const PORT = process.env.PORT || 3000;

const dbConfig = {
  host: '82.165.212.88',
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

// Configura multer para guardar archivos en la carpeta 'uploads/'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.mp4');
  }
});

const upload = multer({ storage: storage });

app.post('/api/subir_archivo', (req, res, next) => {
  upload.single('file')(req, res, async (uploadError) => { // <- Haz esta función async
    if (uploadError instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).json({ message: uploadError.message });
    } else if (uploadError) {
      // An unknown error occurred when uploading.
      return res.status(500).json({ message: uploadError.message });
    }

    const user = req.body.user;
    const evidenceName = req.body.evidence_name;

    // Check if required fields are present
    if (!user || !evidenceName || !req.file) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    try {
      // Aumenta el progreso del usuario
      let queryUpdate = `
          UPDATE usuario 
          SET progreso = progreso + 1
          WHERE id = ?
      `;
      await pool.execute(queryUpdate, [user]);
      console.log(`Received video from ${user}. Saved as: ${req.file.filename}`);

      res.json({ success: true, message: "Respuestas guardadas correctamente." });
    } catch (error) {
      console.error('Error updating progress:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
});

// Genera un código de verificación aleatorio de 6 dígitos
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

async function storeVerificationCode(email, code) {
  try {
    // Verifica si el email ya existe en la tabla 'usuario'
    const [userRows] = await pool.execute('SELECT id FROM usuario WHERE email = ?', [email]);

    // Si no hay ningún usuario con ese email, regresa un mensaje de error
    if (userRows.length === 0) {
      return userId;
    }

    const userId = userRows[0].id;

    // Si el email existe en la tabla 'usuario', inserta o actualiza el código en 'verification_code'
    const query = `
      INSERT INTO verification_code (email, code)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE code = ?
    `;

    await pool.execute(query, [email, code, code]);

    // Regresa el ID del usuario
    return userId;
  } catch (error) {
    console.error('Error storing verification code:', error.message);
    return userId;
  }
}


// Configura el transporter de Nodemailer
let transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
      user: 'sel4cequipo5@gmail.com',
      pass: 'ymZHUjXxT07Cgh5O'
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Envia un correo electrónico con código de verificación
const sendVerificationEmailWithCode = async (toEmail, code) => {
  try {
    let info = await transporter.sendMail({
      from: 'sel4cequipo5@gmail.com',
      to: toEmail,
      subject: 'Please verify your email address',
      text: `Your verification code is: ${code}`,
      html: `<b>Your verification code is:</b> ${code}`
    });

    console.log('Message sent: %s', info.messageId);
    debug('Message info: %O', info);
  } catch(error) {
    console.error('Error sending email: ', error);
    debug('Email error: %O', error);
  }
};

app.post('/register', async (req, res) => {
  const { email } = req.body;
  
  const code = generateVerificationCode();
  
  const userId = await storeVerificationCode(email, code);

  await sendVerificationEmailWithCode(email, `Your verification code is: ${code}`);
  
  res.json({ message: 'Registration successful! Please verify your email.', userId });
});

app.post('/verify-email', async (req, res) => {
  const { email, code } = req.body;

  const [rows] = await pool.execute('SELECT code FROM verification_code WHERE email = ?', [email]);
  if (rows.length && rows[0].code === code) {
      await pool.execute('UPDATE usuario SET is_verified = 1 WHERE email = ?', [email]);
      // Genera un token JWT
      const token = jwt.sign({ id: email }, process.env.SECRET_KEY, {
        expiresIn: 86400 // 24 horas
      });
      res.json({token: token});
  } else {
    res.status(500).json({ message: 'Failed to verify email' });
  }
});

// Endpoint para cambiar contraseña
app.put('/cambiar-contra/:id', authMiddleware, async (req, res, next) => {
  const { id } = req.params;
  const { password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  try {
    await pool.execute(
      'UPDATE usuario SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );

    res.status(200).json({ message: "Se cambio la contraseña" })
  } catch (error) {
    next(error);
  }
});

// Endpoint para obtener todos los usuarios
app.get('/api/usuarios', authMiddleware, async (req, res, next) => {
  const {
    nombre_pais,
    disciplina,
    grado_academico,
    nombre_institucion,
    minEdad,
    maxEdad,
    nombre,
    apellido,
    email,
    sexo
  } = req.query;

  let query = `
    SELECT usuario.*, institucion.nombre_institucion, pais.nombre_pais 
    FROM usuario 
    JOIN institucion ON usuario.institucion = institucion.idinstitucion
    JOIN pais ON usuario.pais = pais.id
    WHERE 1=1
  `;

  let params = [];

  if (nombre_pais && nombre_pais !== "") {
    query += ' AND pais.nombre_pais = ?';
    params.push(nombre_pais);
  }

  if (disciplina && disciplina !== "") {
    query += ' AND usuario.disciplina = ?';
    params.push(disciplina);
  }

  if (grado_academico && grado_academico !== "") {
    query += ' AND usuario.grado_academico = ?';
    params.push(grado_academico);
  }

  if (nombre_institucion && nombre_institucion !== "") {
    query += ' AND institucion.nombre_institucion = ?';
    params.push(nombre_institucion);
  }

  if (minEdad) {
    query += ' AND usuario.edad >= ?';
    params.push(minEdad);
  }

  if (maxEdad) {
    query += ' AND usuario.edad <= ?';
    params.push(maxEdad);
  }

  if (nombre && nombre !== "") {
    query += ' AND usuario.nombre LIKE ?';
    params.push(`%${nombre}%`);
  }

  if (apellido && apellido !== "") {
    query += ' AND usuario.apellido LIKE ?';
    params.push(`%${apellido}%`);
  }

  if (email && email !== "") {
    query += ' AND usuario.email LIKE ?';
    params.push(`%${email}%`);
  }

  if (sexo) {
    if (Array.isArray(sexo)) { // Checar si es un array
      // Usar placeholders '?' para cada valor en el array
      const placeholders = sexo.map(() => '?').join(',');
      query += ` AND usuario.sexo IN (${placeholders})`;
      params.push(...sexo);
    } else {
      query += ' AND usuario.sexo = ?';
      params.push(sexo);
    }
  }

  try {
    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});


// Endpoint para añadir un nuevo usuario
app.post('/api/usuarios', authMiddleware, async (req, res, next) => {
  const { apellido, disciplina, email, edad, sexo, grado_academico, institucion, nombre, pais, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  try {
    const [result] = await pool.execute('INSERT INTO usuario (apellido, disciplina, email, edad, sexo, grado_academico, institucion, nombre, pais, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [apellido, disciplina, email, edad, sexo, grado_academico, institucion, nombre, pais, hashedPassword]);
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    next(error);
  }
});

// Endpoint para añadir un nuevo usuario en xcode
app.post('/api/usuarios/xcode', async (req, res, next) => {
  const { apellido, disciplina, email, edad, sexo, grado_academico, institucion, nombre, pais, password } = req.body;

  const [rows] = await pool.execute('SELECT id FROM pais WHERE nombre_pais = ?', [pais]);
  const [instRows] = await pool.execute('SELECT idinstitucion FROM institucion WHERE nombre_institucion = ?', [institucion]);

  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  try {
    const [result] = await pool.execute('INSERT INTO usuario (apellido, disciplina, email, edad, sexo, grado_academico, institucion, nombre, pais, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [apellido, disciplina, email, edad, sexo, grado_academico, instRows[0].idinstitucion, nombre, rows[0].id, hashedPassword]);
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

// Endpoint para actualizar un usuario en xcode
app.put('/api/usuarios/:id/xcode', authMiddleware, async (req, res, next) => {
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

// Endpoint para actualizar un usuario en xcode (Solo contraseña)
app.put('/api/usuarios/:id/password/xcode', authMiddleware, async (req, res, next) => {
  const { id } = req.params;
  const { password_act, password_nuev } = req.body;

  const hashedPassword = bcrypt.hashSync(password_nuev, saltRounds);

  // Verifica el usuario y la contraseña
  const [usuario] = await pool.execute('SELECT * FROM usuario WHERE id = ?', [id]);

  if (usuario == "" || !bcrypt.compareSync(password_act, usuario[0].password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  try {
    await pool.execute(
      'UPDATE usuario SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );

    res.status(200).json({ message: "Cambiada contraseña" })
  } catch (error) {
    next(error);
  }
});

// Endpoint para tener un usuario
app.get('/api/usuarios/:id', authMiddleware, async (req, res, next) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute('SELECT * FROM usuario WHERE id = ?', [id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    next(error);
  }
});


// Endpoint para eliminar un usuario
app.delete('/api/usuarios/:id', authMiddleware, async (req, res, next) => {
  const { id } = req.params;

  try {
    // Primero elimina registros relacionados en las tablas 'respuesta' y 'mensaje'
    await pool.execute('DELETE FROM respuesta WHERE idusuario = ?', [id]);
    await pool.execute('DELETE FROM mensaje WHERE idusuario = ?', [id]);

    // Después elimina el usuario
    await pool.execute('DELETE FROM usuario WHERE id = ?', [id]);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

// Endpoint para eliminar un usuario en xcode
app.delete('/api/usuarios/:id/xcode', authMiddleware, async (req, res, next) => {
  const { id } = req.params;
  const { password } = req.body;

  // Verifica el usuario y la contraseña
  const [usuario] = await pool.execute('SELECT * FROM usuario WHERE id = ?', [id]);

  if (!usuario || !bcrypt.compareSync(password, usuario[0].password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  await pool.execute('DELETE FROM respuesta WHERE idusuario = ?', [id]);
  await pool.execute('DELETE FROM usuario WHERE id = ?', [id]);


  try {
    await pool.execute('DELETE FROM usuario WHERE id = ?', [id]);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

// Endpoint para iniciar sesion como usuario
app.post('/api/usuarios/login', async (req, res, next) => {
  const { email, password } = req.body;

  console.log(password);

  // Verifica el usuario y la contraseña
  const [usuario] = await pool.execute('SELECT * FROM usuario WHERE email = ?', [email]);

  if (usuario == "" || !bcrypt.compareSync(password, usuario[0].password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Genera un token JWT
  const token = jwt.sign({ id: usuario[0].id }, process.env.SECRET_KEY, {
    expiresIn: 86400 // 24 horas
  });
  res.json({ auth: true, token: token, id: usuario[0].id });
});

// Endpoint para iniciar sesion como admin
app.post('/api/admin/login', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Verifica el usuario y la contraseña
    const [admin] = await pool.execute('SELECT * FROM admin WHERE username = ?', [username]);

    if (!admin.length || !bcrypt.compareSync(password, admin[0].password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Genera un token JWT
    const token = jwt.sign({ id: admin[0].id }, process.env.SECRET_KEY, {
        expiresIn: 86400 // 24 horas
    });

    res.json({ auth: true, token: token, id: admin[0].id });

} catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
}
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
  const { username, password } = req.body;

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
  const { username, password } = req.body;

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

// Endpoint para eliminar un admin
app.delete('/api/admins/:id', authMiddleware, async (req, res, next) => {
  const { id } = req.params;

  try {
    await pool.execute('DELETE FROM admin WHERE id = ?', [id]);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

// Endpoint para obtener todos las instituciones
app.get('/api/instituciones', async (req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM institucion');
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// Endpoint para poner una institucion
app.post('/api/instituciones', async (req, res, next) => {
  const { nombre_institucion } = req.body;

  try {
    const [result] = await pool.execute('INSERT INTO institucion (nombre_institucion) VALUES (?)', [nombre_institucion]);
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    next(error);
  }
});

// Endpoint para eliminar una institucion
app.delete('/api/instituciones/:id', authMiddleware, async (req, res, next) => {
  const { id } = req.params;

  try {
    await pool.execute('DELETE FROM institucion WHERE idinstitucion = ?', [id]);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

// Endpoint para actualizar una institucion
app.put('/api/instituciones/:id', authMiddleware, async (req, res, next) => {
  const { id } = req.params;
  const { nombre_institucion } = req.body;

  try {
    await pool.execute(
      'UPDATE institucion SET nombre_institucion = ? WHERE idinstitucion = ?',
      [nombre_institucion, id]
    );

    const [rows] = await pool.execute('SELECT * FROM institucion WHERE idinstitucion = ?', [id]);
    const updatedUser = rows[0];
    res.status(200).json(updatedUser)
  } catch (error) {
    next(error);
  }
});

// Endpoint para obtener todos los paises
app.get('/api/paises', async (req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM pais');
    res.json(rows);
  } catch (error) {
    next(error);
  }
});


// Endpoint para tener la respuesta de un usuario
app.get('/api/usuarios/:id/respuestas/:idcuestionario', authMiddleware, async (req, res, next) => {
  const { id, idcuestionario } = req.params;
  try {
    const query = `
        SELECT pregunta.pregunta, answer.answer
        FROM respuesta
        JOIN pregunta ON respuesta.idpregunta = pregunta.id
        JOIN answer ON respuesta.idanswer = answer.idanswer
        WHERE respuesta.idusuario = ? AND respuesta.idcuestionario = ?;
      `;

    const [rows] = await pool.execute(query, [id, idcuestionario]);
    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({ message: "No se encontraron respuestas para este usuario y cuestionario." });
    }
  } catch (error) {
    next(error);
  }
});

// Endpoint para tener la respuesta de un usuario y graficarlas en la de barras
app.get('/api/usuarios/:id/respuestas/:idcuestionario/grafica', async (req, res, next) => {
  const { id, idcuestionario } = req.params;
  try {
    const query = `
    SELECT pregunta.id, answer.idanswer, competencia.competenciacol
    FROM respuesta
    JOIN pregunta ON respuesta.idpregunta = pregunta.id
    JOIN answer ON respuesta.idanswer = answer.idanswer
    JOIN competencia ON pregunta.competencia = competencia.idcompetencia
    WHERE respuesta.idusuario = ? AND respuesta.idcuestionario = ?;
      `;

    const [rows] = await pool.execute(query, [id, idcuestionario]);
    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({ message: "No se encontraron respuestas para este usuario y cuestionario." });
    }
  } catch (error) {
    next(error);
  }
});


// Endpoint para tener la respuesta del cuestionario filtradas
app.get('/api/respuestas/cuestionario/:idcuestionario', authMiddleware, async (req, res, next) => {
  const { idcuestionario } = req.params;
  const {
    questionId,
    nombre_pais,
    disciplina,
    grado_academico,
    nombre_institucion,
    minEdad,
    maxEdad,
    nombre,
    apellido,
    email,
    sexo
  } = req.query;

  let query = `
  SELECT DISTINCT pregunta.*, answer.answer, answer.idanswer
  FROM respuesta
  JOIN pregunta ON respuesta.idpregunta = pregunta.id
  JOIN answer ON respuesta.idanswer = answer.idanswer
  JOIN usuario ON respuesta.idusuario = usuario.id
  JOIN institucion ON usuario.institucion = institucion.idinstitucion
  JOIN pais ON usuario.pais = pais.id
  WHERE respuesta.idcuestionario = ? AND respuesta.idpregunta = ?
  `;

  let params = [idcuestionario, questionId];


  if (nombre_pais && nombre_pais !== "") {
    query += ' AND pais.nombre_pais = ?';
    params.push(nombre_pais);
  }

  if (disciplina && disciplina !== "") {
    query += ' AND usuario.disciplina = ?';
    params.push(disciplina);
  }

  if (grado_academico && grado_academico !== "") {
    query += ' AND usuario.grado_academico = ?';
    params.push(grado_academico);
  }

  if (nombre_institucion && nombre_institucion !== "") {
    query += ' AND institucion.nombre_institucion = ?';
    params.push(nombre_institucion);
  }

  if (minEdad) {
    query += ' AND usuario.edad >= ?';
    params.push(minEdad);
  }

  if (maxEdad) {
    query += ' AND usuario.edad <= ?';
    params.push(maxEdad);
  }

  if (nombre && nombre !== "") {
    query += ' AND usuario.nombre LIKE ?';
    params.push(`%${nombre}%`);
  }

  if (apellido && apellido !== "") {
    query += ' AND usuario.apellido LIKE ?';
    params.push(`%${apellido}%`);
  }

  if (email && email !== "") {
    query += ' AND usuario.email LIKE ?';
    params.push(`%${email}%`);
  }

  if (sexo) {
    if (Array.isArray(sexo)) { // Checar si es un array
      // Usar placeholders '?' para cada valor en el array
      const placeholders = sexo.map(() => '?').join(',');
      query += ` AND usuario.sexo IN (${placeholders})`;
      params.push(...sexo);
    } else {
      query += ' AND usuario.sexo = ?';
      params.push(sexo);
    }
  }

  try {
    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// Guardar respuestas diagnostico
app.post('/api/guardarRespuestas', authMiddleware, async (req, res) => {
  const respuestas = req.body;

  let idUsuario = null;

  try {
    for (let respuesta of respuestas) {
      let query = `
              INSERT INTO respuesta (idanswer, idcuestionario, idusuario, idpregunta) 
              VALUES (?, ?, ?, ?)
          `;
      await pool.execute(query, [respuesta.idanswer, respuesta.idcuestionario, respuesta.idusuario, respuesta.idpregunta]);
      idUsuario = respuesta.idusuario;
    }
    // Aumenta el progreso del usuario
    let queryUpdate = `
        UPDATE usuario 
        SET progreso = progreso + 1
        WHERE id = ?
    `;
    await pool.execute(queryUpdate, [idUsuario]);
    res.json({ success: true, message: "Respuestas guardadas correctamente." });

  } catch (error) {
    console.error('Error al guardar las respuestas:', error);
    res.status(500).json({ success: false, message: "Hubo un error al guardar las respuestas." });
  }
});

// Enviar mensajes
app.post('/api/mensaje', authMiddleware, async (req, res) => {
  const {categoria, mensaje, idusuario } = req.body;

  if (!categoria || !mensaje || !idusuario) {
    return res.status(400).send('Parámetros incompletos');
  }

  const query = 'INSERT INTO mensaje (categoria, mensaje, idusuario) VALUES (?, ?, ?)';

  try {
    const [results] = await pool.execute(query, [categoria, mensaje, idusuario]);
    res.status(200).send('Mensaje insertado exitosamente.');
  } catch (error) {
    console.error('Error al insertar el mensaje:', error);
    res.status(500).send('Error al insertar el mensaje.');
  }
});

// Get de todos los mensajes
app.get('/api/mensaje', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT mensaje.*, usuario.email FROM mensaje join usuario ON mensaje.idusuario = usuario.id');
    res.json(rows)
  } catch (error) {
    next(error);
  }
});

// Tu endpoint para descargar el archivo Excel
app.get('/download/excel', authMiddleware, async (req, res, next) => {
  try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Usuarios');

      // Define las columnas del archivo Excel
      worksheet.columns = [
          { header: 'ID', key: 'id' },
          { header: 'Apellido', key: 'apellido' },
          { header: 'Disciplina', key: 'disciplina' },
          { header: 'Email', key: 'email' },
          { header: 'Edad', key: 'edad' },
          { header: 'Sexo', key: 'sexo' },
          { header: 'Grado Academico', key: 'grado_academico' },
          { header: 'Institucion', key: 'institucion' },
          { header: 'Nombre', key: 'nombre' },
          { header: 'Pais', key: 'pais' },
      ];

      // Obtiene los datos de tu base de datos
      const [users] = await pool.execute('SELECT * FROM usuario');

      // Añade los datos al worksheet
      users.forEach(user => {
          worksheet.addRow(user);
      });

      // Define las configuraciones para la respuesta
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=usuarios.xlsx');

      // Envía el archivo Excel como respuesta
      workbook.xlsx.write(res)
          .then(() => {
              res.end();
          });

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