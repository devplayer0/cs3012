async function githubUserInfo(user) {
  return await fetch(`https://api.github.com/users/${user}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json'
    }
  });
}

function _ghRecurseDGQ(i) {
  if (i == 0) {
    return '';
  }

  return `dependencyGraphManifests(first: 1, withDependencies: true) {
    nodes {
      dependencies {
        nodes {
          repository {
            nameWithOwner
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
  });
  if (!res.ok) {
    return null;
  }

  const data = res.json();
  return data;
}
