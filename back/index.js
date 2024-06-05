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
    methods: ["POST", "GET", "DELETE"],
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

//register endpoint
app.post("/register", async (req, res) => {
  try {
    if (req.body.role === "logistic manager") {
      const managerUsers = await readJSONFile(
        path.join(__dirname, "managers.json")
      );
      const newManagerUser = {
        id: managerUsers.length + 1,
        username: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
      };
      managerUsers.push(newManagerUser);
      fs.writeFileSync(
        path.join(__dirname, "managers.json"),
        JSON.stringify(managerUsers, null, 2)
      );
      res.json(newManagerUser);
    } else if (req.body.role === "delivery personnel") {
      const deliveryUsers = await readJSONFile(
        path.join(__dirname, "delivery_personnel.json")
      );
      const newDeliveryUser = {
        id: deliveryUsers.length + 1,
        username: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
      };
      deliveryUsers.push(newDeliveryUser);
      fs.writeFileSync(
        path.join(__dirname, "delivery_personnel.json"),
        JSON.stringify(deliveryUsers, null, 2)
      );
      res.json(newDeliveryUser);
    }
  } catch (error) {
    console.error("Error reading or writing the data: ", error);
    res.json({ Message: "Error reading or writing the data" });
  }
});

//login endpoint
app.post("/login", async (req, res) => {
  try {
    const managers = await readJSONFile(path.join(__dirname, "managers.json"));
    const deliveryPersonnel = await readJSONFile(
      path.join(__dirname, "delivery_personnel.json")
    );

    const user = managers.find(
      (u) => u.email === req.body.email && u.password === req.body.password
    );

    if (!user) {
      const deliveryUser = deliveryPersonnel.find(
        (u) => u.email === req.body.email && u.password === req.body.password
      );

      if (deliveryUser) {
        req.session.username = deliveryUser.username;
        req.session.role = "delivery personnel";
        res.json({
          Login: true,
          username: req.session.username,
          role: req.session.role,
        });
      } else {
        res.json({ Login: false });
      }
    } else {
      req.session.username = user.username;
      req.session.role = "logistic manager";
      res.json({
        Login: true,
        username: req.session.username,
        role: req.session.role,
      });
    }
  } catch (error) {
    res.json({ Message: "Error reading data" });
  }
});

//getting the profile of user
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

//logout endpoint
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "User logged out" });
  });
});

//posting an order endpoint
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
      delivererId: req.body.delivererId,
      delivererName: req.body.delivererName,
      pay: req.body.pay,
      bargain: req.body.bargain,
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

//endpoint for viewing all jobs
app.get("/allJobs", async (req, res) => {
  try {
    const orders = await readJSONFile(path.join(__dirname, "jobs.json"));
    res.json(orders);
  } catch (error) {
    console.error("Error reading or writing the data: ", error);
    res.json({ Message: "Error reading or writing the data" });
  }
});

//endpoint for fetching all delivery personnel
app.get("/delivery_personnel", async (req, res) => {
  try {
    const delivery_personnel = await readJSONFile(
      path.join(__dirname, "delivery_personnel.json")
    );
    res.json(delivery_personnel);
  } catch (error) {
    console.log("Error fetching data", error);
  }
});

//endpoint for deleting an order
app.delete("/orders/:id", (req, res) => {
  const { id } = req.params;

  try {
    const jobs = JSON.parse(fs.readFileSync(path.join(__dirname, "jobs.json")));
    const updatedJobs = jobs.filter((job) => job.id !== parseInt(id));
    fs.writeFileSync(
      path.join(__dirname, "jobs.json"),
      JSON.stringify(updatedJobs, null, 2)
    );
    res.json({ message: "Order successfully canceled" });
  } catch (error) {
    console.error("Error canceling order:", error);
    res.status(500).json({ error: "Failed to cancel order" });
  }
});

app.listen(8081, () => {
  console.log("Connected");
});
