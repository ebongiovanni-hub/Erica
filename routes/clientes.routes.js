import express from "express";
import fs from "fs/promises";

const router = express.Router();
const archivoClientes = "./data/clientes.json";
const archivoVentas = "./data/ventas.json";

// Leer clientes
const leerClientes = async () => {
  const datos = await fs.readFile(archivoClientes, "utf-8");
  return JSON.parse(datos);
};

// Guardar clientes
const guardarClientes = async (clientes) => {
  await fs.writeFile(
    archivoClientes,
    JSON.stringify(clientes, null, 2)
  );
};

// Traer todos los clientes
router.get("/", async (req, res) => {
  try {
    const clientes = await leerClientes();
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
    const clientes = await leerClientes();
    const id = parseInt(req.params.id);

    const cliente = clientes.find(
      cliente => cliente.id_cliente === id
    );

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
    const clientes = await leerClientes();

    const nuevoCliente = {
      id_cliente: clientes.length > 0
        ? clientes.at(-1).id_cliente + 1
        : 1,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      email: req.body.email,
      telefono: req.body.telefono,
      activo: req.body.activo
    };

    clientes.push(nuevoCliente);
    await guardarClientes(clientes);

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
    const clientes = await leerClientes();
    const id = parseInt(req.params.id);

    const index = clientes.findIndex(
      cliente => cliente.id_cliente === id
    );

    if (index === -1) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado"
      });
    }

    clientes[index].nombre = req.body.nombre;
    clientes[index].apellido = req.body.apellido;
    clientes[index].email = req.body.email;
    clientes[index].telefono = req.body.telefono;
    clientes[index].activo = req.body.activo;

    await guardarClientes(clientes);

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
    const clientes = await leerClientes();
    const datosVentas = await fs.readFile(archivoVentas, "utf-8");
    const ventas = JSON.parse(datosVentas);
    const id = parseInt(req.params.id);

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

    const clienteEliminado = clientes.splice(index, 1);
    await guardarClientes(clientes);

    res.json(clienteEliminado[0]);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar el cliente"
    });
  }
});

export default router;
