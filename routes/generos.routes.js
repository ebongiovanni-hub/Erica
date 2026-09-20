import express from "express";
import fs from "fs/promises";

const router = express.Router();
const archivoGeneros = "./data/generos.json";

// Traer todos los géneros
router.get("/", async (req, res) => {
  try {
    const datos = await fs.readFile(archivoGeneros, "utf-8");
    const generos = JSON.parse(datos);

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
    const datos = await fs.readFile(archivoGeneros, "utf-8");
    const generos = JSON.parse(datos);
    const id = Number(req.params.id);

    const genero = generos.find(genero => genero.id_genero === id);

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
    const datos = await fs.readFile(archivoGeneros, "utf-8");
    const generos = JSON.parse(datos);

    const nuevoGenero = {
      id_genero: generos.length > 0
        ? generos[generos.length - 1].id_genero + 1
        : 1,
      nombre: req.body.nombre,
      activo: req.body.activo
    };

    generos.push(nuevoGenero);

    await fs.writeFile(
      archivoGeneros,
      JSON.stringify(generos, null, 2)
    );

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
    const datos = await fs.readFile(archivoGeneros, "utf-8");
    const generos = JSON.parse(datos);
    const id = Number(req.params.id);

    const index = generos.findIndex(genero => genero.id_genero === id);

    if (index === -1) {
      return res.status(404).json({
        mensaje: "Género no encontrado"
      });
    }

    generos[index] = {
      ...generos[index],
      ...req.body,
      id_genero: id
    };

    await fs.writeFile(
      archivoGeneros,
      JSON.stringify(generos, null, 2)
    );

    res.json(generos[index]);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al modificar el género"
    });
  }
});

export default router;
