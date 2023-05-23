import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';

import SearchInput from '../../components/SearchInput';
import SearchResults from '../../components/SearchResults';
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import { getPostBySlug } from '../../data/posts';
import useSite from 'hooks/use-site';
import useSearch, { SEARCH_STATE_LOADED } from 'hooks/use-search';
import { postPathBySlug } from 'lib/posts';
import { findMenuByLocation, MENU_LOCATION_NAVIGATION_DEFAULT } from 'lib/menus';

import Section from 'components/Section';

import styles from './Nav.module.scss';

const SEARCH_VISIBLE = 'visible';
const SEARCH_HIDDEN = 'hidden';

const Nav = () => {
  const router = useRouter();
  const formRef = useRef();
  const [searchVisibility, setSearchVisibility] = useState(SEARCH_HIDDEN);
  const [searchQuery, setSearchQuery] = useState('')
  const { metadata = {}, menus } = useSite();
  const { title } = metadata;
  const { query, results, search, clearSearch, state } = useSearch({
    maxResults: 5,
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    if (searchVisibility === SEARCH_HIDDEN) {
      removeDocumentOnClick();
      return;
    }

    addDocumentOnClick();
    addResultsRoving();

    const searchInput = Array.from(formRef.current.elements).find((input) => input.type === 'search');

    searchInput.focus();

    return () => {
      removeResultsRoving();
      removeDocumentOnClick();
    };
  }, [searchVisibility]);

  function addDocumentOnClick() {
    document.body.addEventListener('click', handleOnDocumentClick, true);
  }

  function removeDocumentOnClick() {
    document.body.removeEventListener('click', handleOnDocumentClick, true);
  }

  function handleOnDocumentClick(e) {
    if (!e.composedPath().includes(formRef.current)) {
      setSearchVisibility(SEARCH_HIDDEN);
      clearSearch();
    }
  }

  function handleOnSearch({ currentTarget }) {
    search({
      query: currentTarget.value,
    });
  }

  function handleOnToggleSearch() {
    setSearchVisibility(SEARCH_VISIBLE);
  }

  function addResultsRoving() {
    document.body.addEventListener('keydown', handleResultsRoving);
  }

  function removeResultsRoving() {
    document.body.removeEventListener('keydown', handleResultsRoving);
  }

  function handleResultsRoving(e) {
    const focusElement = document.activeElement;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (focusElement.nodeName === 'INPUT' && focusElement.nextSibling.children[0].nodeName !== 'P') {
        focusElement.nextSibling.children[0].firstChild.firstChild.focus();
      } else if (focusElement.parentElement.nextSibling) {
        focusElement.parentElement.nextSibling.firstChild.focus();
      } else {
        focusElement.parentElement.parentElement.firstChild.firstChild.focus();
      }
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (focusElement.nodeName === 'A' && focusElement.parentElement.previousSibling) {
        focusElement.parentElement.previousSibling.firstChild.focus();
      } else {
        focusElement.parentElement.parentElement.lastChild.firstChild.focus();
      }
    }
  }

  const escFunction = useCallback(
    (event) => {
      if (event.keyCode === 27) {
        clearSearch();
        setSearchVisibility(SEARCH_HIDDEN);
      }
    },
    [clearSearch]
  );

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, []);

  const handleLogout = () => {
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  };

  const isUserLoggedIn = () => {
    if (typeof window !== 'undefined') {
      const authToken = document.cookie.replace(/(?:(?:^|.*;\s*)authToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      return authToken !== '';
    }
    return false;
  };

  return (
    <nav className={styles.nav}>
      <Section className={styles.navSection}>
        <p className={styles.navName}>
          <Link href="/">{title}</Link>
        </p>
        <div>
          <SearchInput onSearch={handleSearch} />
        </div>
        <div className={styles.navLogout}>
          {isUserLoggedIn() ? (
            <button onClick={handleLogout}>Logi välja</button>
          ) : (
            <Link href="/login">Logi sisse</Link>
          )}
        </div>
      </Section>
    </nav>
  );
};

export default Nav;
