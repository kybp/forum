const globalData = require('@csstools/postcss-global-data')
const customMedia = require('postcss-custom-media')
const nested = require('postcss-nested')

module.exports = {
  plugins: [
    globalData({
      files: [
        'src/assets/breakpoints.css',
      ],
    }),
    customMedia,
    nested,
  ],
}
