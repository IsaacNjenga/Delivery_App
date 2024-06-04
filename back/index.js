const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 },
  })
);

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

app.post("/register", async (req, res) => {
  try {
    const users = await readJSONFile(path.join(__dirname, "data.json"));
    const newUser = {
      id: users.length + 1,
      username: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
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

app.get("/profile", (req, res) => {
  if (req.session.username) {
    res.json({ username: req.session.username });
  } else {
    res.json(null);
  }
});

app.get("/", (req, res) => {
  if (req.session.username) {
    return res.json({ valid: true, username: req.session.username });
  } else {
    return res.json({ valid: false });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "User logged out" });
  });
});

app.post("/order", async (req, res) => {
  try {
    const orders = await readJSONFile(path.join(__dirname, "jobs.json"));
    const newOrder = {
      id: orders.length + 1,
      name: req.body.name,
      location: req.body.location,
      type: req.body.type,
      time: req.body.time,
      payment: req.body.payment,
    };
    orders.push(newOrder);
    fs.writeFileSync(
      path.join(__dirname, "jobs.json"),
      JSON.stringify(orders, null, 2)
    );
    res.json(newOrder);
  } catch (error) {
    console.error("Error reading or writing the data: ", error);
    res.json({ Message: "Error reading or writing the data" });
  }
});

app.get("/allJobs", async (req, res) => {
  try {
    const orders = await readJSONFile(path.join(__dirname, "jobs.json"));
    res.json(orders);
  } catch (error) {
    console.error("Error reading or writing the data: ", error);
    res.json({ Message: "Error reading or writing the data" });
  }
});

app.listen(8081, () => {
  console.log("Connected");
});
