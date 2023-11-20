const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class NotesController {
  async create(request, response) {
    const { title, description, rating } = request.body;
    const { user_id } = request.params;

    const [movie_note_id] = await knex("movie_notes").insert({
      title,
      description,
      rating,
      user_id,
    });

    response.json(movie_note_id);
  }

  async show(request, response) {
    const { id } = request.params;

    const [movie_note] = await knex("movie_notes").where({ id });

    if(!movie_note) {
      throw new AppError("Nota de filme não encontrada");
    }

    return response.json(movie_note);
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("movie_notes").where({ id }).delete();

    return response.json();
  }
}

module.exports = NotesController;