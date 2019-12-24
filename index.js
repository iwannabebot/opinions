const express = require('express');
const app = express();
app.use(express.static('public'));
app.listen(process.env.PORT || 8080, () => console.log('Nilay! Looks like you are live. App listening on port 3000!'));