import { StyleSheet } from 'react-native'
import { blackColor, grayColor, primaryColor, whiteColor } from '../../common/colors'

export default StyleSheet.create({
	contentWrapper: {
		backgroundColor: '#fff',
		borderBottomRightRadius: 12,
		borderBottomLeftRadius: 12,
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
	},
	header: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		backgroundColor: whiteColor,
		borderBottomColor: grayColor,
		borderBottomWidth: 1,
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
	},
	title: {
		padding: 16,
		fontSize: 18,
		fontFamily: 'Lato-Bold',
		color: blackColor,
	},
	content: {
		marginTop: -12,
		padding: 20,
	},
	buttons: {
		padding: 8,
		width: '100%',
		justifyContent: 'space-between',
		flexDirection: 'row',
		backgroundColor: whiteColor,
		borderTopColor: grayColor,
		borderTopWidth: 1,
		borderBottomRightRadius: 12,
		borderBottomLeftRadius: 12,
	},
	button: {
		backgroundColor: whiteColor,
	},
	buttonText: {
		color: primaryColor,
	},
})
