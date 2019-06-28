const parserOpts = require("./parser-opts");

module.exports = {
  parserOpts,

  whatBump: commits => {
    let level = 2;
    let breakings = 0;
    let features = 0;

    commits.forEach(commit => {
      if (commit.type === ":boom:") {
        breakings += 1;
        level = 0;
      } else if (commit.type === ":sparkles:") {
        features += 1;
        if (level === 2) {
          level = 1;
        }
      }
    });

    return {
      level: level,
      reason: `There are ${breakings} BREAKING CHANGES and ${features} features`,
    };
  },
};
