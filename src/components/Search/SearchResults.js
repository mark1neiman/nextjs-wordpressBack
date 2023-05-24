import { useEffect, useState } from 'react';

const SearchResults = ({ searchQuery }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 5;

    useEffect(() => {
        const fetchSearchResults = async () => {
            // Calculate offset based on the current page and results per page
            const offset = (currentPage - 1) * resultsPerPage;

            // Make a request to your GraphQL API to fetch search results with pagination
            const response = await fetch(
                `/your-graphql-api-endpoint?query={
          posts(where: { search: "${searchQuery}" }, first: ${resultsPerPage}, offset: ${offset}) {
            nodes {
              title
              featuredImage {
                sourceUrl
              }
            }
          }
        }`
            );
            const data = await response.json();
            setSearchResults(data?.data?.posts?.nodes || []);
        };

        fetchSearchResults();
    }, [searchQuery, currentPage]);

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Featured Image</th>
                    </tr>
                </thead>
                <tbody>
                    {searchResults.map((post) => (
                        <tr key={post.title}>
                            <td>{post.title}</td>
                            <td>
                                <img src={post.featuredImage?.sourceUrl} alt={post.title} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <button onClick={handleNextPage}>Next</button>
            </div>
        </div>
    );
};

export default SearchResults;
