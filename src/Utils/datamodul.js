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
    console.log("Datenbank verbunden!")
  }
});
