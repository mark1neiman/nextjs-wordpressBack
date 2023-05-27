import { gql } from '@apollo/client';

export const CATEGORIES_QUERY = gql`
  query Categories {
    categories {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
  }
`;

export const POSTS_BY_CATEGORY_QUERY = gql`
  query PostsByCategory($id: ID!) {
    category(id: $id) {
      posts {
        nodes {
          id
          title
          slug
          excerpt
          date
          category {
            nodes {
              slug
            }
          }
          author {
            node {
              name
            }
          }
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }
    }
  }
`;


export const POST_BY_SLUG_QUERY = gql`
  query PostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      content
      date
      author {
        node {
          name
        }
      }
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`;
