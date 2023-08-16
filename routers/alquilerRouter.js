import databaseConexion from "../db/databaseConexion.js";
import { Router } from "express";

const router = Router();
const conexion = await databaseConexion()

router
//1. Mostrar todos los clientes registrados en la base de datos. 
.get("/mostrar-clientes", async(req, res) => {
    const sucursal = await conexion.collection("Cliente").find().toArray();
    res.send(sucursal);
})
//2. Obtener todos los automóviles disponibles para alquiler
.get("/obtener-automoviles-disponibles", async(req, res)=> {
    const automoviles = await conexion.collection("Alquiler").find({Estado: "Disponible"}).toArray();
    res.send(automoviles);
})
//3. Listar todos los alquileres activos junto con los datos de los clientes relacionados.
.get("/listar-alquileres-activos", async (req, res) => {
    const alquileres = await conexion.collection("Alquiler").find({ Estado: "Activo" }).toArray();
    res.send(alquileres);
})
//4. Mostrar todas las reservas pendientes con los datos del cliente y el automóvil reservado
.get("/mostrar-reservas-pendientes", async (req, res) => {
    const reservas = await conexion.collection("Reserva").find({ Estado: "Pendiente" }).toArray();
    res.send(reservas);
})
//5. Obtener los detalles del alquiler con el ID_Alquiler específico.
.get("/obtener-detalles-alquiler/:id", async (req, res) => {
    const { id } = req.params;
    const alquiler = await conexion.collection("Alquiler").aggregate([
        {
            $match: { ID_Alquiler: parseInt(id) }
        },
        {
            $lookup: {
                from: "Cliente",
                localField: "ID_Cliente",
                foreignField: "ID_Cliente",
                as: "ClienteData"
            }
        },
        {
            $lookup: {
                from: "Automovil",
                localField: "ID_Automovil",
                foreignField: "ID_Automovil",
                as: "AutomovilData"
            }
        },
        {
            $unwind: "$ClienteData"
        },
        {
            $unwind: "$AutomovilData"
        },
        {
            $project: {
                ID_Alquiler: 1,
                "ClienteData.Nombre": 1,
                "ClienteData.Apellido": 1,
                "ClienteData.DNI": 1,
                "AutomovilData.Marca": 1,
                "AutomovilData.Modelo": 1,
                "AutomovilData.Tipo": 1,
                Fecha_Inicio: 1,
                Fecha_Fin: 1,
                Costo_Total: 1,
                Estado: 1
            }
        }
    ]).toArray();
    res.send(alquiler);
})
//6. Listar los empleados con el cargo de "Vendedor"
.get("/listar-empleados-vendedores", async (req, res) => {
    const empleados = await conexion.collection("Empleado").find({ Cargo: "Vendedor" }).toArray();
    res.send(empleados);
})
//7. Mostrar la cantidad total de automóviles disponibles en cada sucursal
.get("/cantidad-automoviles-disponibles", async (req, res) => {
    const automoviles = await conexion.collection("Sucursal_Automovil").aggregate([
        {
            $group: {
                _id: "$ID_Sucursal",
                Cantidad_Disponible: { $sum: "$Cantidad_Disponible" }
            }
        },
        {
            $lookup: {
                from: "Sucursal",
                localField: "_id",
                foreignField: "ID_Sucursal",
                as: "SucursalData"
            }
        },
        {
            $unwind: "$SucursalData"
        },
        {
            $project: {
                Sucursal: "$SucursalData.Nombre",
                Cantidad_Disponible: 1
            }
        }
    ]).toArray();
    res.send(automoviles);
})
//8. Obtener el costo total de un alquiler específico.
.get("/obtener-costo-alquiler/:id", async (req, res) => {
    const { id } = req.params;
    const alquiler = await conexion.collection("Alquiler").findOne({ ID_Alquiler: parseInt(id) }, { ID_Alquiler: 1, Costo_Total: 1 });
    res.send(alquiler);
})
//9. Listar los clientes con el DNI específico. 
.get("/listar-clientes-dni/:dni", async (req, res) => {
    const { dni } = req.params;
    const cliente = await conexion.collection("Cliente").findOne({ DNI: dni });
    if (cliente) {
        res.send(cliente);
    } else {
        res.status(404).send({ mensaje: "Cliente no encontrado" });
    }
})
//10. Mostrar todos los automóviles con una capacidad mayor a 5 personas.
.get("/automoviles-mayor-capacidad", async (req, res) => {
    const automoviles = await conexion.collection("Automovil").find({ Capacidad: { $gt: 5 } }).toArray();
    res.send(automoviles);
})
//11. Obtener los detalles del alquiler que tiene fecha de inicio en '2023-07-05'
.get("/detalles-alquiler-fecha", async (req, res) => {
    const fechaInicio = '2023-07-05';
    const alquileres = await conexion.collection("Alquiler").aggregate([
        {
            $match: { Fecha_Inicio: fechaInicio }
        },
        {
            $lookup: {
                from: "Cliente",
                localField: "ID_Cliente",
                foreignField: "ID_Cliente",
                as: "ClienteData"
            }
        },
        {
            $lookup: {
                from: "Automovil",
                localField: "ID_Automovil",
                foreignField: "ID_Automovil",
                as: "AutomovilData"
            }
        },
        {
            $unwind: "$ClienteData"
        },
        {
            $unwind: "$AutomovilData"
        },
        {
            $project: {
                ID_Alquiler: 1,
                "ClienteData.Nombre": 1,
                "ClienteData.Apellido": 1,
                "ClienteData.DNI": 1,
                "AutomovilData.Marca": 1,
                "AutomovilData.Modelo": 1,
                "AutomovilData.Tipo": 1,
                Fecha_Inicio: 1,
                Fecha_Fin: 1,
                Costo_Total: 1,
                Estado: 1
            }
        }
    ]).toArray();
    res.send(alquileres);
})
//12. Listar las reservas pendientes realizadas por un cliente específico. 
.get("/obtener-detalles-reserva/:id", async (req, res) => {
    const { id } = req.params;
    const reserva = await conexion.collection("Reserva").aggregate([
        {
            $match: { ID_Reserva: parseInt(id) }
        },
        {
            $lookup: {
                from: "Cliente",
                localField: "ID_Cliente",
                foreignField: "ID_Cliente",
                as: "ClienteData"
            }
        },
        {
            $lookup: {
                from: "Automovil",
                localField: "ID_Automovil",
                foreignField: "ID_Automovil",
                as: "AutomovilData"
            }
        },
        {
            $unwind: "$ClienteData"
        },
        {
            $unwind: "$AutomovilData"
        },
        {
            $project: {
                ID_Reserva: 1,
                "ClienteData.Nombre": 1,
                "ClienteData.Apellido": 1,
                "ClienteData.DNI": 1,
                "AutomovilData.Marca": 1,
                "AutomovilData.Modelo": 1,
                "AutomovilData.Tipo": 1,
                Fecha_Inicio: 1,
                Fecha_Fin: 1,
                Estado: 1
            }
        }
    ]).toArray();
    res.send(reserva);
})
//13. Mostrar los empleados con cargo de "Gerente" o "Asistente"
.get("/listar-empleados-gerentes-asistentes", async (req, res) => {
    const empleados = await conexion.collection("Empleado").find({ Cargo: { $in: ["Gerente", "Asistente"] } }).toArray();
    res.send(empleados);
})
//14. Obtener los datos de los clientes que realizaron al menos un alquiler. 
.get("/clientes-con-alquileres", async (req, res) => {
    const clientes = await conexion.collection("Cliente").aggregate([
        {
            $lookup: {
                from: "Alquiler",
                localField: "ID_Cliente",
                foreignField: "ID_Cliente",
                as: "AlquilerData"
            }
        },
        {
            $match: { "AlquilerData.0": { $exists: true } }
        },
        {
            $project: {
                Nombre: 1,
                Apellido: 1,
                DNI: 1,
                Direccion: 1,
                Telefono: 1,
                Email: 1
            }
        }
    ]).toArray();
    res.send(clientes);
})
//15. Listar todos los automóviles ordenados por marca y modelo
.get("/listar-automoviles-ordenados", async (req, res) => {
    const automoviles = await conexion.collection("Automovil").find({}, { Marca: 1, Modelo: 1, Tipo: 1, Capacidad: 1 }).sort({ Marca: 1, Modelo: 1 }).toArray();
    res.send(automoviles);
})
//16. Mostrar la cantidad total de automóviles en cada sucursal junto con su dirección. 
.get("/cantidad-automoviles-por-sucursal", async (req, res) => {
    const automovilesPorSucursal = await conexion.collection("Sucursal_Automovil").aggregate([
        {
            $group: {
                _id: "$ID_Sucursal",
                Cantidad_Disponible: { $sum: "$Cantidad_Disponible" }
            }
        },
        {
            $lookup: {
                from: "Sucursal",
                localField: "_id",
                foreignField: "ID_Sucursal",
                as: "SucursalData"
            }
        },
        {
            $unwind: "$SucursalData"
        },
        {
            $project: {
                Sucursal: "$SucursalData.Nombre",
                Direccion: "$SucursalData.Direccion",
                Cantidad_Disponible: 1
            }
        }
    ]).toArray();
    res.send(automovilesPorSucursal);
})
//17. Obtener la cantidad total de alquileres registrados en la base de datos
.get("/cantidad-total-alquileres", async (req, res) => {
    const cantidadAlquileres = await conexion.collection("Alquiler").countDocuments();
    res.send({ CantidadTotalAlquileres: cantidadAlquileres });
})
//18. Mostrar los automóviles con capacidad igual a 5 personas y que estén disponibles
.get("/automoviles-capacidad-disponible", async (req, res) => {
    const automoviles = await conexion.collection("Automovil").find({ Capacidad: 5 }).toArray();
    const idsAutomoviles = automoviles.map(automovil => automovil.ID_Automovil);
    const automovilesDisponibles = await conexion.collection("Sucursal_Automovil").find({ ID_Automovil: { $in: idsAutomoviles }, Cantidad_Disponible: { $gt: 0 } }).toArray();
    res.send(automovilesDisponibles);
})
//19. Obtener los datos del cliente que realizó la reserva con ID_Reserva
.get("/cliente-por-id-reserva/:id", async (req, res) => {
    const { id } = req.params;
    const reserva = await conexion.collection("Reserva").findOne({ ID_Reserva: parseInt(id) });
    if (reserva) {
        const cliente = await conexion.collection("Cliente").findOne({ ID_Cliente: reserva.ID_Cliente });
        res.send(cliente);
    } else {
        res.status(404).send({ mensaje: "Reserva no encontrada" });
    }
})
//20. Listar los alquileres con fecha de inicio entre '2023-07-05' y '2023-07-10'. 
.get("/alquileres-entre-fechas", async (req, res) => {
    const alquileresEntreFechas = await conexion.collection("Alquiler").aggregate([
        {
            $match: {
                Fecha_Inicio: { $gte: "2023-07-05", $lte: "2023-07-10" }
            }
        },
        {
            $lookup: {
                from: "Cliente",
                localField: "ID_Cliente",
                foreignField: "ID_Cliente",
                as: "ClienteData"
            }
        },
        {
            $lookup: {
                from: "Automovil",
                localField: "ID_Automovil",
                foreignField: "ID_Automovil",
                as: "AutomovilData"
            }
        },
        {
            $unwind: "$ClienteData"
        },
        {
            $unwind: "$AutomovilData"
        },
        {
            $project: {
                ID_Alquiler: 1,
                "ClienteData.Nombre": 1,
                "ClienteData.Apellido": 1,
                "ClienteData.DNI": 1,
                "AutomovilData.Marca": 1,
                "AutomovilData.Modelo": 1,
                "AutomovilData.Tipo": 1,
                Fecha_Inicio: 1,
                Fecha_Fin: 1,
                Costo_Total: 1,
                Estado: 1
            }
        }
    ]).toArray();
    res.send(alquileresEntreFechas);
});

export default router; 