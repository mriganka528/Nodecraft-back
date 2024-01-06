const express = require('express');
const fetchUser = require('../middleWare/fetchUser');
const router = express.Router();
const Note = require('../models/Notes');
const { body, validationResult } = require('express-validator');

//Fetch all notes using GET /api/notes/fetchallnotes
router.get('/notes/fetchallnotes', fetchUser, async (req, res) => {
     console.log('Fetching all notes');
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

//Adding a new note using POST "/api/notes/addnote" login required
router.post('/notes/addnote', fetchUser, [
    body('title', 'Enter a valied title..').isLength({ min: 3 }),
    body('description', 'Description must be at least 5 character...').isLength({ min: 5 })],
    async (req, res) => {
        const { title, description, tag } = req.body;
        const result = validationResult(req);
         console.log('Adding notes');
        try {
            if (result.isEmpty()) {
                const note = new Note({
                    title, description, tag, user: req.user.id
                })
                const saveData = await note.save();
                res.json(saveData);
            }
            else {
                res.status(400).json({ errors: result.array() });
                console.log(res.json());

            }
        } catch (err) {
            console.log(err.message);
            res.status(500).json({ error: "Internal Server Error" });
        }

    }
)

//Updating the existing note using  PUT  "/api/notes/update" login required
router.put('/notes/update/:id', fetchUser,
    async (req, res) => {
        const { title, description, tag } = req.body;
        try {
            //creating a new Notes object
            const newNote = {};
            if (title) {
                newNote.title = title;
            }
            if (description) {
                newNote.description = description;
            }
            if (tag) {
                newNote.tag = tag;
            }
            let note = await Note.findById(req.params.id);
            if (!note) {
                return res.status(404).send("Not found");
            }
            if (note.user.toString() !== req.user.id) {
                return res.status(401).json({ msg: "Not Allowed" });
            }
            note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });

            res.json(note);

        } catch (err) {
            console.log(err.message);
            res.status(500).json({ error: "Internal Server Error" });
        }

    }
)

//Deleting a note using  delete  "/api/notes/delete" login required
router.delete('/notes/delete/:id', fetchUser, async (req, res) => {
    //find the note to be deleted and delete it
    try {
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send({ error: "Not found" });
        }
        //check if the user owns this note or note
        if (note.user.toString() !== req.user.id) {
            return res.status(404).send({ error: "Not Allowed" });
        }
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ Succcess: "Successfully deleted😪" });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
})
module.exports = router;
