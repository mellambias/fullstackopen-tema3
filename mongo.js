const mongoose = require("mongoose");

if (process.argv.length < 3) {
	console.log("give password as argument");
	process.exit(1);
}

const password = process.argv[2];
console.log(password);

const url = `mongodb+srv://service:${password}@fullstackopen.zbjmh.mongodb.net/?retryWrites=true&w=majority&appName=fullstackopen`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

// Esquema de la nota
const noteSchema = new mongoose.Schema({
	content: String,
	important: Boolean,
});

// Modelo de la nota
const Note = mongoose.model("Note", noteSchema);

/* // Nueva nota
const note = new Note({
	content: "MongoDB is easy",
	important: true,
});

note.save().then((result) => {
	console.log("note saved!");
	mongoose.connection.close();
});
 */

Note.find({}).then((result) => {
	for (item of result) {
		console.log(item);
	}
	mongoose.connection.close();
});
