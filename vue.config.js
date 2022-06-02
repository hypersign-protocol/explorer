module.exports = {
    baseUrl: process.env.NODE_ENV === 'production' ?
        '/explorer/' : '/explorer/',
    devServer: {
        port: 5001
    }
}