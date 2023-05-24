/* 配置跨域代理 */

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "http://127.0.0.1:7100", // 目标服务器地址
      changeOrigin: true, // 改变请求头中的host值
      ws: true, // 支持websocket
      pathRewrite: { "^/api": "" }, // 重写请求路径
    })
  );
};
