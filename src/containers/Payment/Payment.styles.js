import { StyleSheet } from 'react-native'

export default StyleSheet.create({
	modalMessage: {
		marginTop: 15,
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 16,
		fontFamily: 'Lato-Light',
	},
	modalFooterMessage: {
		marginTop: 15,
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 12,
		fontFamily: 'Lato-Light',
	},
	inline: {
		flexDirection: 'row',
	},
	permission: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		flex: 1,
		marginLeft: 8,
	},
	textPermission: {
		display: 'flex',
		textAlign: 'left',
		fontSize: 15,
		fontFamily: 'Lato-Light',
	},
	checkPermission: {
		display: 'flex',
		flex: 1,
	},
	href: {
		color: '#4d6999',
		fontFamily: 'Lato-Bold',
	},
	image: {
		width: 100,
		height: 100,
		marginBottom: 30,
		fontFamily: 'Lato-Light',
	},
	buttonContainer: {
		marginTop: 20,
		marginBottom: 20,
	},
	buttonTitle: {
		color: '#fff',
		fontSize: 18,
		padding: 25,
		fontFamily: 'Lato-Light',
	},
	pajacykText: {
		fontSize: 20,
		fontFamily: 'Lato-Bold',
		color: '#4d6999',
		textAlign: 'center',
		marginBottom: 20,
		marginTop: 10,
	},
	errorEmail: {
		fontSize: 16,
		fontFamily: 'Lato-Light',
		color: '#dc3545',
	},
	charity: {
		fontSize: 20,
		fontFamily: 'Lato-Light',
		color: '#000',
		textAlign: 'center',
	},
	contentScrollView: {
		marginLeft: 20,
		marginRight: 20,
		alignItems: 'center',
	},
	inputContainer: {
		width: '100%',
		marginTop: 30,
		marginBottom: -10,
	},
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: '#fff',
	},
	headerCenterComponent: {
		fontSize: 20,
		fontFamily: 'Lato-Light',
		color: '#000',
	},
	icon: {
		marginTop: 5,
		marginLeft: 20,
	},
	scrollView: {
		flex: 1,
		width: '100%',
	},
	amount: {
		fontFamily: 'Lato-Regular',
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
})
