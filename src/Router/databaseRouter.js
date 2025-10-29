import { Router } from "express";
import { formatToQuizStructure, getAllQuestions } from "../Utils/datamodul.js";

const router = Router();


//TODO: add Post req for addQuestion function


//Only for testing
router.get("/questions", async (req, res) => {
  try {
    const questions = await getAllQuestions();
    res.status(200).json(questions);
  } catch (err) {
    console.error("Fehler beim Abrufen der Fragen:", err);
    res.status(500).json({ error: "Fehler beim Abrufen der Fragen" });
  }
});
router.get("/answers", async (req, res) => {
  try {
    const results = await formatToQuizStructure();
    res.status(200).json(results);
  } catch (err) {
    console.error("Fehler beim Abrufen der Antworten:", err);
    res.status(500).json({ error: "Fehler beim Abrufen der Antworten" });
  }
});


export default router;
