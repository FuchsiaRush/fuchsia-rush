import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable('x-powered-by');

app.use('/', express.static('src/public'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});