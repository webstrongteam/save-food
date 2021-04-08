import { Dimensions, StyleSheet } from 'react-native'

const { height, width } = Dimensions.get('window')

export default StyleSheet.create({
	wrapper: {
		flex: 1,
	},
	container: {
		width: '200%',
		height: height * 0.7,
		left: -width * 0.3,
		top: -height * 0.25,
		transform: [{ skewY: '-30deg' }],
		position: 'absolute',
		zIndex: -1,
	},
})
