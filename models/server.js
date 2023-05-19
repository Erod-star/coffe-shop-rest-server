// require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usersPath = "/api/users";
    this.authPath = "/api/auth";

    // ? Connect to database
    this.connectDB();

    // ? Middlewares
    this.middlewares();

    // ? Routes
    this.routes();
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    // ? CORS
    this.app.use(cors());

    // ? Parse and lecture of the body
    this.app.use(express.json());

    // ? Public directory
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.authPath, require("../routes/auth.routes"));
    this.app.use(this.usersPath, require("../routes/users.routes"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Listening app on port ${this.port}`);
    });
  }
}

module.exports = Server;
