const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();

// Configuring CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET"],
    credentials: true,
  })
);

// Configuring the middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  session({
    secret: "secret", // to encrypt the session cookie
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 },
  })
);

// Helper function to read the JSON file
const readJSONFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

// Route for registering a new user
app.post("/register", async (req, res) => {
  try {
    const users = await readJSONFile(path.join(__dirname, "data.json"));
    const newUser = {
      id: users.length + 1,
      username: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };
    users.push(newUser);
    fs.writeFileSync(
      path.join(__dirname, "data.json"),
      JSON.stringify(users, null, 2)
    );
    res.json(newUser);
  } catch (error) {
    console.error("Error reading or writing the data: ", error);
    res.json({ Message: "Error reading or writing the data" });
  }
});

// Route for a user login
app.post("/login", async (req, res) => {
  try {
    const users = await readJSONFile(path.join(__dirname, "data.json"));
    const user = users.find(
      (u) => u.email === req.body.email && u.password === req.body.password
    );

    if (user) {
      req.session.username = user.username;
      res.json({ Login: true, username: req.session.username });
    } else {
      res.json({ Login: false });
    }
  } catch (error) {
    res.json({ Message: "Error reading data" });
  }
});

// Route for checking session
app.get("/", (req, res) => {
  if (req.session.username) {
    return res.json({ valid: true, username: req.session.username });
  } else {
    return res.json({ valid: false });
  }
});

app.listen(8081, () => {
  console.log("Connected");
});
