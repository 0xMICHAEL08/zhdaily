import React from 'react';
import { Link } from 'react-router-dom';
import { RightOutline } from 'antd-mobile-icons';
import styled from 'styled-components';
import NavBarAgain from '../component/NavBarAgain';
import { connect } from 'react-redux';
import action from '../store/action';
import _ from '../assets/utils';
import { Toast } from 'antd-mobile';

/* 样式 */
const PersonalBox = styled.div`
  .baseInfo {
    box-sizing: border-box;
    margin: 40px 0;
    .pic {
      display: block;
      margin: 0 auto;
      width: 172px;
      height: 172px;
      border-radius: 50%;
    }
    .name {
      line-height: 100px;
      font-size: 36px;
      text-align: center;
      color: #000;
    }
  }
  .tab {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    height: 80px;
    line-height: 80px;
    font-size: 24px;
    color: #000;
    border-bottom: 2px solid #eee;
  }
`;

const Personal = function Personal(props) {
  let { info, clearUserInfo, clearStoreList, navigate } = props;

  return (
    <PersonalBox>
      <NavBarAgain title="个人中心" />
      <div className="baseInfo">
        <Link to="/update">
          <img className="pic" alt="" />
          <p className="name">name</p>
        </Link>
      </div>
      <div>
        <Link to="/store" className="tab">
          我的收藏
          <RightOutline />
        </Link>
        <div className="tab">
          退出登录
          <RightOutline />
        </div>
      </div>
    </PersonalBox>
  );
};

export default Personal;
