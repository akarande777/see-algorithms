import React, { useState, useContext, useEffect } from 'react';
import LoginForm from './login/login';
import RegisterForm from './register/register';
import { Spin, message } from 'antd';
import './home.scss';
import { auth } from '../services/firebase';
import { createUserProfileDoc } from '../services/auth';
import { AuthContext } from '../App';

function Home() {
    const user = useContext(AuthContext);
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
            await user.sendEmailVerification({ url: 'http://localhost:3002' });
            message.success('Verification email sent');
            setFormType('login');
        } catch (err) {
            message.error(err.message);
        }
        setLoading(false);
    };

    const login = async (values) => {
        const { email, password } = values;
        setLoading(true);
        try {
            await auth.signInWithEmailAndPassword(email, password);
        } catch (err) {
            message.error(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="formContainer">
            <h6>Hello {user ? user.displayName + '!' : 'World!'}</h6>
            <br />
            <Spin spinning={loading}>
                {formType === 'login' && (
                    <LoginForm toRegister={() => setFormType('register')} login={login} />
                )}
                {formType === 'register' && (
                    <RegisterForm toLogin={() => setFormType('login')} register={register} />
                )}
            </Spin>
        </div>
    );
}

export default Home;
