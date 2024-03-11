module.exports = {
	publicPath: process.env.NODE_ENV === 'production'
		? '/vogon-production/'
		: '/vogon-staging/'
}
