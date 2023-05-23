import { useState, createContext, useContext, useEffect } from 'react';
import Fuse from 'fuse.js';

import { getSearchData } from 'lib/search';

const SEARCH_KEYS = ['slug', 'title', 'featuredImage'];

export const SEARCH_STATE_LOADING = 'LOADING';
export const SEARCH_STATE_READY = 'READY';
export const SEARCH_STATE_ERROR = 'ERROR';
export const SEARCH_STATE_LOADED = 'LOADED';

export const SearchContext = createContext();

export const SearchProvider = (props) => {
  const search = useSearchState();
  return <SearchContext.Provider value={search} {...props} />;
};

export function useSearchState() {
  const [state, setState] = useState(SEARCH_STATE_READY);
  const [data, setData] = useState(null);

  let client;

  if (data) {
    client = new Fuse(data.posts, {
      keys: SEARCH_KEYS,
      isCaseSensitive: false,
    });
  }

  useEffect(() => {
    (async function getData() {
      setState(SEARCH_STATE_LOADING);

      let searchData;

      try {
        searchData = await getSearchData();
      } catch (e) {
        setState(SEARCH_STATE_ERROR);
        return;
      }

      setData(searchData);
      setState(SEARCH_STATE_LOADED);
    })();
  }, []);

  return {
    state,
    data,
    client,
  };
}

export default function useSearch({ defaultQuery = null, maxResults } = {}) {
  const search = useContext(SearchContext);
  const { client } = search;

  const [query, setQuery] = useState(defaultQuery);

  let results = [];

  if (client && query) {
    results = client.search(query).map(({ item }) => {
      const { title, featuredImage } = item;
      const modifiedItem = { ...item, title };
      if (featuredImage) {
        modifiedItem.featuredImage = featuredImage;
      }
      return modifiedItem;
    });
  }

  if (maxResults && results.length > maxResults) {
    results = results.slice(0, maxResults);
  }

  useEffect(() => setQuery(defaultQuery), [defaultQuery]);

  function handleSearch({ query }) {
    setQuery(query);
  }

  function handleClearSearch() {
    setQuery(null);
  }

  return {
    ...search,
    query,
    results,
    search: handleSearch,
    clearSearch: handleClearSearch,
  };
}
