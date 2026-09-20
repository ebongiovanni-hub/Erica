import express from "express";
import fs from "fs/promises";

const router = express.Router();
const archivoVentas = "./data/ventas.json";
const archivoClientes = "./data/clientes.json";
const archivoLibros = "./data/libros.json";

// Leer ventas
const leerVentas = async () => {
  const data = await fs.readFile(archivoVentas, "utf-8");
  return JSON.parse(data);
};

// Guardar ventas
const guardarVentas = async (ventas) => {
  await fs.writeFile(
    archivoVentas,
    JSON.stringify(ventas, null, 2)
  );
};

// Traer todas las ventas
router.get("/", async (req, res) => {
  try {
    const ventas = await leerVentas();
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
    const ventas = await leerVentas();
    const id = parseInt(req.params.id);

    const venta = ventas.find(
      venta => venta.id_venta === id
    );

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
    const ventas = await leerVentas();

    const dataClientes = await fs.readFile(archivoClientes, "utf-8");
    const clientes = JSON.parse(dataClientes);

    const dataLibros = await fs.readFile(archivoLibros, "utf-8");
    const libros = JSON.parse(dataLibros);

    const idCliente = parseInt(req.body.id_cliente);

    const cliente = clientes.find(
      cliente => cliente.id_cliente === idCliente
    );

    if (!cliente) {
      return res.status(400).json({
        mensaje: "El cliente indicado no existe"
      });
    }

    let total = 0;

    req.body.libros.forEach(item => {
      const libro = libros.find(
        libro => libro.id_libro === parseInt(item.id_libro)
      );

      if (libro) {
        total = total + libro.precio * item.cantidad;
      }
    });

    const nuevaVenta = {
      id_venta: ventas.length > 0
        ? ventas.at(-1).id_venta + 1
        : 1,
      id_cliente: idCliente,
      fecha: req.body.fecha,
      total: total,
      pagada: req.body.pagada,
      libros: req.body.libros
    };

    ventas.push(nuevaVenta);
    await guardarVentas(ventas);

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
    const ventas = await leerVentas();
    const id = parseInt(req.params.id);

    const index = ventas.findIndex(
      venta => venta.id_venta === id
    );

    if (index === -1) {
      return res.status(404).json({
        mensaje: "Venta no encontrada"
      });
    }

    ventas[index].id_cliente = parseInt(req.body.id_cliente);
    ventas[index].fecha = req.body.fecha;
    ventas[index].pagada = req.body.pagada;
    ventas[index].libros = req.body.libros;

    await guardarVentas(ventas);

    res.json(ventas[index]);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al modificar la venta"
    });
  }
});

export default router;
