// require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    // ? Paths
    this.paths = {
      auth: "/api/auth",
      categories: "/api/categories",
      products: "/api/products",
      search: "/api/search",
      users: "/api/users",
    };

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
    this.app.use(this.paths.auth, require("../routes/auth.routes"));
    this.app.use(this.paths.categories, require("../routes/categories.routes"));
    this.app.use(this.paths.products, require("../routes/products.routes"));
    this.app.use(this.paths.search, require("../routes/search.routes"));
    this.app.use(this.paths.users, require("../routes/users.routes"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Listening app on port ${this.port}`);
    });
  }
}

module.exports = Server;
