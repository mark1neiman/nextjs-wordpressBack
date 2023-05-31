import cookie from 'cookie';

export async function getServerSideProps(ctx) {
    const cookies = ctx.req ? cookie.parse(ctx.req.headers.cookie || '') : undefined;
    const authToken = cookies && cookies.authToken;

    if (!authToken) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
}
