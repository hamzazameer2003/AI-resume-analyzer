const { getTrendingJobs } = require("../services/trendingJobs.service");

async function list(req, res) {
  const data = await getTrendingJobs();
  return res.json(data);
}

module.exports = { list };
