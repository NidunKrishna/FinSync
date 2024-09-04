// webpack.config.js
module.exports = {
    // ... other configurations
    devServer: {
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          secure: false,
          changeOrigin: true,
        },
      },
    },
  };