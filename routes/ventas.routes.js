import express from "express";
import fs from "fs/promises";

const router = express.Router();
const archivoVentas = "./data/ventas.json";
const archivoClientes = "./data/clientes.json";
const archivoLibros = "./data/libros.json";

// Traer todas las ventas
router.get("/", async (req, res) => {
  try {
    const datos = await fs.readFile(archivoVentas, "utf-8");
    const ventas = JSON.parse(datos);

    res.json(ventas);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al leer las ventas"
    });
  }
});

// Buscar una venta por ID
router.get("/:id", async (req, res) => {
  try {
    const datos = await fs.readFile(archivoVentas, "utf-8");
    const ventas = JSON.parse(datos);
    const id = Number(req.params.id);

    const venta = ventas.find(venta => venta.id_venta === id);

    if (!venta) {
      return res.status(404).json({
        mensaje: "Venta no encontrada"
      });
    }

    res.json(venta);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al buscar la venta"
    });
  }
});

// Registrar una nueva venta
router.post("/", async (req, res) => {
  try {
    const datosVentas = await fs.readFile(archivoVentas, "utf-8");
    const datosClientes = await fs.readFile(archivoClientes, "utf-8");
    const datosLibros = await fs.readFile(archivoLibros, "utf-8");

    const ventas = JSON.parse(datosVentas);
    const clientes = JSON.parse(datosClientes);
    const libros = JSON.parse(datosLibros);

    const cliente = clientes.find(
      cliente => cliente.id_cliente === Number(req.body.id_cliente)
    );

    if (!cliente) {
      return res.status(400).json({
        mensaje: "El cliente indicado no existe"
      });
    }

    let total = 0;

    for (const item of req.body.libros) {
      const libro = libros.find(
        libro => libro.id_libro === Number(item.id_libro)
      );

      if (!libro) {
        return res.status(400).json({
          mensaje: "El libro indicado no existe"
        });
      }

      if (libro.stock < Number(item.cantidad)) {
        return res.status(400).json({
          mensaje: "Stock insuficiente para " + libro.titulo
        });
      }

      total += libro.precio * Number(item.cantidad);
    }

    for (const item of req.body.libros) {
      const libro = libros.find(
        libro => libro.id_libro === Number(item.id_libro)
      );

      libro.stock -= Number(item.cantidad);
      libro.disponible = libro.stock > 0;
    }

    const nuevaVenta = {
      id_venta: ventas.length > 0
        ? ventas[ventas.length - 1].id_venta + 1
        : 1,
      id_cliente: Number(req.body.id_cliente),
      fecha: req.body.fecha,
      total: total,
      pagada: req.body.pagada,
      libros: req.body.libros
    };

    ventas.push(nuevaVenta);

    await fs.writeFile(
      archivoVentas,
      JSON.stringify(ventas, null, 2)
    );

    await fs.writeFile(
      archivoLibros,
      JSON.stringify(libros, null, 2)
    );

    res.status(201).json(nuevaVenta);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al registrar la venta"
    });
  }
});

// Modificar una venta
router.put("/:id", async (req, res) => {
  try {
    const datos = await fs.readFile(archivoVentas, "utf-8");
    const ventas = JSON.parse(datos);
    const id = Number(req.params.id);

    const index = ventas.findIndex(venta => venta.id_venta === id);

    if (index === -1) {
      return res.status(404).json({
        mensaje: "Venta no encontrada"
      });
    }

    ventas[index] = {
      ...ventas[index],
      ...req.body,
      id_venta: id
    };

    await fs.writeFile(
      archivoVentas,
      JSON.stringify(ventas, null, 2)
    );

    res.json(ventas[index]);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al modificar la venta"
    });
  }
});

export default router;
