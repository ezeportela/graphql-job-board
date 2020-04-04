// import { getAccessToken, isLoggedIn } from './auth';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import gql from 'graphql-tag';
const endpointURL = 'http://localhost:9000/api';

const client = new ApolloClient({
  link: new HttpLink({ uri: endpointURL }),
  cache: new InMemoryCache(),
});

// const request = async (query, variables = {}) => {
//   const request = {
//     method: 'POST',
//     headers: {
//       'content-type': 'application/json',
//     },
//     body: JSON.stringify({ query, variables }),
//   };
//   if (isLoggedIn()) {
//     request.headers['authorization'] = `Bearer ${getAccessToken()}`;
//   }
//   const response = await fetch(endpointURL, request);
//   const responseBody = await response.json();
//   if (responseBody.errors) {
//     const message = responseBody.errors
//       .map((error) => error.message)
//       .join('\n');
//     throw new Error(message);
//   }
//   return responseBody.data;
// };

export const createJob = async (input) => {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput) {
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
    }
  `;
  // const { job } = await request(mutation, { input });
  const {
    data: { job },
  } = await client.mutate({ mutation, variables: { input } });
  return job;
};

export const loadJobs = async () => {
  const query = gql`
    {
      jobs {
        id
        title
        company {
          id
          name
        }
      }
    }
  `;
  // const { jobs } = await request(query);
  const {
    data: { jobs },
  } = await client.query({ query });
  return jobs;
};

export const loadJob = async (id) => {
  const query = gql`
    query JobQuery($id: ID!) {
      job(id: $id) {
        id
        title
        company {
          id
          name
          description
        }
        description
      }
    }
  `;
  // const { job } = await request(query, { id });
  const {
    data: { job },
  } = await client.query({ query, variables: { id } });
  return job;
};

export const loadCompany = async (id) => {
  const query = gql`
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
  // const { company } = await request(query, { id });
  const {
    data: { company },
  } = await client.query({ query, variables: { id } });
  return company;
};
