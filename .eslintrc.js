const config = require('@garron/lint').eslint;

module.exports = {
  ...config,
  rules: {
    ...config.rules,
    'unicorn/no-process-exit': 0,
  },
};
