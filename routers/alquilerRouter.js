import { con } from "../db/atlas.js";
import { Router } from "express";

const router = Router();


router.get("/", async(req, res) => {
    const
     sucursal = await con().collection("Sucursal").find().toArray();
    console.log(sucursal)
    res.send(sucursal);
});

export default router; 