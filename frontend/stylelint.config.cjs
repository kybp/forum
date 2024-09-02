/* eslint-env node */

module.exports = {
  extends: ['stylelint-config-recommended-vue'],
  rules: {
    'unit-allowed-list': ['rem', 's', '%', 'vh', 'vw'],
    'block-no-empty': true,
  },
}
