import { useState, useRef, useEffect } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import styles from './SearchInput.module.scss';
import Link from 'next/link';
import { SEARCH_POSTS_QUERY, GET_CATEGORIES_SEARCH } from '../../lib/queries'
import { useRouter } from 'next/router';

const SearchInput = () => {
  const [query, setQuery] = useState('');
  const [focus, setFocus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchPosts, { loading, error, data }] = useLazyQuery(SEARCH_POSTS_QUERY);
  const [getCategories, { data: categoryData }] = useLazyQuery(GET_CATEGORIES_SEARCH);
  const inputRef = useRef(null);
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    searchPosts({ variables: { searchQuery: newQuery, category: selectedCategory } });
    setInputValue(newQuery);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    searchPosts({ variables: { searchQuery: query, category: category } });
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

  useEffect(() => {
    getCategories();
  }, [getCategories]);


  const handleBlur = (e) => {
    if (e.relatedTarget && e.relatedTarget.closest(`.${styles.searchInputTable}`)) {
      return;
    }

    if (e.key === 'Enter' && !searchResultFound) {
      // Trigger search
      handleSearch();
    }

    setTimeout(() => {
      if (document.activeElement !== inputRef.current) {
        setFocus(false);
      }
    }, 0);
  };


  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const posts = data?.posts?.nodes || [];
  const categories = categoryData?.categories?.nodes || [];

  return (
    <div className={styles.searchInputContainer}>
      <div className={styles.searchwrapper}>
        <input
          type="search"
          value={query}
          className={`${styles.searchInput} ${inputValue ? styles.blueBackground : ''}`}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Otsi..."
          ref={inputRef}
        />
        {query && focus && !isLoading && (
          <div className={styles.searchInputTable} >
            {posts.length > 0 ? (
              <table>
                {posts.map((post) => (
                  <Link href={`/posts/${post.categories.nodes.length > 0 ? post.categories.nodes[0].slug : 'uncategorized'}/${post.slug}`} key={post.id}>
                    <tr>
                      <td>
                        <h2>{post.title}</h2>
                        <div className={styles.imagecontainer}>
                          {post.featuredImage && (
                            <img src={post.featuredImage.node.sourceUrl} alt={post.title} />
                          )}
                        </div>
                      </td>
                    </tr>
                  </Link>
                ))}
              </table>
            ) : (
              <p>Olavi ei leidnud midagi...</p>
            )}
          </div>
        )}

        <select value={selectedCategory} onChange={handleCategoryChange} className={styles.selectcategory}>
          <option value="">Kõik standardid</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchInput;
