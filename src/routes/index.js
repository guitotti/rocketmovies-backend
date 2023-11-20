const {Router} = require("express");

const usersRouter = require("./users.routes.js");
const movieNotesRouter = require("./movie_notes.routes.js");

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/movie_notes", movieNotesRouter);

module.exports = routes;