import React, { useState, useContext, useEffect } from 'react';
// import LoginForm from '../components/login/login';
// import RegisterForm from '../components/register/register';
import { showToast } from '../components/toast/toast';
import { CircularProgress } from '@material-ui/core';
import './home.scss';
import { auth } from '../services/firebase';
import { createUserProfileDoc } from '../services/auth';
import { AppContext } from '../App';
import { AppDomain } from '../common/constants';

function Home() {
    const { user } = useContext(AppContext);
    const [formType, setFormType] = useState(user ? '' : 'login');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        user ? setFormType('') : setFormType('login');
    }, [user]);

    const register = async (values) => {
        const { email, password, displayName } = values;
        setLoading(true);
        try {
            const { user } = await auth.createUserWithEmailAndPassword(email, password);
            await createUserProfileDoc(user, { displayName });
            await user.sendEmailVerification({ url: AppDomain });
            showToast({
                message: 'Verification email sent!',
                variant: 'success',
            });
            setLoading(false);
            setFormType('login');
        } catch (err) {
            showToast({ message: err.message, variant: 'error' });
            setLoading(false);
        }
    };

    const login = async (values) => {
        const { email, password } = values;
        setLoading(true);
        try {
            await auth.signInWithEmailAndPassword(email, password);
            setLoading(false);
        } catch (err) {
            showToast({
                message: 'Invalid email or password!',
                variant: 'error',
            });
            setLoading(false);
        }
    };

    return (
        <div className={'home ' + (loading ? 'loading' : '')}>
            {loading && <CircularProgress className="loader" />}
            <p>Hello World!</p>
            {/* {formType === 'login' && (
                <LoginForm toRegister={() => setFormType('register')} login={login} />
            )}
            {formType === 'register' && (
                <RegisterForm toLogin={() => setFormType('login')} register={register} />
            )} */}
        </div>
    );
}

export default Home;
