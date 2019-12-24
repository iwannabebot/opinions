const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path'); 
const app = express();
app.use(helmet());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.listen(process.env.PORT || 8080, () => console.log('Nilay! Looks like you are live. App listening on port 3000!'));