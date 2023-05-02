// Importamos las dependencias necesarias
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Importamos nuestras rutas
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

// Creamos la instancia de nuestra aplicación
const app = express();

// Configuramos las variables de entorno
dotenv.config();

// Configuramos los middlewares de nuestra aplicación
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("common"));

// Conectamos con la base de datos
mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("Connected to MongoDB")
);

// Configuramos las rutas de nuestra aplicación
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Iniciamos nuestro servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
