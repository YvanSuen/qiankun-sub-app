module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
     devServer: {
        proxy: {
            '/': {
              target: 'http://localhost:8080', //后台服务地址
              changeOrigin: true,
              pathRewrite: {
              }
            }
          }
       }
  
}
