const _ = require('lodash');
const { graphql } = require("@octokit/graphql");

const authQl = graphql.defaults({
  headers: {
    'Authorization': `token ${process.env.GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.hawkgirl-preview+json'
  }
});

function buildQuery(i) {
  if (i == 0) {
    return '';
  }

  return `dependencyGraphManifests(first: 1, withDependencies: true) {
    nodes {
      dependencies(first: 10) {
        nodes {
          repository {
            nameWithOwner
            forkCount
            stargazers(first: 0) {
              totalCount
            }
            ${buildQuery(i-1)}
          }
        }
      }
    }
  }`;
}
// Max GraphQL depth for GitHub is 25, so 4 is our limit here
async function dGraphQuery(repo, depth = 2) {
  const query = `query dependencyGraph($owner: String!, $name: String!) {
    repository(owner:$owner, name:$name) {
      nameWithOwner
      forkCount
      stargazers {
        totalCount
      }
      ${buildQuery(depth)}
    }
  }`;

  const repoSplit = repo.split('/');
  return await authQl({
    query,
    owner: repoSplit[0],
    name: repoSplit[1]
  }).catch(err => null);
}

function resRecurse(repo, nodes, links) {
  if (nodes[repo.nameWithOwner]) {
    return;
  }
  nodes[repo.nameWithOwner] = {
    stars: repo.stargazers.totalCount,
    forks: repo.forkCount
  };

  const manifests = repo.dependencyGraphManifests;
  if (!manifests) {
    return;
  }
  const deps = manifests.nodes[0];
  if (!deps) {
    return;
  }
  _.forOwn(deps.dependencies.nodes, n => {
    const r = n.repository;
    if (!r) {
      return;
    }

    links.push({
      source: repo.nameWithOwner,
      target: r.nameWithOwner
    });
    resRecurse(r, nodes, links);
  });
}
async function dependencyGraph(repo, depth = 2) {
  const data = await dGraphQuery(repo, depth);
  if (!data || !data.repository) {
    return null;
  }

  let nodes = {};
  let links = [];
  resRecurse(data.repository, nodes, links);
  nodes = _.values(_.mapValues(nodes, (n, r) => {
    n.name = r;
    return n;
  }));

  return { nodes, links };
}

export default async function(req, res) {
  const repo = decodeURIComponent(req.query.repo);
  const depth = _.clamp(+req.query.depth || 1, 1, 4);

  const data = await dependencyGraph(repo, depth);
  if (!data) {
    res
      .status(500)
      .json({
        message: 'GitHub GraphQL error'
      });
    return;
  }

  res.json(data);
}
