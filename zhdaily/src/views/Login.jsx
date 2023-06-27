import React, { useState, useEffect } from 'react';
import { Form, Input, Toast } from 'antd-mobile';
import NavBarAgain from '../component/NavBarAgain';
import ButtonAgain from '../component/ButtonAgain';
import './Login.less';
import api from '../api';
import _ from '../assets/utils';

/* 自定义表单校验规则 */
const validate = {
  phone(_, value) {
    value = value.trim();
    let reg = /^(?:(?:\+|00)86)?1\d{10}$/;
    if (value.length === 0) return Promise.reject(new Error('手机号是必填项!'));
    if (!reg.test(value)) return Promise.reject(new Error('手机号格式有误!'));
    return Promise.resolve();
  },
  code(_, value) {
    value = value.trim();
    let reg = /^\d{6}$/;
    if (value.length === 0) return Promise.reject(new Error('验证码是必填项!'));
    if (!reg.test(value)) return Promise.reject(new Error('验证码格式有误!'));
    return Promise.resolve();
  },
};

const Login = function Login(props) {
  /* 状态 */
  const [formIns] = Form.useForm(),
    [disabled, setDisabled] = useState(false),
    [sendText, setSendText] = useState('发送验证码');

  /* 表单提交 */
  const submit = async (values) => {
    // values: Form自动收集的每个表单的信息
    try {
      await formIns.validateFields(); // 不填参数，对每一项都做校验
      let { phone, code } = formIns.getFieldValue(); // 获取表单信息：{phone: '...', code: '...'}
      let { code: codeHttp, token } = await api.login(phone, code);
      // 登录失败
      if (+codeHttp !== 0) {
        Toast.show({
          icon: 'fail',
          content: '登陆失败',
        });
        formIns.resetFields(['code']);
        return;
      }
      // 登录成功：存储Token、存储登录者信息到redux、提示、跳转
      _.storage.set('tabck', token); // localStorage中key值的意义越模糊越安全
    } catch (_) {}
  };

  /* 发送验证码 */
  let timer = null,
    num = 60;
  const countdown = () => {
    num--;
    if (num === 0) {
      clearInterval(timer);
      timer = null;
      setSendText(`发送验证码`);
      setDisabled(false);
      return;
    }
    setSendText(`${num}秒后重发`);
  };
  const send = async () => {
    try {
      await formIns.validateFields(['phone']);
      let phone = formIns.getFieldValue('phone');
      let { code } = await api.sendPhoneCode(phone);
      if (+code !== 0) {
        Toast.show({
          icon: 'fail',
          content: '发送失败',
        });
        return;
      }
      // 发送成功
      setDisabled(true);
      countdown();
      if (!timer) timer = setInterval(countdown, 1000);
    } catch (_) {}
  };
  useEffect(() => {
    // 组件销毁的时候：清除定时器(考虑时间没到组件就销毁的情况)
    return () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
  }, []);

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
        form={formIns}
        initialValues={{ phone: '', code: '' }}
      >
        <Form.Item name="phone" label="手机号" rules={[{ validator: validate.phone }]}>
          <Input placeholder="请输入手机号" />
        </Form.Item>

        <Form.Item
          name="code"
          label="验证码"
          rules={[{ validator: validate.code }]}
          extra={
            <ButtonAgain size="small" color="primary" disabled={disabled} onClick={send}>
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
