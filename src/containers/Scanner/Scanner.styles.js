import { StyleSheet } from 'react-native'

export default StyleSheet.create({
	container: {
		flex: 1,
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
		borderColor: '#4b8b1d',
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
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.2,
		shadowRadius: 5,
		elevation: 7,
	},
	addManuallyButtonTitle: {
		color: '#fff',
		fontSize: 18,
		padding: 25,
		fontFamily: 'Lato-Light',
	},
	addManuallyButton: {
		backgroundColor: '#4b8b1d',
	},
})
