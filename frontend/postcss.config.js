const globalData = require('@csstools/postcss-global-data')
const customMedia = require('postcss-custom-media')

module.exports = {
  plugins: [
    globalData({
      files: [
        'src/assets/breakpoints.css',
      ],
    }),
    customMedia,
  ],
}
