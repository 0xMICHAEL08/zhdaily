/* 对NavBar组件的二次封装 */
import React from 'react';
import { PropTypes } from 'prop-types';
import { NavBar } from 'antd-mobile';

const NavBarAgain = function NavBarAgain(props) {
  let { title } = props;

  const handleBack = () => {
    // 对复杂业务逻辑做统一处理
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
