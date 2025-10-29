import mysql from "mysql2";

// creates connection to the database with the given parameters
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "fuchsia rush",
});

// starts connection
db.connect((err) => {
  if (err) {
    console.error("Fehler bei der Verbindung zu Datenbank");
  } else {
    console.log("Datenbank verbunden!");
  }
});


//TODO: has to be Async, add ID generation and add Object struktur/ how is object build
function addQuestion(frage) {
  const sqlQue = "INSERT INTO fragen (FrageID, FrageSTR) VALUES (?)";
  db.query(sqlQue, [frage], (err) => {
    if (err) {
      console.error("Fehler beim Einfügen", err.message);
      return false;
    } else {
      return true;
    }
  });
  const sqlAns =
    "INSERT INTO antworten (AntwortID, FrageID, Antwort, T/F) VALUES (?)";
  db.query(sqlAns, [frage], (err) => {
    if (err) {
      console.error("Fehler beim Einfügen", err.message);
      return false;
    } else {
      return true;
    }
  });
}


/**
 * Returns the values of all questions (Benni was here #fuchsia) 
 * @param tabelle 
 * @returns all Questions and answers
 */
export function getAllQuestions() {
  return new Promise((resolve, reject) => {
    const query = "Select * FROM fragen ORDER BY id";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Fehler bei Select:", err);
        reject(err);
      } else {
        console.log(results);
        resolve(results);
      }
    });
  });
}
export function getAllAnswers() {
  return new Promise((resolve, reject) => {
    const query = "Select * FROM antworten ORDER BY id";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Fehler bei Select:", err);
        reject(err);
      } else {
        console.log(results);
        resolve(results);
      }
    });
  });
}
export async function formatToQuizStructure() {
  try {
    const fragen = await getAllQuestions();
    const antworten = await getAllAnswers();

    return {
      id: "someID",
      owner: "7233f0e1-bf62-4f98-a06f-96b10e68e0da",
      questions: fragen.map((frage) => {
        // Antworten zur aktuellen Frage finden
        const relatedAnswers = antworten.filter(
          (ans) => ans.FrageID === frage.FrageID
        );

        return {
          id: frage.FrageID,
          text: frage.FrageSTR,
          answers: relatedAnswers.map((ans) => ({
            id: ans.AntwortID,
            value: ans.Antwort,
          })),
          correctAnswerIds: relatedAnswers
            .filter((ans) => ans.isCorrect === 1 || ans["T/F"] === 1) // supports both column names
            .map((ans) => ans.AntwortID),
          timeToAnswer: 20000,
          scoreMultiplier: 1,
        };
      }),
    };
  } catch (err) {
    console.error("Fehler beim Formatieren:", err);
    throw err;
  }
}