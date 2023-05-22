import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';

import styles from '../../styles/pages/Login.module.scss';

const LOGIN_USER_MUTATION = gql`
  mutation LoginUser($input: LoginInput!) {
    login(input: $input) {
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

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await login({
                variables: {
                    input: {
                        username,
                        password,
                    },
                },
            });

            const { authToken, user } = data.login;

            // Set the token in a browser cookie
            document.cookie = `authToken=${authToken}; Path=/; Expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}; ${process.env.NODE_ENV === 'production' ? 'Secure' : ''}`;
            console.log('Auth Token:', authToken);
            console.log('User:', user);

            // Redirect to main page upon successful login
            router.push('/');
        } catch (error) {
            console.error('Incorrect username or password');
            // Display error message for incorrect login or password
        }
    };

    return (
        <form className={styles.form} onSubmit={handleFormSubmit}>
            {/* Form inputs */}
            <table className={`${styles.inputTable} ${styles.centerTable}`}>
                <tbody>
                    <tr>
                        <td>
                            <input
                                className={styles.input}
                                type="text"
                                placeholder="Assi kasutaja"
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
                                placeholder="Salasõna"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Form button */}
            <button className={styles.button} type="submit" disabled={loading}>
                {loading ? 'Login sisse...' : 'Logi sisse'}
            </button>

            {/* Error message */}
            {error && <p className={styles.error}>Vale parool või salasõna</p>}
        </form>
    );
};

export default LoginForm;
