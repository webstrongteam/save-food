import { StyleSheet } from 'react-native'
import { STATUS_BAR_HEIGHT } from '../../common/utility'

export default StyleSheet.create({
	backIcon: {
		marginLeft: 20,
	},
	exitIcon: {
		position: 'absolute',
		top: STATUS_BAR_HEIGHT + 20,
		left: 20,
		zIndex: 20,
	},
})
