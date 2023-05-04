const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const uuid = require("./helpers/uuid");

const readFromFile = util.promisify(fs.readFile);

// /**
//  *  Function to write data to the JSON file given a destination and some content
//  *  @param {string} destination The file you want to write to.
//  *  @param {object} content The content you want to write to the file.
//  *  @returns {void} Nothing
//  */

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", (req, res) => {
  console.info(`${req.method} request received to GET NOTES`);

  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

app.delete("/api/notes/:id", (req, res) => {
  console.info(req.body);
  console.info(`${req.method} request received to DELETE A NOTE`);

  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const parsedNotes = JSON.parse(data);
      console.log(parsedNotes[0]);
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

app.post("/api/notes", (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to ADD A NOTE`);

  const { title, text } = req.body;

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
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);

        fs.writeFile(`./db/db.json`, JSON.stringify(parsedNotes, null), (err) =>
          err
            ? console.error(err)
            : console.log(
                `Review for ${newNote.title} has been written to JSON file`
              )
        );
      }
    });

    const response = {
      status: "success",
      body: newNote,
    };
    console.log(response);

    res.status(201).json(response);
  } else {
    res.status(500).json("Error in posting review");
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
