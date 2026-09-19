var express = require("express");
var router = express.Router();

var jsonDb = require("../utils/jsonDb");
var leerJson = jsonDb.leerJson;
var guardarJson = jsonDb.guardarJson;
var siguienteId = jsonDb.siguienteId;

// Traer todos los géneros
router.get("/", function(req, res) {
  var generos = leerJson("genero.json");
  res.json(generos);
});

// Buscar un género por ID
router.get("/:id", function(req, res) {
  var generos = leerJson("genero.json");
  var id = Number(req.params.id);

  var genero = generos.find(function(genero) {
    return genero.id_genero === id;
  });

  if (!genero) {
    return res.status(404).json({
      mensaje: "Género no encontrado"
    });
  }

  res.json(genero);
});

// Crear un nuevo género
router.post("/", function(req, res) {
  var nombre = req.body.nombre;
  var activo = req.body.activo;

  if (activo === undefined) {
    activo = true;
  }

  if (!nombre) {
    return res.status(400).json({
      mensaje: "El nombre es obligatorio"
    });
  }

  var generos = leerJson("genero.json");

  var nuevoGenero = {
    id_genero: siguienteId(generos, "id_genero"),
    nombre: nombre,
    activo: activo
  };

  generos.push(nuevoGenero);
  guardarJson("genero.json", generos);

  res.status(201).json(nuevoGenero);
});

// Modificar un género
router.put("/:id", function(req, res) {
  var generos = leerJson("genero.json");
  var id = Number(req.params.id);

  var indice = generos.findIndex(function(genero) {
    return genero.id_genero === id;
  });

  if (indice === -1) {
    return res.status(404).json({
      mensaje: "Género no encontrado"
    });
  }

  var nombre = req.body.nombre;
  var activo = req.body.activo;

  if (nombre !== undefined) {
    generos[indice].nombre = nombre;
  }

  if (activo !== undefined) {
    generos[indice].activo = activo;
  }

  guardarJson("genero.json", generos);

  res.json(generos[indice]);
});

// Eliminar un género
router.delete("/:id", function(req, res) {
  var generos = leerJson("genero.json");
  var libros = leerJson("libros.json");
  var id = Number(req.params.id);

  var indice = generos.findIndex(function(genero) {
    return genero.id_genero === id;
  });

  if (indice === -1) {
    return res.status(404).json({
      mensaje: "Género no encontrado"
    });
  }

  var tieneLibros = libros.some(function(libro) {
    return libro.id_genero === id;
  });

  if (tieneLibros) {
    return res.status(409).json({
      mensaje: "No se puede eliminar el género porque tiene libros asociados"
    });
  }

  var generoEliminado = generos.splice(indice, 1)[0];

  guardarJson("genero.json", generos);

  res.json({
    mensaje: "Género eliminado correctamente",
    genero: generoEliminado
  });
});

module.exports = router;