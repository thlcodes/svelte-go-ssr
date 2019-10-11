const production = !process.env.ROLLUP_WATCH;
const purgecss = require("@fullhuman/postcss-purgecss");

module.exports = {
  plugins: [
    require("postcss-import")(),
    require("tailwindcss"),
    require("autoprefixer"),
    // Only purge css on production
    production &&
      purgecss({
        content: ["./**/*.html", "./**/*.svelte"],
        defaultExtractor: content => {
          const regExp = new RegExp(/[A-Za-z0-9-_:/]+/g);      
          const matchedTokens = [];      
          let match = regExp.exec(content);      
          while (match) {
              if (match[0].startsWith('class:')) {
                  matchedTokens.push(match[0].substring(6));
              } else {
                  matchedTokens.push(match[0]);
              }      
              match = regExp.exec(content);
          }      
          return matchedTokens;
        }
      })
  ]
};