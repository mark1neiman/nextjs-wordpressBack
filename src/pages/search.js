import { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import usePageMetadata from 'hooks/use-page-metadata';
import styles from '../styles/pages/Search.module.scss';
import Layout from "../components/Layout";

export const ALL_POSTS_QUERY = gql`
  query AllPosts($query: String!, $first: Int, $after: String) {
    posts(where: {search: $query}, first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        id
        title
        content
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
`;

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [endCursor, setEndCursor] = useState('');
  const { data, loading, error, fetchMore } = useQuery(ALL_POSTS_QUERY, {
    variables: { query: searchQuery, first: 10 },
    skip: !searchQuery
  });

  const containerRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    setSearchQuery(decodeURIComponent(query || ''));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= containerRef.current.offsetHeight) {
        loadMorePosts();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [data]);

  const loadMorePosts = () => {
    if (data?.posts?.pageInfo?.hasNextPage && !loading) {
      fetchMore({
        variables: {
          after: endCursor,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult.posts.nodes;
          const pageInfo = fetchMoreResult.posts.pageInfo;
          setEndCursor(pageInfo.endCursor);

          return newEdges.length
            ? {
              posts: {
                __typename: prevResult.posts.__typename,
                pageInfo: pageInfo,
                nodes: [...prevResult.posts.nodes, ...newEdges],
              },
            }
            : prevResult;
        },
      });
    }
  };

  const results = data?.posts?.nodes || [];

  const truncateContent = (content) => {
    const div = document.createElement("div");
    div.innerHTML = content;
    const text = div.textContent || div.innerText || "";
    return text.length > 150 ? text.substring(0, 150) + "..." : text;
  };

  return (
    <Layout>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className={styles.container} ref={containerRef}>
        <div className={styles.outerSearchResultsContainer}>
          <div className={styles.searchResultsContainer}>
            {results.map((result, index) => (
              <div key={index} className={styles.searchResult}>
                <h2 className={styles.searchResultTitle}>{result.title}</h2>
                {result.featuredImage && (
                  <img src={result.featuredImage.node.sourceUrl} alt={result.title} className={styles.searchResultImage} />
                )}
                <div className={styles.searchResultContent} dangerouslySetInnerHTML={{ __html: truncateContent(result.content) }} />
                <p className={styles.searchResultAuthor}>Kirjutas: {result.author?.node?.name}</p>
              </div>
            ))}
          </div>
        </div>
        {loading && <div className={styles.spinner}>Laen...</div>}
        {!data?.posts?.pageInfo?.hasNextPage && <div className={styles.endMessage}>Olete jõudnud sisu lõppu..</div>}
        {error && <div className={styles.errorMessage}>Error laadimise ajal...</div>}
      </div>
    </Layout>
  );

}
