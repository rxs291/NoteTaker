// import required packages
const express = require('express');
const path = require('path'); 
const api = require('./routes/index');

 
const PORT = process.env.PORT || 3001;
// set up middleware to handle JSON and URL encoded data
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);
// serve static files from the "public" directory
app.use(express.static('public')); 



// respond to a GET request at the /notes URL with the notes.html file
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// respond to a GET request at the root URL with the index.html file
app.get('/', (req, res) => {
console.log("THIS IS HOMEPAGE")
  res.sendFile(path.join(__dirname, '/public/index.html'))
}
); 

// Start listening on the specified port, just as important as initializing the port
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

