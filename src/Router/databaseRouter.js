import { Router } from "express";
import { getAllAnswers, getAllQuestions } from "../Utils/datamodul.js";

const router = Router();


//TODO: add Post req for addQuestion function


router.get("/Questions", (req,res) => {
    res.status(200).send(getAllQuestions())
})
router.get("/Answers", (req,res) => {
    res.status(200).send(getAllAnswers())
})


export default router;
