const {hash, compare} = require("bcryptjs");
const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class UsersController {
  async create(request, response) {
    const { name, email, password, avatar } = request.body;

    const checkUserExists = await knex("users").where({email});
    
    if(checkUserExists) {
      throw new AppError("Este e-mail já está em uso.");
    }

    const hashedPassword = await hash(password, 8);

    await knex("users").insert({
      name, 
      email, 
      password: hashedPassword,
      avatar
    });

    return response.json();
  }

  async show(request, response) {
    const { id } = request.params;

    const [user] = await knex("users").where({ id });

    console.log(user);

    if(!user) {
      throw new AppError("Usuário não encontrado.");
    }

    return response.json(user);
  }

  async update(request, response) {
    const { name, email, old_password, password, avatar } = request.body;
    const { id } = request.params;

    const [user] = await knex("users").where({id})

    if(!user) {
      throw new AppError("Usuário não encontrado.");
    }

    const userWithUpdatedEmail = await knex("users").where({email});

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este e-mail já está em uso.");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if(password && !old_password) {
      throw new AppError("Você precisa informar a senha antiga para definir uma nova senha.");
    }

    if(password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if(!checkOldPassword) {
        throw new AppError("A senha antiga não confere.");
      }

      user.password = await hash(password, 8);
    }

    await knex("users").update({
      name, 
      email,
      password,
      avatar
    }).where({id})

    return response.json();
  }

  async delete(request, response) {
    const {email} = request.body;
    const {id} = request.params;
    
    await knex("users").where({id, email}).delete();

    return response.json();
  }
}

module.exports = UsersController;