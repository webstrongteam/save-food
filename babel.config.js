module.exports = function (api) {
	api.cache(true)
	return {
		presets: ['babel-preset-expo'],
		// Uncomment it for e2e tests
		// plugins: ['transform-react-remove-prop-types'],
	}
}
