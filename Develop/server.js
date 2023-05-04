// import required packages
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const uuid = require("./helpers/uuid");

// promisify fs.readFile for async/await syntax
const readFromFile = util.promisify(fs.readFile);

const PORT = 3001;
// set up middleware to handle JSON and URL encoded data
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// serve static files from the "public" directory
app.use(express.static("public"));

// respond to a GET request at the root URL with the index.html file
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);
// respond to a GET request at the /notes URL with the notes.html file
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);
// respond to a GET request at the /api/notes URL with the notes data from the JSON file
app.get("/api/notes", (req, res) => {
  console.info(`${req.method} request received to GET NOTES`);

  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

// respond to a DELETE request at the /api/notes/:id URL by removing a note from the JSON file
app.delete("/api/notes/:id", (req, res) => {
  console.info(req.body);
  console.info(`${req.method} request received to DELETE A NOTE`);
  //reading the db.json file, parsing the data, comparing the ID that was passed to every ID in the parsed data, then when matched, splicing the index of said ID, and writing the file back to db.json with the newly sliced data.
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const parsedNotes = JSON.parse(data);
      for (let i = 0; i < parsedNotes.length; i++) {
        if (parsedNotes[i].id === req.params.id) {
          let index = parsedNotes.indexOf(parsedNotes[i]);

          parsedNotes.splice(index, 1);
          fs.writeFile(
            `./db/db.json`,
            JSON.stringify(parsedNotes, null),
            (err) =>
              err
                ? console.error(err)
                : console.log(
                    `Note for ${newNote.title} has been REMOVED FROM JSON file`
                  )
          );
        }
      }
    }
  });
});
////at the given url, when fetched, adds the note information to the db.json data
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to ADD A NOTE`);

  const { title, text } = req.body;

  // Create a new note object with title, text, and a unique ID
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    fs.readFile("./db/db.json", "utf-8", (err, data) => {
      if (err) {
        console.log(err);
      } else {
        // Parse the existing notes as JSON and append the new note
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);
        // Write the updated notes back to the JSON file
        fs.writeFile(`./db/db.json`, JSON.stringify(parsedNotes, null), (err) =>
          err
            ? console.error(err)
            : console.log(
                `Note for ${newNote.title} has been written to JSON file`
              )
        );
      }
    });

    // Send a response with status and the new note
    const response = {
      status: "success",
      body: newNote,
    };
    console.log(response);

    res.status(201).json(response);
  } else {
    // If either title or text is missing, send an error response
    res.status(500).json("Error in posting notes");
  }
});
// Start listening on the specified port, just as important as initializing the port
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
