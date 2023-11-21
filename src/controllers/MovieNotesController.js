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

  async index(request, response) {
    const { title, user_id, movie_tags } = request.query;

    let movie_notes;

    if (movie_tags) {
      const filteredTags = movie_tags.split(',').map(tag => tag.trim());

      movie_notes = await knex("movie_tags")
      .select([
        "movie_notes.id",
        "movie_notes.title",
        "movie_notes.user_id"
      ])
      .where("movie_notes.user_id", user_id)
      .whereLike("movie_notes.title", `%${title}%`)
      .whereIn("name", filteredTags)
      .innerJoin("movie_notes", "movie_notes.id", "movie_tags.movie_note_id")
      .orderBy("movie_notes.title")

    } else {
      movie_notes = await knex("movie_notes")
        .where({user_id})
        .whereLike("title", `%${title}%`)
        .orderBy("title");

      return response.json(movie_notes);
    }

    const userMovieTags = await knex("movie_tags").where({ user_id });
    const movieNotesWithTags = movie_notes.map(movie_note => {
      const movieNoteTags = userMovieTags.filter(movie_tag => movie_tag.note_id === movie_note.id);

      return {
        ...movie_note,
        movie_tags: movieNoteTags
      }
    });

    return response.json(movieNotesWithTags);
  }
}

module.exports = NotesController;