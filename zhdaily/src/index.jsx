/* 程序打包入口 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/* REDUX */
import { Provider } from 'react-redux';
import store from './store';

/* ANTD-MOBILE */
import { ConfigProvider } from 'antd-mobile';
import zhCN from 'antd-mobile/es/locales/zh-CN';

/* 样式 */
import './index.less';
import 'lib-flexible'; // 处理REM换算比例

/* 处理最大宽度 */
(function () {
  const handleMax = function () {
    const html = document.documentElement,
      root = document.getElementById('root'),
      deviceW = html.clientWidth;
    root.style.maxWidth = '750px'; // 设定页面最大宽度
    if (deviceW > 750) {
      html.style.fontSize = '75px'; // 设定字体最大字号
    }
  };

  handleMax();
  window.addEventListener('resize', handleMax);
})();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>
);
