import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import usePageMetadata from 'hooks/use-page-metadata';
import useSearch from 'hooks/use-search';
import TemplateArchive from 'templates/archive';

export default function Search() {
  const { query, results, search } = useSearch();
  const title = 'Search';
  const slug = 'search';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');

    if (query) {
      search({
        query: decodeURIComponent(query),
      });
    }
  }, []);



  const { metadata } = usePageMetadata({
    metadata: {
      title,
      description: `Search results for ${query}`,
    },
  });
  const renderSearchResults = () => {
    return results.map((result, index) => (
      <div key={index} className="search-result">
        {result.featuredImage && (
          <img src={result.featuredImage} alt={result.title} className="search-result-image" />
        )}
        <h2 className="search-result-title">{result.title}</h2>
        <p className="search-result-description">{result.description}</p>
      </div>
    ));
  };

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <TemplateArchive title='Otsing' posts={results} slug={slug} metadata={metadata} />
    </>
  );
}

// Next.js method to ensure a static page gets rendered
export async function getStaticProps() {
  return {
    props: {},
  };
}
