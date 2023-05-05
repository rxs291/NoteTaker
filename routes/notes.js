const router = require('express').Router();
const fs = require('fs');
const util = require('util');
const uuid = require('../helpers/uuid');

// promisify fs.readFile for async/await syntax
const readFromFile = util.promisify(fs.readFile);

router.get('/', (req, res) => {
  console.info(`${req.method} request received to GET NOTES`);

  readFromFile('db/db.json').then((data) => res.json(JSON.parse(data)));
});

// respond to a DELETE request at the /api/notes/:id URL by removing a note from the JSON file
router.delete('/:id', (req, res) => {
  console.info(req.body);
  console.info(`${req.method} request received to DELETE A NOTE`);
  //reading the db.json file, parsing the data, comparing the ID that was passed to every ID in the parsed data, then when matched, splicing the index of said ID, and writing the file back to db.json with the newly sliced data.
  fs.readFile('db/db.json', 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const parsedNotes = JSON.parse(data);
      for (let i = 0; i < parsedNotes.length; i++) {
        if (parsedNotes[i].id === req.params.id) {
          let index = parsedNotes.indexOf(parsedNotes[i]);

          parsedNotes.splice(index, 1);
          fs.writeFile(`db/db.json`, JSON.stringify(parsedNotes, null), (err) =>
            err
              ? console.error(err)
              : console.log(
                  `Note for ${newNote.title} has been REMOVED FROM JSON file`
                ),
                res.redirect('/')
          );
        }
      }
    }
  });
});
////at the given url, when fetched, adds the note information to the db.json data
router.post('/', (req, res) => {
  console.info(`${req.method} request received to ADD A NOTE`);

  const { title, text } = req.body;

  // Create a new note object with title, text, and a unique ID
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    fs.readFile('db/db.json', 'utf-8', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        // Parse the existing notes as JSON and append the new note
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);
        // Write the updated notes back to the JSON file
        fs.writeFile(`db/db.json`, JSON.stringify(parsedNotes, null), (err) =>
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
      status: 'success',
      body: newNote,
    };
    console.log(response);

    res.status(201).json(response);
  } else {
    // If either title or text is missing, send an error response
    res.status(500).json('Error in posting notes');
  }
});

module.exports = router;
