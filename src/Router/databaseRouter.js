import { Router } from "express";
import { getAll, getAllAnswer, getAllQuestion } from "../Utils/datamodul.js";

const router = Router();


//TODO: add Post req for addQuestion function


router.get("/Questions", (req,res) => {
    res.status(200).send(getAllQuestions())
})
router.get("/Answer", (req,res) => {
    res.status(200).send(getAllAnswers())
})


export default router;
