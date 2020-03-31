const endpointURL = 'http://localhost:9000/api';

const fetchData = async requestData => {
  const response = await fetch(endpointURL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(requestData)
  });

  return await response.json();
};

export const loadJobs = async () => {
  const response = await fetchData({
    query: `{
      jobs {
        id
        title
        company {
          id
          name
        }
      }
    }`
  });

  return response.data.jobs;
};

export const loadJob = async id => {
  const response = await fetchData({
    query: `
      query JobQuery($id: ID!) {
        job(id: $id) {
          id,
          title,
          company {
            id,
            name,
            description
          }
          description
        }
      }
    `,
    variables: { id }
  });

  return response.data.job;
};
