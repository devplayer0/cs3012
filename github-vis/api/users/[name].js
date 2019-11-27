const Octokit = require("@octokit/rest");

const octokit = Octokit({
  auth: process.env.GITHUB_TOKEN,
  userAgent: 'cs3012 github-vis'
});

export default async function(req, res) {
  const ghRes = await octokit.users
    .getByUsername({ username: req.query.name })
    .catch(err => ({ status: err.status }));

  res
    .status(ghRes.status)
    .json(ghRes.data);
}
