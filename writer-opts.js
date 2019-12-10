"use strict";

const Q = require("q");
const readFile = Q.denodeify(require("fs").readFile);
const resolve = require("path").resolve;

const gitmojisList = require("./gitmojis.json");

const gitmojis = gitmojisList.reduce((acc, e) => {
  e.symbols.forEach(s => {
    acc[s] = {
      desc: e.description,
      name: e.symbols[0]
    };
  });
  return acc;
}, []);

const resolveType = type => {
  type = type.trim();
  return gitmojis[type]
    ? `${gitmojis[type].name} ${gitmojis[type].desc}`
    : type;
};

module.exports = Q.all([
  readFile(resolve(__dirname, "./templates/template.hbs"), "utf-8"),
  readFile(resolve(__dirname, "./templates/header.hbs"), "utf-8"),
  readFile(resolve(__dirname, "./templates/commit.hbs"), "utf-8")
]).spread((template, header, commit) => {
  const writerOpts = getWriterOpts();

  writerOpts.mainTemplate = template;
  writerOpts.headerPartial = header;
  writerOpts.commitPartial = commit;

  return writerOpts;
});

function getWriterOpts() {
  const featuredTypes = [
    `:boom: ${gitmojis[":boom:"].desc}`,
    `:sparkles: ${gitmojis[":sparkles:"].desc}`,
    `:bug: ${gitmojis[":bug:"].desc}`
  ];
  return {
    transform: commit => {
      // Do not render non-compliant commits.
      if (!commit.type || typeof commit.type !== "string") {
        return;
      }

      // Add human-readable type description for known types.
      commit.type = resolveType(commit.type);
      if (typeof commit.hash === "string") {
        commit.hash = commit.hash.substring(0, 7);
      }

      return commit;
    },
    groupBy: "type",
    commitGroupsSort: (a, b) => {
      if (featuredTypes.indexOf(a.title) !== -1) {
        return -1;
      }
      if (featuredTypes.indexOf(b.title) !== -1) {
        return 1;
      }
      return a.title.localeCompare(b.title);
    },
    commitsSort: ["type", "subject"],
    finalizeContext: (context, options, commits, keyCommit) => {
      // Sub-group by scope
      context.commitGroups.forEach(group => {
        group.scopedCommits = {};
        group.commits.forEach(commit => {
          if (!commit.scope) {
            commit.scope = "others";
          }
          if (group.scopedCommits[commit.scope]) {
            group.scopedCommits[commit.scope].commits.push(commit);
          } else {
            group.scopedCommits[commit.scope] = {
              name: commit.scope,
              commits: [commit]
            };
          }
          group.count = group.commits.length;
        });
      });

      // Split featured groups
      context.featuredCommitGroups = context.commitGroups.filter(
        group => featuredTypes.indexOf(group.title) !== -1
      );
      context.commitGroups = context.commitGroups.filter(
        group => featuredTypes.indexOf(group.title) === -1
      );
      return context;
    }
  };
}
