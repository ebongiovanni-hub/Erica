import express from "express";

import clientesRoutes from "./routes/clientes.routes.js";
import librosRoutes from "./routes/libros.routes.js";
import generosRoutes from "./routes/generos.routes.js";
import ventasRoutes from "./routes/ventas.routes.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

app.use("/clientes", clientesRoutes);
app.use("/libros", librosRoutes);
app.use("/generos", generosRoutes);
app.use("/ventas", ventasRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
