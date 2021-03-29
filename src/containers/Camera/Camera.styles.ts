import { StyleSheet } from 'react-native'
import { primaryColor } from '../../common/utility'

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
		color: '#fff',
		fontSize: 18,
		padding: 25,
		fontFamily: 'Lato-Light',
	},
})
