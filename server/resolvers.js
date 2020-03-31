const db = require('./db');

const Query = {
  jobs: () => db.jobs.list(),

  job: (root, params) => db.jobs.get(params.id)
};

const Job = {
  company: job => db.companies.get(job.companyId)
};

module.exports = { Query, Job };
