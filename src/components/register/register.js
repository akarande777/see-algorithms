import React, { useState } from 'react';
import { TextField, Button, Link } from '@material-ui/core';
import './register.scss';

function RegisterForm(props) {
    const [values, setValues] = useState({
        email: '',
        password: '',
        password2: '',
        displayName: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Received values of form: ', values);
        props.register(values);
    };

    const comparePassword = () => {
        const { password2, password } = values;
        if (password2 && password2 !== password) {
            return 'Passwords do not match!';
        }
        return '';
    };

    const handleChange = (key, value) => {
        setValues({ ...values, [key]: value });
    };

    return (
        <form className="register-form" onSubmit={handleSubmit}>
            <p>Register with your email and password</p>
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
            <TextField
                type="password"
                label="Confirm Password"
                variant="outlined"
                size="small"
                className="formInput"
                required
                value={values.password2}
                onChange={(e) => handleChange('password2', e.target.value)}
                error={comparePassword().length > 0}
            />
            <TextField
                label="Display Name"
                variant="outlined"
                size="small"
                className="formInput"
                required
                value={values.displayName}
                onChange={(e) => handleChange('displayName', e.target.value)}
            />
            <div className="formFooter">
                <Button type="submit" variant="contained" color="primary">
                    Register
                </Button>
                &nbsp; Or&nbsp;
                <Link onClick={props.toLogin} variant="body1">
                    back to login
                </Link>
            </div>
        </form>
    );
}

export default RegisterForm;
