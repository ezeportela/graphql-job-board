import { getAccessToken, isLoggedIn } from './auth';

const endpointURL = 'http://localhost:9000/api';

const request = async (query, variables = {}) => {
  const request = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  };
  if (isLoggedIn()) {
    request.headers['authorization'] = `Bearer ${getAccessToken()}`;
  }
  const response = await fetch(endpointURL, request);
  const responseBody = await response.json();
  if (responseBody.errors) {
    const message = responseBody.errors
      .map((error) => error.message)
      .join('\n');
    throw new Error(message);
  }
  return responseBody.data;
};

export const createJob = async (input) => {
  const mutation = `mutation CreateJob($input: CreateJobInput) {
    job: createJob(input: $input) {
      id
      title
      description
      company {
        id
        name
        description
      }
    }
  }`;
  const { job } = await request(mutation, { input });
  return job;
};

export const loadJobs = async () => {
  const query = `{
    jobs {
      id
      title
      company {
        id
        name
      }
    }
  }`;
  const { jobs } = await request(query);
  return jobs;
};

export const loadJob = async (id) => {
  const query = `query JobQuery($id: ID!) {
      job(id: $id) {
        id,
        title,
        company {
          id
          name
          description
        }
        description
      }
    }
  `;
  const { job } = await request(query, { id });
  return job;
};

export const loadCompany = async (id) => {
  const query = `
    query CompanyQuery($id: ID!) {
      company(id: $id) {
        id
        name
        description
        jobs {
          id
          title
        }
      }
    }
  `;
  const { company } = await request(query, { id });
  return company;
};
