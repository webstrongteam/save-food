import { StatusBar, StyleSheet } from 'react-native'

const statusBarHeight = StatusBar.currentHeight ?? 20

export default StyleSheet.create({
	container: {
		position: 'relative',
		zIndex: 200,
		top: 0,
		left: 0,
		height: 40,
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: statusBarHeight + 12,
		marginBottom: 10,
		justifyContent: 'space-between',
	},
})
