import React, { useState } from 'react';
import NavBarAgain from '../component/NavBarAgain';
import ButtonAgain from '../component/ButtonAgain';
import styled from 'styled-components';
import { ImageUploader, Input, Toast } from 'antd-mobile';
import { connect } from 'react-redux';
import action from '../store/action';
import api from '../api';

/* 样式 */
const UpdateBox = styled.div`
  .formBox {
    padding: 30px;

    .item {
      display: flex;
      align-items: center;
      height: 110px;
      line-height: 110px;
      font-size: 28px;

      .label {
        width: 20%;
        text-align: center;
      }

      .input {
        width: 80%;
      }
    }
  }

  .submit {
    display: block;
    margin: 0 auto;
    width: 60%;
    height: 70px;
    font-size: 28px;
  }
`;

const Update = function Update(props) {

  return (
    <UpdateBox>
      <NavBarAgain title="修改信息" />
      <div className="formBox">
        <div className="item">
          <div className="label">头像</div>
          <div className="input">
            <ImageUploader/>
          </div>
        </div>
        <div className="item">
          <div className="label">姓名</div>
          <div className="input">
            <Input
              placeholder="请输入账号名称"
            />
          </div>
        </div>
        <ButtonAgain color="primary" className="submit" >
          提交
        </ButtonAgain>
      </div>
    </UpdateBox>
  );
};
export default connect(state => state.base, action.base)(Update);
