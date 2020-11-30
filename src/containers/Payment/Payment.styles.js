import { StyleSheet, Platform } from 'react-native'

const os = Platform.OS

export default StyleSheet.create({
	webviewContainer: {
		flex: 1,
		backgroundColor: '#fff',
	},
	webview: {
		marginTop: os === 'ios' ? 20 : 40,
	},
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: '#fff',
	},
	modalMessage: {
		marginTop: 15,
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 16,
		fontFamily: 'Lato-Light',
	},
	headerIcon: {
		marginTop: 5,
		marginLeft: 20,
	},
	headerCenterComponent: {
		fontSize: 20,
		fontFamily: 'Lato-Light',
		color: '#000',
	},
	scrollView: {
		flex: 1,
		width: '100%',
	},
	scrollViewContent: {
		marginLeft: 20,
		marginRight: 20,
		alignItems: 'center',
	},
	inputContainer: {
		width: '100%',
		marginTop: 30,
		marginBottom: 20,
	},
	leftIconInput: {
		opacity: 0.5,
	},
	labelStyleInput: {
		fontFamily: 'Lato-Bold',
	},
	inputStyle: {
		fontFamily: 'Lato-Light',
	},
	errorEmail: {
		fontSize: 16,
		fontFamily: 'Lato-Light',
		color: '#dc3545',
	},
	charityWrapper: {
		alignItems: 'center',
	},
	charity: {
		fontSize: 20,
		fontFamily: 'Lato-Light',
		color: '#000',
		textAlign: 'center',
	},
	charityText: {
		fontSize: 20,
		fontFamily: 'Lato-Bold',
		color: '#4d6999',
		width: '100%',
		marginBottom: 20,
		marginTop: 10,
	},
	charityImage: {
		width: 100,
		height: 100,
		marginBottom: 30,
	},
	inline: {
		flexDirection: 'row',
	},
	checkPermission: {
		display: 'flex',
		flex: 1,
	},
	permission: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		flex: 1,
		marginLeft: 8,
	},
	permissionText: {
		textAlign: 'left',
		fontSize: 15,
		fontFamily: 'Lato-Light',
	},
	href: {
		color: '#4d6999',
		fontFamily: 'Lato-Bold',
	},
	buttonContainer: {
		marginTop: 20,
		marginBottom: 20,
	},
	buttonStyle: {
		backgroundColor: '#4b8b1d',
	},
	buttonTitle: {
		color: '#fff',
		fontSize: 18,
		padding: 25,
		fontFamily: 'Lato-Light',
	},
})
