import { StyleSheet } from 'react-native'
import { primaryColor } from '../../common/utility'

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
		width: '100%',
		height: '100%',
	},
	loading: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		left: 0,
		top: 0,
	},
	backIcon: {
		position: 'absolute',
		top: 40,
		left: 20,
		zIndex: 20,
	},
	scannerBoxContainer: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 10,
	},
	scannerBox: {
		borderBottomWidth: 180,
		borderTopWidth: 180,
		borderLeftWidth: 45,
		borderRightWidth: 45,
		borderColor: 'rgba(0,0,0,0.7)',
		width: '100%',
		height: '100%',
	},
	scannerBoxBorder: {
		borderWidth: 2,
		borderStyle: 'dashed',
		borderColor: primaryColor,
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
