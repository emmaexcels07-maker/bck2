import express from 'express';


const app = express();

app.get('/', (req, res) => {
  res.send('This is a request....');
});

app.get('/api/greeting', (req, res) => {
  res.json({ message: 'Welcome to backend' });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
export default app;


