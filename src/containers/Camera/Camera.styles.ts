import { StyleSheet } from 'react-native'
import { primaryColor, whiteColor } from '../../common/colors'

export default StyleSheet.create({
	camera: {
		width: '100%',
		height: '100%',
	},
	takePhotoButtonWrapper: {
		position: 'absolute',
		width: '100%',
		bottom: 30,
		justifyContent: 'center',
		alignItems: 'center',
	},
	takeFoodButton: {
		backgroundColor: primaryColor,
	},
	takeFoodButtonTitle: {
		color: whiteColor,
		fontSize: 18,
		padding: 25,
		fontFamily: 'Lato-Light',
	},
	loading: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		left: 0,
		top: 0,
	},
})
