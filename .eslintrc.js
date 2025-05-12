// eslint-disable-next-line import/no-extraneous-dependencies
const { createConfig } = require('@openedx/frontend-build');

const config = createConfig('eslint');

/* Custom config manipulations */
config.rules = {
  'import/no-named-as-default': 'off',
  'react/function-component-definition': 'off',
  '@typescript-eslint/naming-convention': 'off',
};

config.ignorePatterns = ["*.json", ".eslintrc.js", "*.config.js",];

module.exports = config;
