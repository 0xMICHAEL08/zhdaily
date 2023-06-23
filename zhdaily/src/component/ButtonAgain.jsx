import React, { useState } from 'react';
import { Button } from 'antd-mobile';

const ButtonAgain = function ButtonAgain(props) {
  // props包含了调用<Button>组件时传入的所有属性
  let options = { ...props }; // 浅拷贝
  let { children, onClick: handle } = options;
  delete options.children;

  let [loading, setLoading] = useState(false);
  const clickHandle = async () => {
    setLoading(true);
    // 如果handle失败，就会执行catch，仍然返回成功的实例，保证点击之后必然将setLoading改为FALSE
    try {
      await handle();
    } catch (_) {}
    setLoading(false);
  };
  if (handle) {
    options.onClick = clickHandle;
  }

  return (
    <Button {...options} loading={loading}>
      {children}
    </Button>
  );
};

export default ButtonAgain;
