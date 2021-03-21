import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import './register.scss';

function RegisterForm(props) {
    const { getFieldDecorator } = props.form;
    const [confirmBlur, setConfirmBlur] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        props.form.validateFields(async (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                props.register(values);
            }
        });
    };

    const compareToFirstPassword = (rule, value, callback) => {
        const { form } = props;
        if (value && value !== form.getFieldValue('password')) {
            callback('Passwords do not match!');
        } else {
            callback();
        }
    };

    const validateToNextPassword = (rule, value, callback) => {
        const { form } = props;
        if (value && confirmBlur) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };

    const handleConfirmBlur = (e) => {
        const { value } = e.target;
        setConfirmBlur({ confirmDirty: confirmBlur || !!value });
    };

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };

    const formFooterLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0,
            },
            sm: {
                span: 16,
                offset: 8,
            },
        },
    };

    return (
        <Form {...formItemLayout} className="register-form" onSubmit={handleSubmit}>
            <p>Register with your email and password</p>
            <Form.Item label="E-mail">
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
                })(<Input />)}
            </Form.Item>
            <Form.Item label="Password">
                {getFieldDecorator('password', {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                        {
                            validator: validateToNextPassword,
                        },
                    ],
                })(<Input.Password />)}
            </Form.Item>
            <Form.Item label="Confirm Password">
                {getFieldDecorator('confirm', {
                    rules: [
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        {
                            validator: compareToFirstPassword,
                        },
                    ],
                })(<Input.Password onBlur={handleConfirmBlur} />)}
            </Form.Item>
            <Form.Item label="Display Name">
                {getFieldDecorator('displayName', {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your name!',
                            whitespace: true,
                        },
                    ],
                })(<Input />)}
            </Form.Item>
            <Form.Item {...formFooterLayout}>
                <Button type="primary" htmlType="submit">
                    Register
                </Button>
                &nbsp; Or&nbsp;
                <span className="customLink" onClick={props.toLogin}>
                    back to login
                </span>
            </Form.Item>
        </Form>
    );
}

export default Form.create({ name: 'login' })(RegisterForm);
