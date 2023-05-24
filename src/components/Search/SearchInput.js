import { useState, useRef, useEffect } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import styles from './SearchInput.module.scss';
import Link from 'next/link';
import { SEARCH_POSTS_QUERY } from '../../lib/queries'
import { useRouter } from 'next/router';


const SearchInput = () => {
    const [query, setQuery] = useState('');
    const [focus, setFocus] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchPosts, { loading, error, data }] = useLazyQuery(SEARCH_POSTS_QUERY);
    const inputRef = useRef(null);
    const router = useRouter();
    const [inputValue, setInputValue] = useState('');


    const handleChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        searchPosts({ variables: { searchQuery: newQuery } });
        setInputValue(e.target.value);
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
    const handleBlur = (e) => {
        if (e.relatedTarget && e.relatedTarget.closest(`.${styles.searchInputTable}`)) {
            return;
        }

        if (e.key === 'Enter' && !searchResultFound) {
            // Trigger search
            handleSearch();
        }

        setTimeout(() => {
            setFocus(false);
        }, 99999);
    };

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    const posts = data?.posts?.nodes || [];

    // const handleKeyPress = (e) => {
    //     if (e.key === 'Enter') {
    //         const searchQuery = e.target.value.trim();
    //         if (searchQuery) {
    //             router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    //         }
    //     }
    // };

    return (
        <div className={styles.searchInputContainer}>
            <input
                type="search"
                value={query}
                className={`${styles.searchInput} ${inputValue ? styles.blueBackground : ''}`}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                // onKeyPress={handleKeyPress}
                placeholder="Otsi..."
                ref={inputRef}
            />
            {query && focus && !isLoading && (
                <div className={styles.searchInputTable}>
                    <table>

                        {posts.map((post) => (
                            <tr key={post.id}>
                                <td>
                                    <Link href={`/posts/${post.slug}`}>
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

                    </table>
                </div>
            )}
        </div>
    );
};

export default SearchInput;