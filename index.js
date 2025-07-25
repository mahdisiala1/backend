const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

app.use(cors());
let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
//custom token
morgan.token("detail", (request, response) => {
  if (request.method === "POST") {
    const body = request.body;
    return JSON.stringify(body);
  } else {
    return "";
  }
});
//listing
app.use(express.json());

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :detail"
  )
);

//API Calls
app.get("/", (request, response) => {
  response.send(`
  <h4>welcome to Phonebook </h4>
`);
});
app.get("/api/persons", (request, response) => {
  response.json(persons);
});
app.get("/info/", (request, response) => {
  const info = persons.length;
  const now = new Date();
  const part1 = now.toDateString();
  const part2 = now.toTimeString();
  response.send(`
  <h4>Phonebook has info for ${info} people</h4>
  <h4>${part1} ${part2}</h4>
`);
});
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((p) => p.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});
const generateid = () => {
  const id = Math.floor(Math.random() * 100000000);
  return String(id);
};
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "missing number or name",
    });
  } else if (
    persons.find((p) => p.name.toLowerCase() === body.name.toLowerCase())
  ) {
    return response.status(400).json({
      error: "name must be unique",
    });
  } else {
    const person = {
      id: generateid(),
      name: body.name,
      number: body.number,
    };
    persons = persons.concat(person);
    response.json(persons);
  }
});
//listener
app.listen(3001, () => {
  console.log("Server running on port 3001");
});
