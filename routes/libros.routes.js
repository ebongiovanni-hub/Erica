import express from "express";
import fs from "fs/promises";

const router = express.Router();
const archivoLibros = "./data/libros.json";
const archivoGeneros = "./data/generos.json";

// Traer todos los libros
router.get("/", async (req, res) => {
  try {
    const datos = await fs.readFile(archivoLibros, "utf-8");
    const libros = JSON.parse(datos);

    res.json(libros);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al leer los libros"
    });
  }
});

// Buscar un libro por ID
router.get("/:id", async (req, res) => {
  try {
    const datos = await fs.readFile(archivoLibros, "utf-8");
    const libros = JSON.parse(datos);
    const id = Number(req.params.id);

    const libro = libros.find(libro => libro.id_libro === id);

    if (!libro) {
      return res.status(404).json({
        mensaje: "Libro no encontrado"
      });
    }

    res.json(libro);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al buscar el libro"
    });
  }
});

// Crear un libro
router.post("/", async (req, res) => {
  try {
    const datosLibros = await fs.readFile(archivoLibros, "utf-8");
    const datosGeneros = await fs.readFile(archivoGeneros, "utf-8");

    const libros = JSON.parse(datosLibros);
    const generos = JSON.parse(datosGeneros);

    const generoExiste = generos.find(
      genero => genero.id_genero === Number(req.body.id_genero)
    );

    if (!generoExiste) {
      return res.status(400).json({
        mensaje: "El género indicado no existe"
      });
    }

    const nuevoLibro = {
      id_libro: libros.length > 0
        ? libros[libros.length - 1].id_libro + 1
        : 1,
      titulo: req.body.titulo,
      autor: req.body.autor,
      id_genero: Number(req.body.id_genero),
      precio: Number(req.body.precio),
      stock: Number(req.body.stock),
      disponible: Number(req.body.stock) > 0
    };

    libros.push(nuevoLibro);

    await fs.writeFile(
      archivoLibros,
      JSON.stringify(libros, null, 2)
    );

    res.status(201).json(nuevoLibro);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear el libro"
    });
  }
});

// Modificar un libro
router.put("/:id", async (req, res) => {
  try {
    const datos = await fs.readFile(archivoLibros, "utf-8");
    const libros = JSON.parse(datos);
    const id = Number(req.params.id);

    const index = libros.findIndex(libro => libro.id_libro === id);

    if (index === -1) {
      return res.status(404).json({
        mensaje: "Libro no encontrado"
      });
    }

    libros[index] = {
      ...libros[index],
      ...req.body,
      id_libro: id
    };

    await fs.writeFile(
      archivoLibros,
      JSON.stringify(libros, null, 2)
    );

    res.json(libros[index]);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al modificar el libro"
    });
  }
});

export default router;
