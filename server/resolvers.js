const db = require('./db');

const Query = {
  jobs: () => db.jobs.list(),
  job: (root, params) => db.jobs.get(params.id),

  companies: () => db.companies.list(),
  company: (root, params) => db.companies.get(params.id)
};

const Job = {
  company: job => db.companies.get(job.companyId)
};

module.exports = { Query, Job };
