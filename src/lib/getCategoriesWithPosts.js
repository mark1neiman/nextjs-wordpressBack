import { getApolloClient } from './apollo-client';
import { GET_CATEGORIES_WITH_POSTS } from './queries/GET_CATEGORIES_WITH_POSTS';

export async function getCategoriesWithPosts() {
  const apolloClient = getApolloClient();

  const data = await apolloClient.query({
    query: GET_CATEGORIES_WITH_POSTS,
  });

  return data.data.categories.edges;
}
