const db = require('./db');

const Query = {
  company: (root, params) => db.companies.get(params.id),
  jobs: () => db.jobs.list(),
  job: (root, params) => db.jobs.get(params.id),
};

const Mutation = {
  createJob: (root, { input }, { user }) => {
    if (!user) {
      throw new Error('Unauthorized');
    }
    const id = db.jobs.create(input);
    return db.jobs.get(id);
  },
};

const Company = {
  jobs: (company) =>
    db.jobs.list().filter((job) => job.companyId === company.id),
};

const Job = {
  company: (job) => db.companies.get(job.companyId),
};

module.exports = { Query, Mutation, Company, Job };
