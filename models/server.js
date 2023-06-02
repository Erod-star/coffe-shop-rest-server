// require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { createServer } = require("http");

const { dbConnection } = require("../database/config");
const { socketController } = require("../sockets/controllers");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.server = createServer(this.app);
    this.io = require("socket.io")(this.server);

    // ? Paths
    this.paths = {
      auth: "/api/auth",
      categories: "/api/categories",
      products: "/api/products",
      search: "/api/search",
      users: "/api/users",
      uploads: "/api/uploads",
    };

    // ? Connect to database
    this.connectDB();

    // ? Middlewares
    this.middlewares();

    // ? Routes
    this.routes();

    // ? Sockets
    this.socketEvents();
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

    // ? Fileupload
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth.routes"));
    this.app.use(this.paths.categories, require("../routes/categories.routes"));
    this.app.use(this.paths.products, require("../routes/products.routes"));
    this.app.use(this.paths.search, require("../routes/search.routes"));
    this.app.use(this.paths.users, require("../routes/users.routes"));
    this.app.use(this.paths.uploads, require("../routes/uploads.routes"));
  }

  socketEvents() {
    this.io.on("connection", (socket) => socketController(socket, this.io));
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log(`Listening app on port ${this.port}`);
    });
  }
}

module.exports = Server;
