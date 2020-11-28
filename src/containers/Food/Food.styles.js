import { Dimensions, StyleSheet } from 'react-native'

const heightWindow = Dimensions.get('window').height

export default StyleSheet.create({
	camera: {
		width: '100%',
		height: '100%',
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
		color: '#fff',
		fontSize: 16,
		padding: 24,
		fontFamily: 'Lato-Light',
		textAlign: 'center',
	},
	takePhotoButtonWrapper: {
		position: 'absolute',
		width: '100%',
		bottom: 30,
		justifyContent: 'center',
		alignItems: 'center',
	},
	takeFoodButton: {
		backgroundColor: '#4b8b1d',
	},
	takeFoodButtonTitle: {
		color: '#fff',
		fontSize: 18,
		padding: 25,
		fontFamily: 'Lato-Light',
	},
	linearGradient1: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	linearGradient2: {
		width: '200%',
		height: heightWindow * 0.7,
		left: '-30%',
		top: '-30%',
		backgroundColor: 'red',
		transform: [{ skewY: '-30deg' }],
		position: 'absolute',
		zIndex: 0,
	},
	backIcon: {
		marginTop: 5,
		marginLeft: 20,
	},
	headerTitle: {
		textAlign: 'center',
		fontSize: 22,
		color: '#fff',
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
		borderColor: '#4b8b1d',
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
	slider: {
		width: '100%',
	},
	sliderThumbStyle: {
		width: 28,
		height: 28,
	},
	percentInfo: {
		textAlign: 'center',
		color: '#292b2c',
		fontFamily: 'Lato-Light',
		fontSize: 16,
	},
	percent: {
		textAlign: 'center',
		color: '#292b2c',
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
		borderColor: '#4b8b1d',
		width: '100%',
	},
	saveButtonTitle: {
		color: '#4b8b1d',
		fontSize: 18,
		fontFamily: 'Lato-Light',
	},
})
