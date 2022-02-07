module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'ed9f8a65cb9299f1ad8b5bae37b81f6a'),
  },
});
