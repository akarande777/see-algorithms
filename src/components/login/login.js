import React, { useState } from 'react';
import { TextField, Button, Link } from '@material-ui/core';
import './login.scss';

function LoginForm(props) {
    const [values, setValues] = useState({ email: '', password: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Received values of form: ', values);
        props.login(values);
    };

    const handleChange = (key, value) => {
        setValues({ ...values, [key]: value });
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <p>Login with your email and password</p>
            <TextField
                type="email"
                label="Email"
                variant="outlined"
                size="small"
                className="formInput"
                required
                value={values.email}
                onChange={(e) => handleChange('email', e.target.value)}
            />
            <TextField
                type="password"
                label="Password"
                variant="outlined"
                size="small"
                className="formInput"
                required
                value={values.password}
                onChange={(e) => handleChange('password', e.target.value)}
            />
            <div className="formFooter">
                <Button type="submit" variant="contained" color="primary">
                    Log in
                </Button>
                &nbsp; Or&nbsp;
                <Link onClick={props.toRegister} variant="body1">
                    register now!
                </Link>
            </div>
        </form>
    );
}

export default LoginForm;
