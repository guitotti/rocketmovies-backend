const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class MovieTagsController {
  async index(request, response) {
    const { user_id } = request.params;

    const movie_tags = await knex("movie_tags")
    .where({ user_id });

    return response.json(movie_tags);
  }
}

module.exports = MovieTagsController;