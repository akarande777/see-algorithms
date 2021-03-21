import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import './login.scss';

function LoginForm(props) {
    const { getFieldDecorator } = props.form;

    const handleSubmit = (e) => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                props.login(values);
            }
        });
    };

    return (
        <Form onSubmit={handleSubmit} className="login-form">
            <p>Login with your email and password</p>
            <Form.Item>
                {getFieldDecorator('email', {
                    rules: [
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                    ],
                })(
                    <Input
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="E-mail"
                    />
                )}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Please input your password!' }],
                })(
                    <Input
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type="password"
                        placeholder="Password"
                    />
                )}
            </Form.Item>
            {/* <Form.Item>
                {getFieldDecorator('remember', {
                    valuePropName: 'checked',
                    initialValue: true,
                })(<Checkbox>Remember me</Checkbox>)}
                <span className="customLink float-right">Forgot password</span>
            </Form.Item> */}
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Log in
                </Button>
                &nbsp; Or&nbsp;
                <span className="customLink" onClick={props.toRegister}>
                    register now!
                </span>
            </Form.Item>
        </Form>
    );
}

export default Form.create({ name: 'login' })(LoginForm);
