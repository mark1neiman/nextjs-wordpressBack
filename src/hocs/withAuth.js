import cookie from 'cookie';

export default function withAuth(getServerSidePropsFunc) {
    return async (ctx) => {
        const cookies = ctx.req ? cookie.parse(ctx.req.headers.cookie || '') : undefined;
        const authToken = cookies && cookies.authToken;

        if (!authToken) {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                }
            };
        }

        let componentProps = {};
        if (getServerSidePropsFunc) {
            componentProps = await getServerSidePropsFunc(ctx);
        }

        return {
            props: {
                ...componentProps,
            }
        };
    }
}
