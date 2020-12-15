/*
 * @Author: vuvivian
 * @Date: 2020-11-01 20:54:41
 * @LastEditors: vuvivian
 * @LastEditTime: 2020-11-15 13:33:11
 * @Descripttion: 
 * @FilePath: /umi-app/config/proxy.ts
 */
/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/risk/*': {
      target: 'http://wd.90ruizhitong.com:8088',
      // target: 'http://localhost:8080',
      ws: true,
      changeOrigin: true, //是否跨域
      pathRewrite: {
        '^/risk': '', //需要rewrite重写
      },
      // onProxyRes: function(proxyRes, req, res) {
      //   let cookies = proxyRes.headers['set-cookie'];
      //   let cookieRegex = /Path=\/risk\//i;
      //   //修改cookie Path
      //   if (cookies) {
      //     let newCookie = cookies.map(function(cookie) {
      //       if (cookieRegex.test(cookie)) {
      //         return cookie.replace(cookieRegex, 'Path=/');
      //       }
      //       return cookie;
      //     });
      //     //修改cookie path
      //     delete proxyRes.headers['set-cookie'];
      //     proxyRes.headers['set-cookie'] = newCookie;
      //   }
      //   // console.log('end')
      // },
    },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
