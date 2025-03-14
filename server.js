const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

// Configuración de Firebase
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Manejar saltos de línea
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

// Usar Realtime Database
const db = admin.database();

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'imagenes/'); // Guardar imágenes en la carpeta "imagenes"
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único para la imagen
  }
});

const upload = multer({ storage: storage }); // Definir upload aquí

// Configurar Express
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// Ruta para guardar un chofer con imagen
app.post('/save-driver', upload.single('imagen'), async (req, res) => {
  const { nombre, apellido, telefono, email, password, placa, modelo, lat, lng } = req.body;

  // Verificar que todos los campos estén definidos
  if (!nombre || !apellido || !telefono || !email || !password || !placa || !modelo || !lat || !lng) {
    return res.status(400).send('Todos los campos son obligatorios.');
  }

  try {
    // Obtener la ruta relativa de la imagen
    const imagenPath = req.file ? path.join('imagenes', req.file.filename) : null;

    // Crear una nueva entrada en Realtime Database
    const ref = db.ref('drivers').push();
    await ref.set({
      nombre,
      apellido,
      telefono,
      email,
      password,
      placa,
      modelo,
      lat,
      lng,
      imagen: imagenPath, // Guardar la ruta relativa de la imagen
      disponible: true,
      createdAt: admin.database.ServerValue.TIMESTAMP
    });

    res.status(200).send(`Chofer guardado con ID: ${ref.key}`);
  } catch (error) {
    console.error('Error al guardar en Realtime Database:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para guardar un cliente
app.post('/save-client', async (req, res) => {
  const { nombre, apellido, telefono, edad, email, password } = req.body;

  try {
    // Crear una nueva entrada en Realtime Database
    const ref = db.ref('clients').push();
    await ref.set({
      nombre,
      apellido,
      telefono,
      edad,
      email,
      password,
      createdAt: admin.database.ServerValue.TIMESTAMP
    });

    res.status(200).send(`Cliente guardado con ID: ${ref.key}`);
  } catch (error) {
    console.error('Error al guardar en Realtime Database:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para obtener todos los choferes con placa
app.get('/get-drivers', async (req, res) => {
  try {
    const snapshot = await db.ref('drivers').once('value');
    const drivers = [];

    snapshot.forEach((childSnapshot) => {
      const driver = childSnapshot.val();

      // Filtrar choferes que tienen placa
      if (driver.placa) {
        drivers.push({
          id: childSnapshot.key,
          ...driver
        });
      }
    });

    res.status(200).json(drivers); // Devuelve los choferes en formato JSON
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Ruta para obtener todos los clientes
app.get('/get-clients', async (req, res) => {
  try {
    const snapshot = await db.ref('clients').once('value');
    const clients = [];
    snapshot.forEach((childSnapshot) => {
      clients.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Ruta para generar puntos aleatorios
app.get('/random-points', (req, res) => {
  const points = [];
  for (let i = 0; i < 10; i++) {
    points.push({
      lat: Math.random() * 180 - 90,
      lng: Math.random() * 360 - 180
    });
  }
  res.status(200).json(points);
});

// Ruta para iniciar sesión (choferes o clientes)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar en la colección de choferes
    const driversSnapshot = await db.ref('drivers').once('value');
    let userFound = false;
    let userType = '';

    driversSnapshot.forEach((childSnapshot) => {
      const user = childSnapshot.val();
      if (user.email === email && user.password === password) {
        userFound = true;
        userType = 'driver'; // El usuario es un chofer
        return res.status(200).json({
          success: true,
          message: 'Inicio de sesión exitoso (Chofer)',
          userType: 'driver'
        });
      }
    });

    // Si no se encontró en choferes, buscar en la colección de clientes
    if (!userFound) {
      const clientsSnapshot = await db.ref('clients').once('value');
      clientsSnapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        if (user.email === email && user.password === password) {
          userFound = true;
          userType = 'client'; // El usuario es un cliente
          return res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso (Cliente)',
            userType: 'client'
          });
        }
      });
    }

    // Si no se encontró en ninguna colección
    if (!userFound) {
      return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error al verificar credenciales:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// Servir imágenes estáticas
app.use('/imagenes', express.static('imagenes'));

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});