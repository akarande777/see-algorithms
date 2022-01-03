import React, { useContext, useEffect, useRef, useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useMutation } from '@apollo/client';
import { AppContext } from '../../common/context';
import { Form, FormField } from 'react-form-decorator';
import Spinner from '../spinner/spinner';
import { LOGIN } from '../../graphql/mutations';

function LoginForm(props) {
    const formRef = useRef(null);
    const [login, { data, error, loading }] = useMutation(LOGIN);
    const { setContext } = useContext(AppContext);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (data) {
            const { data: userAuth, status, message } = data.login;
            if (status) {
                setContext({ userAuth, dataArray: [] });
                localStorage.setItem('userAuth', JSON.stringify(userAuth));
            } else {
                setMessage(message);
            }
        } else if (error) {
            setMessage(error.message);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, error]);

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
                <p>Log in to your account!</p>
                <FormField name="email" required>
                    {(props) => <TextField type="email" label="Email" {...props} />}
                </FormField>
                <FormField name="password" required>
                    {(props) => <TextField type="password" label="Password" {...props} />}
                </FormField>
                {message && <Alert severity="error">{message}</Alert>}
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
