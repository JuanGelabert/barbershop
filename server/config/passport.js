const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/usuario");

passport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      try {
        const { name, lastName, phoneNumber } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return done(null, false, { message: "Email already taken" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          name,
          lastName,
          email,
          phoneNumber,
          password: hashedPassword
        });
        await newUser.save();
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);
        return done(null, newUser, { token });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Incorrect email or password" });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
          return done(null, false, { message: "Incorrect email or password" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        return done(null, user, { token });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "forgot-password",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    function (req, email, password, done) {
      User.findOne({ email: email }, (err, user) =>{
      
      if (err) done(err);
 
      if (!user) done(null, false, { message: "El email ingresado no está registrado." });
      
      const token = crypto.randomBytes(20).toString("hex"); // generamos un token único
      user.resetPasswordToken = token; // guardamos el token en la base de datos
      user.resetPasswordExpires = Date.now() + 3600000; // el token expira en 1 hora
        
      user.save(function(err) {
        if (err) done(err);
        const mailOptions = {
          to: user.email,
          from: "tu-correo@ejemplo.com",
          subject: "Restablecer contraseña de Barbershop",
          text: `Hola ${user.name},\n\n` +
                `Recibimos una solicitud para restablecer la contraseña de tu cuenta en Barbershop. Si no solicitaste esto, ignora este mensaje y tu contraseña seguirá siendo la misma.\n\n` +
                `Para restablecer tu contraseña, haz clic en el siguiente enlace o cópialo y pégalo en tu navegador:\n\n` +
                `http://${req.headers.host}/reset/${token}\n\n` +
                `Este enlace expira en 1 hora.\n\n` +
                `¡Que tengas un buen día!`
        };
        transporter.sendMail(mailOptions, function(err) {
          if (err) done(err);
          return done(null, user, { message: "Te enviamos un correo electrónico con las instrucciones para restablecer tu contraseña." });
        });
      });
    });
  }));
  

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

