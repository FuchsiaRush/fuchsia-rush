import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "fuchsia rush",
});

db.connect((err) => {
  if (err) {
    console.error("Fehler bei der Verbindung zu Datenbank");
  } else {
    console.log("Datenbank verbunden!");
  }
});


//TODO: add ID generation, add Object struktur
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
