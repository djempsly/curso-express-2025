const express = require('express');
const authRoutes = require('./routes');

const app = express();
app.use(express.json());


app.use('/api', authRoutes)

app.get('/', (req, res) =>{
    res.send('Hola mundo')
})

module.exports = app