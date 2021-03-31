import { StyleSheet, Dimensions } from 'react-native'
import { primaryColor } from '../../common/utility'

const { width, height } = Dimensions.get('window')

export default StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		height: '100%',
		flexDirection: 'column',
		justifyContent: 'flex-end',
		backgroundColor: '#292b2c',
	},
	barCodeScanner: {
		width,
		height,
	},
	loading: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		left: 0,
		top: 0,
		zIndex: 15,
	},
	backIcon: {
		position: 'absolute',
		top: 40,
		left: 20,
		zIndex: 20,
	},
	scannerBoxContainer: {
		position: 'absolute',
		width,
		height,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 10,
	},
	scannerBox: {
		borderBottomWidth: (height / width) * 100,
		borderTopWidth: (height / width) * 100,
		borderLeftWidth: (width / height) * 100,
		borderRightWidth: (width / height) * 100,
		borderColor: 'rgba(0,0,0,0.7)',
		width: '100%',
		height: '100%',
	},
	scannerBoxLine: {
		position: 'absolute',
		width: width - (width / height) * 100 * 2 - 16,
		height,
		left: (width / height) * 100 + 8,
		top: height / 2,
		borderColor: '#f61e19',
		opacity: 0.7,
		borderTopWidth: 8,
	},
	scannerBoxBorder: {
		borderWidth: 8,
		borderColor: primaryColor,
		opacity: 0.7,
		width: '100%',
		height: '100%',
	},
	addManuallyButtonWrapper: {
		zIndex: 20,
		position: 'absolute',
		width: '100%',
		bottom: 30,
		justifyContent: 'center',
		alignItems: 'center',
	},
	addManuallyButtonTitle: {
		color: '#fff',
		fontSize: 18,
		padding: 25,
		fontFamily: 'Lato-Light',
	},
	addManuallyButton: {
		backgroundColor: primaryColor,
	},
})
