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

export const GET_CATEGORIES_QUERY = gql`
query GetCategoriesWithPosts {
  categories(first: 100) {
    edges {
      node {
        id
        name
      }
    }
  }
}
`;

export const GET_POSTS_BY_CATEGORY_QUERY = gql`
  query GetPostsByCategory($categoryId: ID!) {
    posts(category: $categoryId) {
      edges {
        node {
          id
          title
          slug
        }
      }
    }
  }
`;
export const QUERY_POSTS = gql`
  query GetPosts($query: String!) {
    posts(where: { search: $query }) {
      edges {
        node {
          id
          title
          slug
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  }
`;

export const SEARCH_POSTS_QUERY = gql`
  query SearchPosts($searchQuery: String!) {
    posts(where: { search: $searchQuery }) {
      nodes {
        id
        title
        slug
        featuredImage {
          node {
            sourceUrl(size: THUMBNAIL)
          }
        }
      }
    }
  }
`;