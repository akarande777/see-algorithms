import React, { useEffect, useRef, useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { gql, useMutation } from '@apollo/client';
import { Form, FormField } from 'react-form-decorator';
import { showToast } from '../toast/toast';
import Spinner from '../spinner/spinner';

const REGISTER = gql`
    mutation Register($email: String!, $password: String!, $displayName: String!) {
        register(email: $email, password: $password, displayName: $displayName) {
            status
            message
        }
    }
`;

function RegisterForm(props) {
    const formRef = useRef(null);
    const [register, { data, loading }] = useMutation(REGISTER);
    const [error, setError] = useState('');

    useEffect(() => {
        if (data) {
            const { status, message } = data.register;
            console.log(message);
            if (status) {
                showToast({
                    message: 'Verification email sent!',
                    variant: 'success',
                });
                props.toLogin();
            } else {
                setError(message);
            }
        }
    }, [data]);

    const handleSubmit = (e) => {
        e.preventDefault();
        formRef.current.validateForm().then((values) => {
            const { password2, ...rest } = values;
            register({ variables: rest });
        });
    };

    const comparePassword = (value) => {
        const { input } = formRef.current.formState;
        if (value !== input.password) {
            return ['error', 'Passwords do not match'];
        }
        return [];
    };

    return (
        <Form
            ref={formRef}
            className="register"
            onSubmit={handleSubmit}
            inputDecorator={(_, { inputEl, status, message }) =>
                React.cloneElement(inputEl, {
                    variant: 'outlined',
                    size: 'small',
                    className: 'formInput',
                    helperText: message,
                    error: status === 'error',
                })
            }
        >
            <Spinner spinning={loading}>
                <p>Sign up to explore new features!</p>
                <FormField name="email" required>
                    {(props) => <TextField type="email" label="Email" {...props} />}
                </FormField>
                <FormField name="password" required>
                    {(props) => <TextField type="password" label="Password" {...props} />}
                </FormField>
                <FormField name="password2" required validate={comparePassword}>
                    {(props) => <TextField type="password" label="Confirm Password" {...props} />}
                </FormField>
                <FormField name="displayName" required>
                    {(props) => <TextField label="Display Name" {...props} />}
                </FormField>
                {error && <Alert severity="error">{error}</Alert>}
                <div className="formFooter">
                    <Button type="submit" variant="contained" color="primary">
                        Sign up
                    </Button>
                    <Button color="primary" onClick={props.toLogin}>
                        Log in
                    </Button>
                </div>
            </Spinner>
        </Form>
    );
}

export default RegisterForm;
