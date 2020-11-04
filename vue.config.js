module.exports = {
	publicPath: '/vogon-staging/',
	configureWebpack: config => {
		if (process.env.NODE_ENV === 'production') {
		} else {
			// mutate for development...
		}
	}
}