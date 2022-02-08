const { CCMPlugin } = require('@css-components/webpack');

module.exports = function override(config, env) {
  config.plugins.push(new CCMPlugin());
  return config;
};
