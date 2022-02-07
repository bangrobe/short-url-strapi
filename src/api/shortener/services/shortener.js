'use strict';

/**
 * shortener service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::shortener.shortener');
