import { useEffect } from 'react';
import { useRouter } from 'next/router';
import LoginForm from '../components/Login/LoginForm';
import cookie from 'cookie';
import styles from '../styles/pages/Login.module.scss';
import Meta from '../components/Layout/Meta';



export default function LoginPage() {
    
    const router = useRouter();

    useEffect(() => {
        const cookies = cookie.parse(document.cookie);
        const authToken = cookies.authToken;

        if (authToken) {
            router.push('/'); // redirects to home if authToken exists
        }
    }, []);

    return (
        <Meta>
        <div className={styles.container}>
            <img className={styles.logo} src="https://test.webaza.eu/test/wp-content/uploads/2023/05/Assi-logo-valge-mustal-3.png" alt="Logo" />
            <LoginForm />
        </div>
        </Meta>
    );
}
