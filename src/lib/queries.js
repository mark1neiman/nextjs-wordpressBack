import { gql } from "@apollo/client";

export const GET_CATEGORIES_WITH_POSTS = gql`
  query GetCategoriesWithPosts {
    categories(first: 100) {
      edges {
        node {
          id
          name
          posts {
            edges {
              node {
                id
                title
                slug
              }
            }
          }
        }
      }
    }
  }
`;
