import { useQuery } from "@apollo/client";
import { POST_BY_SLUG_QUERY_PAGE, RELATED_POSTS_QUERY } from "../../../lib/queries";
import { apolloClient } from "../../../lib/apollo-client";

import { useRouter } from "next/router";
import styles from "../../../styles/pages/Post.module.scss";
import Link from "next/link";

import Layout from "components/Layout";
import Section from "components/Section";
import Container from "components/Container";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';

import { useState, useEffect } from 'react';
import withAuth from '../../../hocs/withAuth';

const PostPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const { loading, error, data } = useQuery(POST_BY_SLUG_QUERY_PAGE, {
    variables: { slug },
  });

  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    if (data?.post) {
      fetchRelatedPosts(data.post);
    }
  }, [data]);

  const fetchRelatedPosts = async (post) => {
    try {
      const categorySlug = post.categories.edges[0].node.slug;
      const { data } = await apolloClient.query({
        query: RELATED_POSTS_QUERY,
        variables: { categorySlug },
      });
      const relatedPosts = data.posts.edges.map(({ node }) => node);
      // Filter out the current post
      const filteredRelatedPosts = relatedPosts.filter(p => p.id !== post.id);
      setRelatedPosts(filteredRelatedPosts);
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const post = data.post;
  const categories = data.post.categories.edges.map(({ node }) => node);
  const categorySlug = categories.length ? categories[0].slug : 'uncategorized';
  const categoryName = categories.length ? categories[0].name : 'Uncategorized';

  let modifiedDate = new Date(post.modified);
  let formattedModifiedDate = modifiedDate.toLocaleString('et-EE', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Layout>
      <div className={styles.layoutcontainer}>
        <Section>
          <Container>
            <div className={styles.mainContainer}>
              <div className={styles.relatedPosts}>
                <div className={styles.header}>
                  {/* Breadcrumbs */}
                  <nav className={styles.breadcrumbs}>
                    <Link className={styles.breadcrumbshome} href="/">Kodu</Link>
                    {' - '}
                    <span>{categoryName}</span>
                    {' - '}
                    <span>{post.title}</span>
                  </nav>
                  <p>
                    <span className={styles.span}>Kirjutas: </span>
                    {post.author?.node?.name}</p>
                  <p className={styles.postModified}>
                    <span className={styles.span}>Värskendatud: </span>
                    {formattedModifiedDate}</p>
                  <div>
                    <span className={styles.span}>Kategooria: </span>
                    {categories.map((category, index) => (
                      <span key={category.databaseId}>
                        {category.name}
                        {/* Add a comma and a space if it's not the last category */}
                        {index < categories.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                  <hr />
                </div>
                {categories.length > 0 && (
                  <div className={styles.table}>
                    <h2>{categories[0].name}</h2>
                    <ul>
                      {relatedPosts.map((relatedPost) => (
                        <li key={relatedPost.id} className={styles.postItem}>
                          <div>
                            <FontAwesomeIcon icon={faFile} className={styles.fileicon} />
                          </div>
                          <span className={styles.postTitle}>
                            <Link href={`/posts/${relatedPost.categories.edges[0]?.node?.slug || 'uncategorized'}/${relatedPost.slug}`}>
                              {relatedPost.title}
                            </Link>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className={styles.content}>
                <h1 className={styles.title}>{post.title}</h1>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            </div>
          </Container>
        </Section>
      </div>
    </Layout>
  );
};

export const getServerSideProps = withAuth();
export default PostPage;
