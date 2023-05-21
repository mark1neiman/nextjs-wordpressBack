import { useEffect } from 'react';
import { useRouter } from 'next/router';
import LoginForm from '../components/Login/LoginForm';

const LoginPage = () => {
    const router = useRouter();

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                // Add your authentication logic here
                // For example, you can check if the user has a valid authentication token
                const authToken = localStorage.getItem('authToken'); // Replace with your actual authentication token retrieval logic

                if (authToken) {
                    // User has a token, redirect to the main page
                    router.push('/');
                }
            } catch (error) {
                console.error('Authentication Error:', error);
                // Handle the authentication error, if necessary
            }
        };

        checkAuthentication();
    }, [router]);

    return (
        <div>
            <h1>Login</h1>
            <LoginForm />
        </div>
    );
};

export default LoginPage;