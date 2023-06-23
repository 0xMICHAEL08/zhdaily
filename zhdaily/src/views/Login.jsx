import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Toast } from 'antd-mobile';
import NavBarAgain from '../component/NavBarAgain';
import ButtonAgain from '../component/ButtonAgain';
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
  const [formIns] = Form.useForm(),
    [disabled, setDisabled] = useState(false),
    [sendText, setSendText] = useState('发送验证码');

  /* 表单提交 */
  const delay = (interval = 1000) => {
    // 防抖处理
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, interval);
    });
  };
  const submit = async (values) => {
    // values: Form自动收集的每个表单的信息
    try {
      await formIns.validateFields(); // 不填参数，对每一项都做校验
      let values = formIns.getFieldValue(); // 获取表单信息：{phone: '...', code: '...'}
      await delay(3000);
    } catch (_) {}
  };

  /* 发送验证码 */
  const send = async () => {
    try {
      // Form组件会找到名为"phone"的Form.Item，然后执行它的校验规则
      await formIns.validateFields(['phone']);
      await delay(3000);
    } catch (_) {}
  };

  return (
    <div className="login-box">
      <NavBarAgain title="登录/注册" />

      <Form
        layout="horizontal"
        style={{ '--border-top': 'none' }}
        footer={
          <ButtonAgain color="primary" onClick={submit}>
            提交
          </ButtonAgain>
        }
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
            <ButtonAgain size="small" color="primary" onClick={send} disabled={disabled}>
              {sendText}
            </ButtonAgain>
          }
        >
          <Input />
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
