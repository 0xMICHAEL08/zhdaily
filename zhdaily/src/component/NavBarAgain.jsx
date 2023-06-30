/* 对NavBar组件的二次封装 */
import React from 'react';
import { PropTypes } from 'prop-types';
import { NavBar } from 'antd-mobile';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import './NavBarAgain.less';

const NavBarAgain = function NavBarAgain(props) {
  let { title } = props;
  const navigate = useNavigate(),
    location = useLocation(),
    [usp] = useSearchParams();
  console.log(location);

  const handleBack = () => {
    // 特殊情况：登录页 & to的值是/detail/xxx
    let to = usp.get('to');
    if (location.pathname === '/login' && /^\/detail\/\d+$/.test(to)) {
      navigate(to, { replace: true });
      return;
    }
    navigate(-1);
  };

  return <NavBar onBack={handleBack}>{title}</NavBar>;
};

/* 设置title默认值 */
NavBarAgain.defaultProps = {
  title: '个人中心',
};
NavBarAgain.propTypes = {
  title: PropTypes.string,
};

export default NavBarAgain;
