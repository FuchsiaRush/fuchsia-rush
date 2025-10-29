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
    console.log("Datenbank verbunden!")
  }
});


