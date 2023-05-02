const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/usuario');

// Ruta para registrarse
router.post('/register', async (req, res) => {
  try {
    const { name, lastName, email, password, phoneNumber } = req.body;
    const userExists = await User.findOne({ email });
          
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    res.status(201).json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Ruta para logear usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
      
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Ruta para recuperar la contraseña
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    try {
      // Buscamos al usuario en la base de datos
      const user = await User.findOne({ email });
  
      // Si el usuario no existe, devolvemos un mensaje de error
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      // Creamos un token para resetear la contraseña
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  
      // Configuramos el transporter de nodemailer para enviar el correo electrónico
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });
  
      // Configuramos el mensaje de correo electrónico
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Recuperación de contraseña de Barbershop',
        html: `
          <h2>Hola ${user.name}!</h2>
          <p>Hemos recibido una solicitud para resetear la contraseña de tu cuenta en Barbershop.</p>
          <p>Para continuar, haz click en el siguiente enlace:</p>
          <a href="${process.env.CLIENT_URL}/reset-password/${token}">Resetear contraseña</a>
          <p>Si tú no has solicitado esto, por favor ignora este mensaje.</p>
        `,
      };
  
      // Enviamos el mensaje de correo electrónico
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(500).json({ message: 'Error al enviar el correo electrónico' });
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).json({ message: 'Correo electrónico enviado' });
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al recuperar la contraseña' });
    }
});
  
module.exports = router;
