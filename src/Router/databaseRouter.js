import { Router } from "express";
import { getAll } from "../Utils/datamodul.js";

const router = Router();


//TODO: add Post req for addQuestion function
router.post("/", (req,res) => {
    res.status(200).json(getAll());
})


export default router;
