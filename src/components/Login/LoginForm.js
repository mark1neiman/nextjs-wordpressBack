import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import ReCAPTCHA from 'react-google-recaptcha';

import InteractiveBackground from './InteractiveBackground';
import styles from '../../styles/pages/Login.module.scss';

//added extra recaptcha php code to support graphql for wordpress 
const LOGIN_USER_MUTATION = gql`
  mutation LoginUser($username: String!, $password: String!, $recaptchaResponse: String!) {
    login(input: { 
            username: $username, 
            password: $password,
            recaptchaResponse: $recaptchaResponse
         }) {
      authToken
      user {
        id
        name
      }
    }
  }
`;


const LoginForm = () => {
    const router = useRouter();
    const [login, { loading, error }] = useMutation(LOGIN_USER_MUTATION);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [recaptchaResponse, setRecaptchaResponse] = useState('');

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await login({
                variables: {
                    username,
                    password,
                    recaptchaResponse // Include the reCAPTCHA response in the mutation variables
                },
            });

            console.log('Response data:', data); // Log the entire data object

            if (data && data.login) {
                const { authToken, user } = data.login;

                // Set the token in a browser cookie
                document.cookie = `authToken=${authToken}; Path=/; Expires=${new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                )}; ${process.env.NODE_ENV === 'production' ? 'Secure' : ''}`;

                // console.log('Auth Token:', authToken);
                // console.log('User:', user);

                // // Log the cookies
                // console.log('Cookies:', document.cookie);

                // Redirect to main page upon successful login
                router.push('/');
            } else {
                console.log('Unexpected response data structure.');
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.graphQLErrors) {
                console.error('GraphQL Errors:', error.graphQLErrors);
            }
            // Display error message for incorrect login or password
        }
    };


    const handleRecaptchaChange = (response) => {
        setRecaptchaResponse(response); // Update the reCAPTCHA response state
    };
    // console.log('Recaptcha Site Key:', process.env.RECAPTCHA_SITE_KEY);
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
                    <form onSubmit={handleFormSubmit}>
                        {/* Form inputs */}
                        <table className={`${styles.inputTable} ${styles.centerTable}`}>
                            <tbody>
                                <tr>
                                    <td>
                                        <input
                                            className={styles.input}
                                            type="text"
                                            placeholder="kasutaja"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input
                                            className={styles.input}
                                            type="password"
                                            placeholder="salasõna"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* reCAPTCHA */}
                        <div className={styles.recaptchaContainer}>
                            <ReCAPTCHA
                                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                                onChange={handleRecaptchaChange}
                                className={styles.grecaptcha}
                            />
                        </div>
                        {/* Form button */}
                        <button className={styles.button} type="submit" disabled={loading}>
                            {loading ? 'Login sisse...' : 'Logi sisse'}
                        </button>

                        {/* Error message */}
                        {error && <p className={styles.error}>Vale parool või salasõna</p>}

                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
