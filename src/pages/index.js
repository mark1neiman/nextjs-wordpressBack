import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { GET_CATEGORIES_WITH_POSTS } from '../lib/queries';
import Layout from '../components/Layout';
import Container from '../components/Container';

export default function Home() {
  const { loading, error, data } = useQuery(GET_CATEGORIES_WITH_POSTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Layout>
      <Container>
        {data.categories.edges.map(({ node: category }) => (
          <div key={category.id}>
            <h2>{category.name}</h2>
            <ul>
              {category.posts.edges.map(({ node: post }) => (
                <li key={post.id}>
                  <Link href={`/posts/${post.slug}`}>
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
    </Layout>
  );
}

