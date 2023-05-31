import { useState } from 'react';
import Link from 'next/link';

import SearchInput from '../../components/Search/SearchInput';
import { useRouter } from 'next/router';
import useSite from 'hooks/use-site';


import Section from 'components/Section';

import styles from './Nav.module.scss';


const Nav = () => {


  const router = useRouter();
  const { metadata = {}, menus } = useSite();
  const { title } = metadata;
  const [searchQuery, setSearchQuery] = useState('')

  //Seacrh functionality start
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  //Seacrh functionality end

  return (
    <nav className={styles.nav}>
      <Section className={styles.navSection}>
        <p className={styles.navLogo}>
          <Link href="/">
            <img src="https://test.webaza.eu/test/wp-content/uploads/2023/05/Assi-logo-valge-mustal-3.png" />
          </Link>
        </p>

        <div className={styles.searchfield}>
          <SearchInput onSearch={handleSearch} />
        </div>
      </Section>
    </nav>
  );
};

export default Nav;
