"use strict";

const Q = require("q");
const readFile = Q.denodeify(require("fs").readFile);
const resolve = require("path").resolve;

module.exports = Q.all([
  readFile(resolve(__dirname, "./templates/template.hbs"), "utf-8"),
  readFile(resolve(__dirname, "./templates/header.hbs"), "utf-8"),
  readFile(resolve(__dirname, "./templates/commit.hbs"), "utf-8"),
]).spread((template, header, commit) => {
  const writerOpts = getWriterOpts();

  writerOpts.mainTemplate = template;
  writerOpts.headerPartial = header;
  writerOpts.commitPartial = commit;

  return writerOpts;
});

function getWriterOpts() {
  const detailedTypes = {
    ":bug:": "Bug Fixes",
    ":sparkles:": "Features",
    ":boom:": "Breaking Changes",
  };
  const featuredTypes = [];
  for (let [key, value] of Object.entries(detailedTypes)) {
    featuredTypes.push(`${key} ${value}`);
  }
  return {
    transform: commit => {
      let typeLength;

      // Do not render non-compliant commits.
      if (!commit.type || typeof commit.type !== "string") {
        return;
      }

      if (detailedTypes[commit.type])
        commit.type += ` ${detailedTypes[commit.type]}`;

      commit.type = commit.type.substring(0, 72);
      typeLength = commit.type.length;

      if (typeof commit.hash === "string") {
        commit.hash = commit.hash.substring(0, 7);
      }

      if (typeof commit.subject === "string") {
        commit.subject = commit.subject.substring(0, 72 - typeLength);
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
              commits: [commit],
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
    },
  };
}
