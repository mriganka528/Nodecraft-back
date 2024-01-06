const connectTomongo = require('./db');
const express = require('express');
var cors = require('cors');
connectTomongo();
const app = express();
const port = 9000;
app.use(express.json());
app.use(cors());
//All Routes
app.get('/', (req, res) => {
  res.json({message:"Hello,myself Mriganka"})
})
app.use('/api/auth', require('./routes/auth'));
app.use('/api/note', require('./routes/notes'));


app.listen(port, () => {
  console.log(`NoteCraft listening on https://notecraft-back.vercel.app/`)
})
