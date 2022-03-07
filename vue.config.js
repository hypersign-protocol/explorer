module.exports = {
  baseUrl: process.env.NODE_ENV === 'production'
    ? '/static-explorer'
    : '/',
  devServer: {
      port: 5001
    }
}
