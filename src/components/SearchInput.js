import { useState, useRef, useEffect } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import styles from './SearchInput.module.scss';
import Link from 'next/link';
const SEARCH_POSTS_QUERY = gql`
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

const SearchInput = () => {
    const [query, setQuery] = useState('');
    const [focus, setFocus] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchPosts, { loading, error, data }] = useLazyQuery(SEARCH_POSTS_QUERY);
    const inputRef = useRef(null);

    const handleChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        searchPosts({ variables: { searchQuery: newQuery } });
    };

    useEffect(() => {
        if (focus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [focus]);

    useEffect(() => {
        setIsLoading(loading);
    }, [loading]);

    const handleFocus = () => {
        setFocus(true);
    };

    const handleBlur = () => {
        setFocus(false);
    };

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    const posts = data?.posts?.nodes || [];

    return (
        <div className={styles.searchInputContainer}>
            <input
                type="search"
                value={query}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Search..."
                ref={inputRef}
            />
            {query && focus && !isLoading && (
                <div className={styles.searchInputTable}>
                    <table>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post.id}>
                                    <td>
                                        <Link href={`/post/${post.slug}`}>
                                            <h2>{post.title}</h2>
                                            <div className={styles.imagecontainer}>
                                                {post.featuredImage && (
                                                    <img src={post.featuredImage.node.sourceUrl} alt={post.title} />
                                                )}
                                            </div>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SearchInput;