import { gql } from "@apollo/client";


export const GET_CATEGORIES_WITH_POSTS = gql`
  query GetCategoriesWithPosts {
    categories(first: 100) {
      edges {
        node {
          id
          name
          slug
          posts {
            edges {
              node {
                id
                title
                slug
                categories {
                  nodes {
                    slug
                  }
                }
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
query SearchPosts($searchQuery: String!, $category: String!) {
  posts(where: { search: $searchQuery, categoryName: $category }) {
    nodes {
      id
      title
      slug
      featuredImage {
        node {
          sourceUrl
        }
      }
      categories {
        nodes {
          slug
        }
      }
    }
  }
}
`;


export const GET_CATEGORIES_SEARCH = gql`
  query CategoriesQuery {
    categories {
      nodes {
        name
        slug
      }
    }
  }
`;


export const ALL_POSTS_QUERY = gql`
  query AllPosts {
    posts {
      nodes {
        id
        title
        slug
        content
        date
        categories {
          nodes {
            name
            slug
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
      categories {
        nodes {
          name
          slug
        }
      }
    }
  }
`;

export const ALL_POSTS_QUERY1 = gql`
  query AllPosts {
    posts {
      nodes {
        id
        title
        slug
        content
        date
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

export const POST_BY_SLUG_QUERY_PAGE = gql`
  query PostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      slug
      date
      title
      categories {
        edges {
          node {
            slug
            name
            id
            databaseId
          }
        }
      }
      author {
        node {
          id
          name
          slug
        }
      }
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
      modified
    }
  }
`;

export const RELATED_POSTS_QUERY = gql`
  query RelatedPosts($categorySlug: String!) {
    posts(where: { categoryName: $categorySlug }) {
      edges {
        node {
          id
          title
          slug
          categories {
            edges {
              node {
                slug
              }
            }
          }
        }
      }
    }
  }
`;

