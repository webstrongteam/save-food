import { Platform, StyleSheet } from 'react-native'

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
		marginTop: Platform.OS === 'ios' ? 32 : 48,
		marginBottom: 10,
		justifyContent: 'space-between',
	},
})
