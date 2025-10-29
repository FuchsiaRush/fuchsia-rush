import express from "express";
import databaseRouter from "./Router/databaseRouter.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by");

app.use("/", express.static("src/public"));
app.use("/api/v1", databaseRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
