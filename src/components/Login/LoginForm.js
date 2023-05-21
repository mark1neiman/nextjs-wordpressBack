import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';

const LOGIN_USER_MUTATION = gql`
  mutation LoginUser($input: LoginInput!) {
    login(input: $input) {
      authToken
      refreshToken
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

            const { authToken, refreshToken, user } = data.login;

            // Store the tokens in localStorage
            localStorage.setItem('authToken', authToken);
            // localStorage.setItem('refreshToken', refreshToken);

            // console.log('Auth Token:', authToken);
            // console.log('Refresh Token:', refreshToken);
            // console.log('User:', user);

            // Redirect to main page upon successful login
            router.push('/');
        } catch (error) {
            console.error('Login Error:', error);
            // Display error message for incorrect login or password
            // You can use state or a toast/notification component to display the error
        }
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Logging In...' : 'Log In'}
            </button>
            {error && <p>Error: {error.message}</p>}
        </form>
    );
};

export default LoginForm;
