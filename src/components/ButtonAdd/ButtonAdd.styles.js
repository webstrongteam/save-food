import { Platform, StyleSheet } from 'react-native'

export default StyleSheet.create({
	container: {
		width: 100,
		height: 25,
		borderWidth: 1,
		flexDirection: 'row',
		borderRadius: 2,
		opacity: 0.75,
	},
	button: {
		flex: 1,
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
	},
	contentWrapper: {
		flex: 2,
		borderLeftWidth: 1,
		borderRightWidth: 1,
		paddingTop: Platform.OS === 'ios' ? 0 : 2,
		justifyContent: 'center',
	},
	contentText: {
		flex: 1,
		fontSize: 16,
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
	},
})
