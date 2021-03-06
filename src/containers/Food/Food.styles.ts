import { StyleSheet } from 'react-native'
import { blackColor, primaryColor, whiteColor } from '../../common/colors'

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
	discardChanges: {
		marginTop: 12,
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 16,
		fontFamily: 'Lato-Light',
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
	headerTitle: {
		textAlign: 'center',
		fontSize: 22,
		color: whiteColor,
	},
	modalContentWrapper: {
		flexDirection: 'column',
		justifyContent: 'center',
	},
	selectedButtonStyle: {
		backgroundColor: primaryColor,
	},
	contentWrapper: {
		flex: 1,
		width: '100%',
		justifyContent: 'center',
	},
	imageContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
	},
	imageWrapper: {
		width: 200,
		height: 200,
		marginTop: 20,
	},
	image: {
		width: 200,
		height: 200,
		resizeMode: 'cover',
		borderRadius: 100,
		borderWidth: 4,
		borderColor: primaryColor,
	},
	tapImage: {
		position: 'absolute',
		width: '100%',
		justifyContent: 'center',
		backgroundColor: 'rgba(0,0,0,0.3)',
		borderRadius: 100,
		alignItems: 'center',
		height: '100%',
		left: 0,
		top: 0,
	},
	tapImageText: {
		color: whiteColor,
		fontSize: 16,
		padding: 24,
		fontFamily: 'Lato-Light',
		textAlign: 'center',
	},
	infoWindowsContainer: {
		flex: 1,
		marginTop: 30,
		flexDirection: 'column',
		marginBottom: 30,
	},
	sliderContainer: {
		flex: 1,
		justifyContent: 'center',
		marginLeft: 30,
		marginRight: 30,
		marginTop: 30,
	},
	percentInfo: {
		textAlign: 'center',
		color: blackColor,
		fontFamily: 'Lato-Light',
		fontSize: 16,
	},
	slider: {
		width: '100%',
	},
	sliderThumbStyle: {
		width: 28,
		height: 28,
	},
	percent: {
		textAlign: 'center',
		color: blackColor,
		fontFamily: 'Lato-Bold',
		fontSize: 16,
	},
	saveButtonContainer: {
		flex: 1,
		marginBottom: 50,
		flexDirection: 'row',
		justifyContent: 'center',
	},
	saveButton: {
		borderColor: primaryColor,
		width: '100%',
	},
	saveButtonTitle: {
		color: primaryColor,
		fontSize: 18,
		fontFamily: 'Lato-Light',
	},
})
