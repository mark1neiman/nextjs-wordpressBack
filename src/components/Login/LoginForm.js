import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from 'react';
import { useSession } from "next-auth/react";
import InteractiveBackground from './InteractiveBackground';
import styles from '../../styles/pages/Login.module.scss';

const LoginForm = () => {
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/');
        }
    }, [status, router]);

    const handleLogin = (e) => {
        e.preventDefault();
        signIn('google', { callbackUrl: '/' });
    };

    return (
        <div className={styles.container}>
            <InteractiveBackground bubbleColor="#DDE6ED" />

            <div className={styles.content}>
                <div className={styles.logoContainer}>
                    <img
                        className={styles.logo}
                        src="https://test.webaza.eu/test/wp-content/uploads/2023/05/Assi-logo-valge-mustal-3.png"
                        alt="Logo"
                    />
                    <p className={styles.logoText}>wiki</p>
                </div>
                <div className={styles.formContainer}>
                    <button className={styles.button} onClick={handleLogin}>
                        <div className={styles.GoogleContainer}>
                            <img src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-google-icon-logo-png-transparent-svg-vector-bie-supply-14.png" alt="Google Logo" className={styles.googleLogo} />
                        </div>
                        <span className={styles.buttonText}>Logi sisse ASSI</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
