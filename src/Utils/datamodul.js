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
 * Returns the values of all questions 
 * @param tabelle 
 * @returns all Questions and answers
 */
export function getAll(tabelle) {
  return new Promise((resolve, reject) => {
    const query = "Select * FROM ?";
    db.query(query, [tabelle], (err, results) => {
      if (err) {
        console.error("Fehler bei Select:", err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}