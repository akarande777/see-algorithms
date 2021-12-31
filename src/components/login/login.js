import React, { useContext, useEffect, useRef, useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { gql, useMutation } from '@apollo/client';
import { AppContext } from '../../common/context';
import { Form, FormField } from 'react-form-decorator';
import Spinner from '../spinner/spinner';

const LOGIN = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            data {
                displayName
                authToken
            }
            status
            message
        }
    }
`;

function LoginForm(props) {
    const formRef = useRef(null);
    const [login, { data, loading }] = useMutation(LOGIN);
    const { setContext } = useContext(AppContext);
    const [error, setError] = useState('');

    useEffect(() => {
        if (data) {
            const { data: userAuth, status, message } = data.login;
            if (status) {
                setContext({ userAuth });
                localStorage.setItem('userAuth', JSON.stringify(userAuth));
            } else {
                setError(message);
            }
        }
    }, [data]);

    const handleSubmit = (e) => {
        e.preventDefault();
        formRef.current.validateForm().then((values) => {
            login({ variables: values });
        });
    };

    return (
        <Form
            ref={formRef}
            className="login"
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
                <p>Log in to your account</p>
                <FormField name="email" required>
                    {(props) => <TextField type="email" label="Email" {...props} />}
                </FormField>
                <FormField name="password" required>
                    {(props) => <TextField type="password" label="Password" {...props} />}
                </FormField>
                {error && <Alert severity="error">{error}</Alert>}
                <div className="formFooter">
                    <Button type="submit" variant="contained" color="primary">
                        Log in
                    </Button>
                    <Button color="primary" onClick={props.toRegister}>
                        Sign up
                    </Button>
                </div>
            </Spinner>
        </Form>
    );
}

export default LoginForm;
