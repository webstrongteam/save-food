import { StyleSheet } from 'react-native'

export default StyleSheet.create({
	headerTitle: {
		textAlign: 'center',
		fontSize: 22,
		color: '#fff',
	},
	container: {
		backgroundColor: '#292b2c',
		alignItems: 'center',
		flex: 1,
		flexDirection: 'column',
	},
	settingsWrapper: {
		marginTop: 125,
		width: '100%',
	},
	text: {
		color: '#fff',
		textAlign: 'center',
		fontSize: 22,
		margin: 5,
	},
	clear: {
		flexDirection: 'row',
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 40,
	},
	clearText: {
		fontSize: 22,
		color: '#ddd',
		textAlign: 'center',
		fontFamily: 'Lato-Light',
	},
	clearTheDatabase: {
		marginTop: 15,
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 16,
		fontFamily: 'Lato-Light',
	},
	footerContainer: {
		position: 'absolute',
		bottom: 20,
	},
	versionText: {
		fontSize: 12,
		color: '#ddd',
		textAlign: 'center',
		fontFamily: 'Lato-Light',
	},
	linkText: {
		fontSize: 12,
		color: '#ddd',
		textAlign: 'center',
		fontFamily: 'Lato-Light',
	},
})
