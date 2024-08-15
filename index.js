const express = require("express");
const cors = require("cors");
const app = express();
const Note = require("./models/note");
const serverConfig = require("./env");

const PORT = serverConfig.getServerPort();

// Middlewares

const requestLogger = (req, res, next) => {
	console.log("Method:", req.method);
	console.log("Path:  ", req.path);
	console.log("Body:  ", req.body);
	console.log("---");
	next();
};

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (err, req, res, next) => {
	console.error("name", err.name, "message", err.message);

	switch (err.name) {
		case "CastError":
			return res.status(400).send({ error: err.message });
		case "ValidationError":
			return res.status(400).json({ error: err.message });
		default:
			break;
	}
	next(err);
};

// rutas
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(requestLogger);

app.get("/", (req, res) => {
	res.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (req, res) => {
	Note.find({}).then((notes) => {
		res.json(notes);
	});
});

app.get("/api/notes/:id", (req, res, next) => {
	Note.findById(req.params.id)
		.then((note) => {
			if (note) {
				res.json(note);
			} else {
				res.status(404).end();
			}
		})
		.catch((err) => next(err));
});

app.delete("/api/notes/:id", (req, res, next) => {
	Note.findByIdAndDelete(req.params.id)
		.then((result) => {
			res.status(204).end();
		})
		.catch((err) => next(err));
});

app.put("/api/notes/:id", (req, res, next) => {
	const { important } = req.body;

	Note.findByIdAndUpdate(
		req.params.id,
		{ important },
		{ new: true, runValidators: true },
	)
		.then((updatedNote) => {
			res.json(updatedNote);
		})
		.catch((err) => next(err));
});

app.post("/api/notes", (req, res, next) => {
	const note = req.body;

	const newNote = new Note({
		content: note.content,
		important:
			typeof note.important !== "undefined" ? Boolean(note.important) : false,
		date: new Date().toISOString(),
	});

	newNote
		.save()
		.then((savedNote) => {
			res.status(201).json(savedNote);
		})
		.catch((error) => next(error));
});

// controlador de solicitudes no encontradas
app.use(unknownEndpoint);

// error handler debe ser el último middleware cargado
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Notes Server running on port ${PORT}`);
});
