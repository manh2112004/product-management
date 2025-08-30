const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const moment = require("moment");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const database = require("./config/database");
const systemConfig = require("./config/system");
const routeAdmin = require("./routes/admin/index-route");
const route = require("./routes/client/index-route");
database.connect();
const app = express();
const port = process.env.PORT;
// socket.io
const server = http.createServer(app);
const io = new Server(server);
global._io = io;
//end socket.io
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
app.use(cookieParser("keyboardcat"));
app.use(
  session({
    secret: "keyboardcat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);
app.use(flash());
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);
app.use(express.static(`${__dirname}/public`));
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;
routeAdmin(app);
route(app);
app.use((req, res) => {
  res.status(404).render("client/pages/error/404", {
    pageTitle: "404 Not Found",
  });
});
server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
