import React, { useMemo, useEffect } from 'react';
import timg from '../assets/images/timg.jpg'; // 使用ES6 Module导入图片
import './HomeHead.less';
import { connect } from 'react-redux';
import action from '../store/action';
import { useNavigate } from 'react-router-dom';

const HomeHead = function HomeHead(props) {
  const navigate = useNavigate();

  /* 计算时间中的月和日 */
  let { today, info, queryUserInfoAsync } = props;
  let time = useMemo(() => {
    let [, month, day] = today.match(/^\d{4}(\d{2})(\d{2})$/);
    let arr = [
      '',
      '一',
      '二',
      '三',
      '四',
      '五',
      '六',
      '七',
      '八',
      '九',
      '十',
      '十一',
      '十二'
    ];
    return {
      month: arr[+month] + '月',
      day
    };
  }, [today]);

  // 第一次渲染完：如果info中没有信息，我们尝试派发一次，获取到登录者信息
  useEffect(() => {
    if (!info) {
      queryUserInfoAsync();
    }
  }, []);

  return (
    <header className="home-head-box">
      <div className="info">
        <div className="time">
          <span>{time.day.replace(/0(\d)/, '$1')}</span>
          <span>{time.month}</span>
        </div>
        <h2 className="title">知乎日报</h2>
      </div>

      <div
        className="picture"
        onClick={() => {
          navigate('/personal');
        }}
      >
        <img src={info ? info.pic : timg} alt="" />
      </div>
    </header>
  );
};

// 将 Redux store 的状态和 action creators 映射到 HomeHead 组件的 props，然后导出这个已经连接到 Redux store 的 HomeHead 组件。
export default connect(state => state.base, action.base)(HomeHead);
