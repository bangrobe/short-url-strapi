"use strict";

/**
 *  shortener controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::shortener.shortener",
  ({ strapi }) => ({
    //If it is called by an authenticated user, we only show records that belong to that user.
    //If it is called by an unauthenticated user, we filter based on the query provided,
    async find(ctx) {
      let { query } = ctx;
      const user = ctx.state.user;
      let entity;
      if (user) {
        query = { poster: { $eq: user.id } };
        console.log(query);
        entity = await strapi
          .service("api::shortener.shortener")
          .find({ filters: query });
      } else {
        query = { alias: { $eq: query.alias } };
        console.log(query);
        entity = await strapi
          .service("api::shortener.shortener")
          .find({ filters: query });
        //If found we also increment the visit field in the shortner collection to track the visit.
        if (entity.results.length !== 0) {
          let id = entity.results[0].id;
          let visit = Number(entity.results[0].visit) + 1;
          await strapi
            .service("api::shortener.shortener")
            .update(id, { data: { visit } });
        }
      }
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    },
    //For the create method; we use it to create a new record as well as assign the user field in the shortner collection to the authenticated user’s ID.
    async create(ctx) {
      console.log(ctx.request.body);
      const data = ctx.request.body;
      const user = ctx.state.user;
      let entity;
      data.poster = user.id;
      entity = await strapi
        .service("api::shortener.shortener")
        .create({ data });
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    },
    //For the delete method; we use it to remove a record from the shortner collection, only a user that created a record is allowed to delete it.
    async delete(ctx) {
      let { id } = ctx.params;
      const user = ctx.state.user;
      let entity;
      let query = { poster: { $eq: user.id }, id: { $eq: id } };
      entity = await strapi
        .service("api::shortener.shortener")
        .find({ filters: query });
      if (entity.results.length === 0) {
        return ctx.badRequest(null, [
          { message: [{ id: "You can not delete someone else content" }] },
        ]);
      }
      entity = await strapi.service("api::shortener.shortener").delete(id);
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    },
  })
);
