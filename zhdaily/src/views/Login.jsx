import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Toast } from 'antd-mobile';
import NavBarAgain from '../component/NavBarAgain';
import './Login.less';

/* 自定义表单校验规则 */
const validate = {
  phone(_, value) {
    // antd表单校验规则有两个参数，我们只用第二个
    value = value.trim();
    let reg = /^(?:(?:\+|00)86)?1\d{10}$/;
    if (value.length === 0) return Promise.reject(new Error('手机号是必填项！'));
    if (!reg.test(value)) return Promise.reject(new Error('手机号格式有误！'));
    return Promise.resolve();
  },
  code(_, value) {
    value = value.trim();
    let reg = /^\d{6}$/;
    if (value.length === 0) return Promise.reject(new Error('验证码是必填项！'));
    if (!reg.test(value)) return Promise.reject(new Error('验证码格式有误！'));
    return Promise.resolve();
  },
};

const Login = function Login(props) {
  /* 状态 */
  const [formIns] = Form.useForm();

  /* 表单提交 */
  const submit = (values) => {
    // 表单校验已经成功了
    // values: Form自动收集的每个表单的信息
   
  };

  /* 发送验证码 */
  const send = async () => {
    try {
      await formIns.validateFields(['phone']); // validateFields要求传入数组
      // 手机号格式校验通过
    } catch (_) {}
  };

  return (
    <div className="login-box">
      <NavBarAgain title="登录/注册" />

      <Form
        layout="horizontal"
        style={{ '--border-top': 'none' }}
        footer={
          <Button type="submit" color="primary">
            提交
          </Button>
        }
        onFinish={submit} // 提交表单且数据验证成功后触发
        form={formIns} // 获取表单实例
        initialValues={{ phone: '', code: '' }} // 表单默认值
      >
        <Form.Item name="phone" label="手机号" rules={[{ validator: validate.phone }]}>
          <Input placeholder="请输入手机号" />
        </Form.Item>

        <Form.Item
          name="code"
          label="验证码"
          rules={[{ validator: validate.code }]}
          extra={
            <Button size="small" color="primary" onClick={send}>
              发送验证码
            </Button>
          }
        >
          <Input />
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
