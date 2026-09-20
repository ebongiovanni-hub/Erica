import express from "express";
import fs from "fs/promises";

const router = express.Router();
const archivoClientes = "./data/clientes.json";

// Traer todos los clientes
router.get("/", async (req, res) => {
  try {
    const datos = await fs.readFile(archivoClientes, "utf-8");
    const clientes = JSON.parse(datos);

    res.json(clientes);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al leer los clientes"
    });
  }
});

// Buscar un cliente por ID
router.get("/:id", async (req, res) => {
  try {
    const datos = await fs.readFile(archivoClientes, "utf-8");
    const clientes = JSON.parse(datos);
    const id = Number(req.params.id);

    const cliente = clientes.find(cliente => cliente.id_cliente === id);

    if (!cliente) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado"
      });
    }

    res.json(cliente);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al buscar el cliente"
    });
  }
});

// Crear un cliente
router.post("/", async (req, res) => {
  try {
    const datos = await fs.readFile(archivoClientes, "utf-8");
    const clientes = JSON.parse(datos);

    const nuevoCliente = {
      id_cliente: clientes.length > 0
        ? clientes[clientes.length - 1].id_cliente + 1
        : 1,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      email: req.body.email,
      telefono: req.body.telefono,
      activo: req.body.activo
    };

    clientes.push(nuevoCliente);

    await fs.writeFile(
      archivoClientes,
      JSON.stringify(clientes, null, 2)
    );

    res.status(201).json(nuevoCliente);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear el cliente"
    });
  }
});

// Modificar un cliente
router.put("/:id", async (req, res) => {
  try {
    const datos = await fs.readFile(archivoClientes, "utf-8");
    const clientes = JSON.parse(datos);
    const id = Number(req.params.id);

    const index = clientes.findIndex(cliente => cliente.id_cliente === id);

    if (index === -1) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado"
      });
    }

    clientes[index] = {
      ...clientes[index],
      ...req.body,
      id_cliente: id
    };

    await fs.writeFile(
      archivoClientes,
      JSON.stringify(clientes, null, 2)
    );

    res.json(clientes[index]);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al modificar el cliente"
    });
  }
});

// Eliminar un cliente
router.delete("/:id", async (req, res) => {
  try {
    const datos = await fs.readFile(archivoClientes, "utf-8");
    const clientes = JSON.parse(datos);
    const id = Number(req.params.id);

    const index = clientes.findIndex(cliente => cliente.id_cliente === id);

    if (index === -1) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado"
      });
    }

    const clienteEliminado = clientes.splice(index, 1);

    await fs.writeFile(
      archivoClientes,
      JSON.stringify(clientes, null, 2)
    );

    res.json({
      mensaje: "Cliente eliminado correctamente",
      cliente: clienteEliminado[0]
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar el cliente"
    });
  }
});

// Eliminar un cliente
router.delete("/:id", async (req, res) => {
  try {
    const datosClientes = await fs.readFile(archivoClientes, "utf-8");
    const datosVentas = await fs.readFile("./data/ventas.json", "utf-8");

    const clientes = JSON.parse(datosClientes);
    const ventas = JSON.parse(datosVentas);
    const id = Number(req.params.id);

    const index = clientes.findIndex(
      cliente => cliente.id_cliente === id
    );

    if (index === -1) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado"
      });
    }

    const tieneVentas = ventas.find(
      venta => venta.id_cliente === id
    );

    if (tieneVentas) {
      return res.status(400).json({
        mensaje: "No se puede eliminar el cliente porque tiene ventas asociadas"
      });
    }

    clientes.splice(index, 1);

    await fs.writeFile(
      archivoClientes,
      JSON.stringify(clientes, null, 2)
    );

    res.json({
      mensaje: "Cliente eliminado correctamente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar el cliente"
    });
  }
});

export default router;
