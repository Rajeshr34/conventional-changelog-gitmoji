const parserOpts = require("./parser-opts");

const MAJOR = [":boom:", "💥"];

const MINOR = [
  ":sparkles:",
  "✨",
  ":zap:",
  "⚡️",
  "⚡️",
  ":heart:",
  "❤",
  "❤️",
  ":alembic:",
  "⚗",
  "⚗",
  ":recycle:",
  "♻",
  "♻️"
];

module.exports = {
  parserOpts,

  whatBump: commits => {
    let level = 2;
    let breakings = 0;
    let features = 0;

    commits.forEach(commit => {
      if (MAJOR.includes(commit.type)) {
        breakings += 1;
        level = 0;
      } else if (MINOR.includes(commit.type)) {
        features += 1;
        if (level === 2) {
          level = 1;
        }
      }
    });

    return {
      level: level,
      reason: `There are ${breakings} BREAKING CHANGES and ${features} features`
    };
  }
};
