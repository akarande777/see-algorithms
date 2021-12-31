import React, { useState, useContext, useEffect } from 'react';
import LoginForm from '../login/login';
import RegisterForm from '../register/register';
import { showToast } from '../toast/toast';
import './home.scss';
import { AppContext } from '../../common/context';
import { gql, useMutation } from '@apollo/client';
import Spinner from '../spinner/spinner';

const VERIFY_EMAIL = gql`
    mutation VerifyEmail($token: String!) {
        verifyEmail(token: $token) {
            status
            message
        }
    }
`;

function Home({ location, history }) {
    const { userAuth } = useContext(AppContext);
    const [formType, setFormType] = useState(userAuth ? '' : 'register');
    const [verifyEmail, { data, loading }] = useMutation(VERIFY_EMAIL);

    useEffect(() => {
        userAuth ? setFormType('') : setFormType('register');
    }, [userAuth]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        if (token) {
            verifyEmail({ variables: { token } });
            history.replace(location.pathname);
        }
    }, []);

    useEffect(() => {
        if (data) {
            const { status, message } = data.verifyEmail;
            if (status) {
                showToast({
                    message: 'Email verified successfully!',
                    variant: 'success',
                });
            } else {
                showToast({ message, variant: 'error' });
            }
        }
    }, [data]);

    return (
        <Spinner spinning={loading} className="home">
            {userAuth && <h5>Welcome {userAuth.displayName}!</h5>}
            {formType === 'login' && <LoginForm toRegister={() => setFormType('register')} />}
            {formType === 'register' && <RegisterForm toLogin={() => setFormType('login')} />}
        </Spinner>
    );
}

export default Home;
