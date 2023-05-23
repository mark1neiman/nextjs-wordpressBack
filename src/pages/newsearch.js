import SearchResults from '../components/SearchResults';

const SearchPage = ({ searchQuery }) => {
    return (
        <div>
            <h1>Search Results</h1>
            <SearchResults searchQuery={searchQuery} />
        </div>
    );
};

export default SearchPage;

export async function getServerSideProps(context) {
    const searchQuery = context.query.q || ''; // Assuming the search query is passed as a query parameter, adjust accordingly
    return {
        props: {
            searchQuery,
        },
    };
}
