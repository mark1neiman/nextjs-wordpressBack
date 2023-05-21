import cookies from 'cookie';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function withAuth(Component) {
    return function AuthenticatedComponent(props) {
        const router = useRouter();

        useEffect(() => {
            if (typeof window !== 'undefined') {
                const { authToken } = cookies.parse(document.cookie);

                if (!authToken) {
                    router.push('/login');
                }
            }
        }, []);

        return <Component {...props} />;
    }
}
