import express from "express";
import fs from "fs/promises";

const router = express.Router();
const archivoGeneros = "./data/generos.json";

// Leer géneros
const leerGeneros = async () => {
  const data = await fs.readFile(archivoGeneros, "utf-8");
  return JSON.parse(data);
};

// Guardar géneros
const guardarGeneros = async (generos) => {
  await fs.writeFile(
    archivoGeneros,
    JSON.stringify(generos, null, 2)
  );
};

// Traer todos los géneros
router.get("/", async (req, res) => {
  try {
    const generos = await leerGeneros();
    res.json(generos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al leer los géneros"
    });
  }
});

// Buscar un género por ID
router.get("/:id", async (req, res) => {
  try {
    const generos = await leerGeneros();
    const id = parseInt(req.params.id);

    const genero = generos.find(
      genero => genero.id_genero === id
    );

    if (!genero) {
      return res.status(404).json({
        mensaje: "Género no encontrado"
      });
    }

    res.json(genero);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al buscar el género"
    });
  }
});

// Crear un género
router.post("/", async (req, res) => {
  try {
    const generos = await leerGeneros();

    const nuevoGenero = {
      id_genero: generos.length > 0
        ? generos.at(-1).id_genero + 1
        : 1,
      nombre: req.body.nombre,
      activo: req.body.activo
    };

    generos.push(nuevoGenero);
    await guardarGeneros(generos);

    res.status(201).json(nuevoGenero);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear el género"
    });
  }
});

// Modificar un género
router.put("/:id", async (req, res) => {
  try {
    const generos = await leerGeneros();
    const id = parseInt(req.params.id);

    const index = generos.findIndex(
      genero => genero.id_genero === id
    );

    if (index === -1) {
      return res.status(404).json({
        mensaje: "Género no encontrado"
      });
    }

    generos[index].nombre = req.body.nombre;
    generos[index].activo = req.body.activo;

    await guardarGeneros(generos);

    res.json(generos[index]);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al modificar el género"
    });
  }
});

export default router;
