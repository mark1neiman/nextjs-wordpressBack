import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from 'apollo-link-context';
import fetch from 'isomorphic-unfetch';
import { removeLastTrailingSlash } from 'lib/util';
let client;

/**
 * getApolloClient
 */

export function getApolloClient() {
  if (!client) {
    client = _createApolloClient();
  }
  return client;
}

/**
 * createApolloClient
 */

export function _createApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: removeLastTrailingSlash(process.env.WORDPRESS_GRAPHQL_ENDPOINT),
    }),
    cache: new InMemoryCache({
      typePolicies: {
        RootQuery: {
          queryType: true,
        },
        RootMutation: {
          mutationType: true,
        },
      },
    }),
  });
}

/**
 * Apollo auth
 */

export const createApolloClient = (authToken) => {
  const httpLink = new HttpLink({
    uri: process.env.WORDPRESS_GRAPHQL_ENDPOINT,
    fetch,
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: authToken ? `Bearer ${authToken}` : '',
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};
