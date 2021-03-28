import { Dimensions, StyleSheet } from 'react-native'

const heightWindow = Dimensions.get('window').height

export default StyleSheet.create({
	wrapper: {
		flex: 1,
	},
	container: {
		width: '200%',
		height: heightWindow * 0.7,
		left: '-30%',
		top: '-25%',
		backgroundColor: 'red',
		transform: [{ skewY: '-30deg' }],
		position: 'absolute',
		zIndex: -1,
	},
})
