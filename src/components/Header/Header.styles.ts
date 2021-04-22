import { StyleSheet } from 'react-native'
import { STATUS_BAR_HEIGHT } from '../../common/utility'

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
		marginTop: STATUS_BAR_HEIGHT + 12,
		marginBottom: 10,
		justifyContent: 'space-between',
	},
})
