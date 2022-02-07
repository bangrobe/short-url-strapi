'use strict';

/**
 * shortener router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::shortener.shortener');
