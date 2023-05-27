import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { GET_CATEGORIES_WITH_POSTS } from '../lib/queries';
import Layout from '../components/Layout';
import Container from '../components/Container';
import withAuth from '../hocs/withAuth';
import styles from '../styles/pages/Home.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-solid-svg-icons'


function Home() {
  const { loading, error, data } = useQuery(GET_CATEGORIES_WITH_POSTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  console.log(data);
  return (
    <Layout>
      <Container>
        <div className={styles.container}>
          {data.categories.edges.map(({ node: category }) => (
            <div key={category.id} className={styles.categoryTable}>
              <h2 className={styles.categoryName}>{category.name}</h2>
              <div className={styles.row}>
                <ul className={styles.postList}>
                  {category.posts.edges.map(({ node: post }) => (
                    <li key={post.id} className={styles.postItem}>
                      <div className={styles.icon}>
                        <FontAwesomeIcon icon={faFile} />
                      </div>
                      <span className={styles.postTitle}>
                        <Link href={`/posts/${category.slug}/${post.slug}`}>{post.title}</Link>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

      </Container>
    </Layout>



  );
}

export default withAuth(Home);