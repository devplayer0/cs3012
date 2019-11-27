async function githubUserInfo(user) {
  const res = await fetch(`https://api.github.com/users/${user}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json'
    }
  }).catch(err => null);
  if (!res.ok) {
    return null;
  }

  return await res.json();
}

function _ghRecurseDGQ(i) {
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
            ${_ghRecurseDGQ(i-1)}
          }
        }
      }
    }
  }`;
}

// Max GraphQL depth for GitHub is 25, so 4 is our limit here
async function githubDependencyGraph(token, repo, depth = 2) {
  const repoSplit = repo.split('/');
  const query = `query {
    repository(owner: "${repoSplit[0]}", name: "${repoSplit[1]}") {
      nameWithOwner
      forkCount
      stargazers {
        totalCount
      }
      ${_ghRecurseDGQ(depth)}
    }
  }`;

  const res = await fetch(`https://api.github.com/graphql`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.hawkgirl-preview+json'
    },
    body: JSON.stringify({ query })
  }).catch(err => null);
  if (!res || !res.ok) {
    return null;
  }

  return await res.json();
}

function _ghNLDGRecurse(repo, nodes, links) {
  if (nodes[repo.nameWithOwner]) {
    return;
  }
  nodes[repo.nameWithOwner] = { stars: repo.stargazers.totalCount, forks: repo.forkCount };

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

    links.push({ source: repo.nameWithOwner, target: r.nameWithOwner });
    _ghNLDGRecurse(r, nodes, links);
  });
}
async function githubNLDependencyGraph(token, repo, depth = 2) {
  const data = await githubDependencyGraph(token, repo, depth);
  if (!data || !data.data.repository) {
    return null;
  }

  let nodes = {};
  let links = [];
  _ghNLDGRecurse(data.data.repository, nodes, links);
  nodes[repo].fx = 0;
  nodes[repo].fy = 0;
  nodes = _.values(_.mapValues(nodes, (n, r) => {
    n.name = r;
    return n;
  }));

  return { nodes, links };
}
