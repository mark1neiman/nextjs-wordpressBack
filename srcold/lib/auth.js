import { gql, ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: process.env.WORDPRESS_GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
});

export const verifyAuthToken = async (authToken) => {
    const VERIFY_TOKEN_QUERY = gql`
    query VerifyToken {
      viewer {
        id
      }
    }
  `;

    try {
        const { data } = await client.query({
            query: VERIFY_TOKEN_QUERY,
            context: {
                headers: {
                    authorization: `Bearer ${authToken}`
                }
            }
        });
        return !!data.viewer;
    } catch (error) {
        console.log(error);
        return false;
    }
};
