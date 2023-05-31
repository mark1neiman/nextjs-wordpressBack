import { useQuery } from "@apollo/client";
import { ALL_POSTS_QUERY1 } from "../../lib/queries";
import Link from "next/link";
import { apolloClient } from "../../lib/apollo-client";

const PostsPage = () => {
    const { loading, error, data } = useQuery(ALL_POSTS_QUERY1, {
        client: apolloClient,
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            {data.posts.nodes.map((post) => (
                <div key={post.id}>
                    <h2>
                        <Link href={`/${post.categories?.nodes[0]?.slug || 'uncategorized'}/${post.slug}`}>
                            {post.title}
                        </Link>
                    </h2>
                    <p>{post.content}</p>
                </div>
            ))}
        </div>
    );
};

export default PostsPage;
