// apolloClient.js
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const adminSecret = "9kPV1Tvkh7Wl0b3BJ9isfyvr4qdm3dNJZku3YHqDJ3D3lNAzafQnupSOTDFaQRe2";

const httpLink = createHttpLink({
  uri: 'https://poetic-impala-21.hasura.app/v1/graphql',
  headers: {
    "x-hasura-admin-secret": adminSecret,
  },
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
