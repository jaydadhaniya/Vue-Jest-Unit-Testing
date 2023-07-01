const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const database = require("./database");

require("./env");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to HealthPlus!");
});

app.post("/api/adminLogin", (req, res) => {
  let data = req.body;
  try {
    const result = database.login(data);
    return res.status(200).send(result);
  } catch (err) {
    res.status(err.status || 401).send({
      error: {
        status: err.status || 401,
        message: err.message || "Internal Server Error",
      },
    });
  }
});

app.get("/api/patient/all", (req, res) => {
  try {
    const result = database.getPatientList();
    res.send(JSON.parse(JSON.stringify(result)));
  } catch (err) {
    res.status(err.status || 500).send({
      error: {
        status: err.status || 500,
        message: err.message || "Internal Server Error",
      },
    });
  }
});

app.post("/api/patient/add", (req, res) => {
  try {
    database.addPatientDetails(req.body);
    res.send('success');
  } catch (err) {
    res.status(err.status || 500).send({
      error: {
        status: err.status || 500,
        message: err.message || "Internal Server Error",
      },
    });
  }
});

app.put("/api/patient/:id", (req, res) => {
  try {
    database.updatePatientDetails(req.body, req.params.id);
    res.send('success');
  } catch (err) {
    res.status(err.status || 500).send({
      error: {
        status: err.status || 500,
        message: err.message || "Internal Server Error",
      },
    });
  }
});

app.delete("/api/patient/:id", (req, res) => {
  try {
    database.removePatient(req.params.id);
    res.send('success');
  } catch (error) {
    res.status(err.status || 500).send({
      error: {
        status: err.status || 500,
        message: err.message || "Internal Server Error",
      },
    });
  }
});

app.put("/api/admin/update", (req, res) => {
  try {
    database.updateAdminDetails(req.body);
    res.send('success');
  } catch (err) {
    res.status(err.status || 500).send({
      error: {
        status: err.status || 500,
        message: err.message || "Internal Server Error",
      },
    });
  }
});



app.listen(port, () => {
  console.log(`YamiFood app listening at http://localhost:${port}`);
});

// custom Error handler
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500);
  res.send({
    error: err,
    stackTrace: err.stack,
  });
});

// CORS setup
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
