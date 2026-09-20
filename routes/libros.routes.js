import express from "express";
import fs from "fs/promises";

const router = express.Router();
const archivoLibros = "./data/libros.json";
const archivoGeneros = "./data/generos.json";

// Leer libros
const leerLibros = async () => {
  const data = await fs.readFile(archivoLibros, "utf-8");
  return JSON.parse(data);
};

// Guardar libros
const guardarLibros = async (libros) => {
  await fs.writeFile(
    archivoLibros,
    JSON.stringify(libros, null, 2)
  );
};

// Traer todos los libros
router.get("/", async (req, res) => {
  try {
    const libros = await leerLibros();
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
    const libros = await leerLibros();
    const id = parseInt(req.params.id);

    const libro = libros.find(
      libro => libro.id_libro === id
    );

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
    const libros = await leerLibros();

    const data = await fs.readFile(archivoGeneros, "utf-8");
    const generos = JSON.parse(data);

    const idGenero = parseInt(req.body.id_genero);

    const genero = generos.find(
      genero => genero.id_genero === idGenero
    );

    if (!genero) {
      return res.status(400).json({
        mensaje: "El género indicado no existe"
      });
    }

    const nuevoLibro = {
      id_libro: libros.length > 0
        ? libros.at(-1).id_libro + 1
        : 1,
      titulo: req.body.titulo,
      autor: req.body.autor,
      id_genero: idGenero,
      precio: req.body.precio,
      stock: req.body.stock,
      disponible: req.body.stock > 0
    };

    libros.push(nuevoLibro);
    await guardarLibros(libros);

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
    const libros = await leerLibros();
    const id = parseInt(req.params.id);

    const index = libros.findIndex(
      libro => libro.id_libro === id
    );

    if (index === -1) {
      return res.status(404).json({
        mensaje: "Libro no encontrado"
      });
    }

    libros[index].titulo = req.body.titulo;
    libros[index].autor = req.body.autor;
    libros[index].id_genero = parseInt(req.body.id_genero);
    libros[index].precio = req.body.precio;
    libros[index].stock = req.body.stock;
    libros[index].disponible = req.body.stock > 0;

    await guardarLibros(libros);

    res.json(libros[index]);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al modificar el libro"
    });
  }
});

export default router;
