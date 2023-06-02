import React, { Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import routes from './routes';
import { Mask, DotLoading } from 'antd-mobile';

/* 统一路由配置，并渲染路由匹配到的组件 */
const Element = function Element(props) {
  let { component: Component, meta } = props;

  // 修改页面title
  const { title = '知乎日报-WebApp' } = meta || {};
  document.title = title;

  // 登录态校验
  // 路由跳转到个人主页/我的收藏等页面时，需要进行登录态校验
  // ...

  // 获取路由信息，基于属性传递给组件
  const navigate = useNavigate(),
    location = useLocation(),
    params = useParams(),
    [usp] = useSearchParams();

  return <Component navigate={navigate} location={location} params={params} usp={usp} />;
};

export default function RouterView() {
  return (
    <Suspense
      fallback={
        <Mask visible={true}>
          <DotLoading color="white" />
        </Mask>
      }
    >
      <Routes>
        通过路由表循环创建路由匹配规则
        {routes.map((item) => {
          let { name, path } = item;
          return <Route key={name} path={path} element={<Element {...item} />} />;
        })}
      </Routes>
    </Suspense>
  );
}
