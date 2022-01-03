import React, { useState, useEffect } from 'react';
import LoginForm from '../login/login';
import RegisterForm from '../register/register';
import { showToast } from '../toast/toast';
import './home.scss';
import { useMutation, useReactiveVar } from '@apollo/client';
import { VERIFY_EMAIL } from '../../graphql/mutations';
import Spinner from '../spinner/spinner';
import { userAuthVar } from '../../common/cache';

function Home({ location, history }) {
    const userAuth = useReactiveVar(userAuthVar);
    const [formType, setFormType] = useState(userAuth ? '' : 'register');
    const [verifyEmail] = useMutation(VERIFY_EMAIL, {
        onCompleted(data) {
            const { status, message } = data.verifyEmail;
            if (status) {
                showToast({
                    message: 'Email verified successfully!',
                    variant: 'success',
                });
            } else {
                showToast({ message, variant: 'error' });
            }
        },
    });

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Spinner className="home" spinning={false}>
            {userAuth && <h5>Welcome {userAuth.displayName}!</h5>}
            {formType === 'login' && <LoginForm toRegister={() => setFormType('register')} />}
            {formType === 'register' && <RegisterForm toLogin={() => setFormType('login')} />}
        </Spinner>
    );
}

export default Home;
