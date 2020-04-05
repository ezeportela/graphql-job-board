import { getAccessToken, isLoggedIn } from './auth';
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from 'apollo-boost';
import gql from 'graphql-tag';
const endpointURL = 'http://localhost:9000/api';

const authLink = new ApolloLink((operation, forward) => {
  if (isLoggedIn()) {
    operation.setContext({
      headers: {
        authorization: `Bearer ${getAccessToken()}`,
      },
    });
  }
  return forward(operation);
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, new HttpLink({ uri: endpointURL })]),
  cache: new InMemoryCache(),
});

const fragmentJobDetails = gql`
  fragment JobDetails on Job {
    id
    title
    description
    company {
      id
      name
      description
    }
  }
`;

const companyJob = gql`
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

const createJobQuery = gql`
  mutation CreateJob($input: CreateJobInput) {
    job: createJob(input: $input) {
      ...JobDetails
    }
  }
  ${fragmentJobDetails}
`;

const jobQuery = gql`
  query JobQuery($id: ID!) {
    job(id: $id) {
      ...JobDetails
    }
  }
  ${fragmentJobDetails}
`;

const jobsQuery = gql`
  query JobsQuery {
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

export const createJob = async (input) => {
  const {
    data: { job },
  } = await client.mutate({
    mutation: createJobQuery,
    variables: { input },
    update: (cache, { data }) =>
      cache.writeQuery({
        query: jobQuery,
        variables: { id: data.job.id },
        data,
      }),
  });
  return job;
};

export const loadJobs = async () => {
  const {
    data: { jobs },
  } = await client.query({ query: jobsQuery, fetchPolicy: 'no-cache' });
  return jobs;
};

export const loadJob = async (id) => {
  const {
    data: { job },
  } = await client.query({ query: jobQuery, variables: { id } });
  return job;
};

export const loadCompany = async (id) => {
  const {
    data: { company },
  } = await client.query({ query: companyJob, variables: { id } });
  return company;
};
