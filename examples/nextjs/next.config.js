/**
 * @type {import('next').NextConfig}
 */
const next = {
  webpack(config) {
    // yarn portal
    config.resolve.alias.i18nano = require.resolve('../../');

    return config;
  }
};

module.exports = next;
