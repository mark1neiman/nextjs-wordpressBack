import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import NextApp from 'next/app';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { SiteContext, useSiteContext } from 'hooks/use-site';
import { SearchProvider } from 'hooks/use-search';
import { getSiteMetadata } from 'lib/site';
import { getRecentPosts } from 'lib/posts';
import { getCategories } from 'lib/categories';
import NextNProgress from 'nextjs-progressbar';
import { getAllMenus } from 'lib/menus';
import 'styles/globals.scss';
import 'styles/wordpress.scss';
import variables from 'styles/_variables.module.scss';
import { verifyAuthToken } from '../lib/auth';

const AuthChecker = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      const cookies = cookie.parse(document.cookie);
      const authToken = cookies.authToken;

      if (authToken) {
        const isValid = await verifyAuthToken(authToken);

        if (!isValid) {
          document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          router.push('/login');
        }
      }
    };

    checkAuthentication();
  }, []);

  return children;
};

const App = ({ Component, pageProps = {}, metadata, recentPosts, categories, menus }) => {
  const site = useSiteContext({
    metadata,
    recentPosts,
    categories,
    menus,
  });

  const client = new ApolloClient({
    uri: process.env.WORDPRESS_GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <SiteContext.Provider value={site}>
        <SearchProvider>
          <NextNProgress height={4} color={variables.progressbarColor} />
          <AuthChecker>
            <Component {...pageProps} />
          </AuthChecker>
        </SearchProvider>
      </SiteContext.Provider>
    </ApolloProvider>
  );
};

App.getInitialProps = async function (appContext) {
  const appProps = await NextApp.getInitialProps(appContext);

  const { posts: recentPosts } = await getRecentPosts({
    count: 5,
    queryIncludes: 'index',
  });

  const { categories } = await getCategories({
    count: 5,
  });

  const { menus = [] } = await getAllMenus();

  return {
    ...appProps,
    metadata: await getSiteMetadata(),
    recentPosts,
    categories,
    menus,
  };
};

export default App;
