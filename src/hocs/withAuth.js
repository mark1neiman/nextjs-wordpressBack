import { getSession } from "next-auth/react";

export default function withAuth(getServerSidePropsFunc) {
    return async (ctx) => {
        const session = await getSession(ctx);

        if (!session) {
            return {
                redirect: {
                    destination: "/login",
                    permanent: false,
                },
            };
        }

        let componentProps = {};
        if (getServerSidePropsFunc) {
            componentProps = await getServerSidePropsFunc(ctx);
        }

        return {
            props: {
                ...componentProps,
                session, // pass the session to the component props
            },
        };
    };
}
