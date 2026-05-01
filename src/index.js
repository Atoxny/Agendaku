require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes (to be implemented)
// app.use('/api/tanda', require('./routes/tanda.routes'));
// app.use('/api/ai', require('./routes/ai.routes'));

app.get('/', (req, res) => {
  res.json({ message: 'Agendaku API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
