async function githubUserInfo(user) {
  const res = await fetch(`/api/users/${user}`).catch(err => null);
  if (!res || !res.ok) {
    return null;
  }

  return await res.json();
}

async function githubNLDependencyGraph(repo, depth = 2) {
  const res = await fetch(`/api/dependencies/${encodeURIComponent(repo)}?depth=${depth}`).catch(err => null);
  if (!res || !res.ok) {
    return null;
  }

  const data = await res.json();
  data.nodes = _.map(data.nodes, n => {
    if (n.name == repo) {
      n.fx = 0;
      n.fy = 0;
    }
    return n;
  });

  return data;
}
