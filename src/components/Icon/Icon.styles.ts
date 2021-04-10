import { StyleSheet, StatusBar } from 'react-native'

const statusBarHeight = StatusBar.currentHeight ?? 20

export default StyleSheet.create({
	backIcon: {
		marginLeft: 20,
	},
	exitIcon: {
		position: 'absolute',
		top: statusBarHeight + 20,
		left: 20,
		zIndex: 20,
	},
})
