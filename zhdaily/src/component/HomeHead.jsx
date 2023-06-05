import React from 'react';
import timg from '../assets/images/timg.jpg'; // 使用ES6 Module导入图片

const HomeHead = function HomeHead() {
  return (
    <header className="home-head-box">
      <div className="info">
        <div className="time">
          <span>02</span>
          <span>十一月</span>
        </div>
        <h2 className="title">知乎日报</h2>
      </div>

      <div className="picture">
        <img src={timg} alt="" />
      </div>
    </header>
  );
};

export default HomeHead;
