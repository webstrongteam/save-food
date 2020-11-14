import { StyleSheet } from 'react-native'

export default StyleSheet.create({
	modalMessage: {
		marginTop: 15,
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 16,
		fontFamily: 'Lato-Light',
	},
	modalFooterMessage: {
		marginTop: 15,
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 12,
		fontFamily: 'Lato-Light',
	},
	inline: {
		flexDirection: 'row',
	},
	statuse: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		flex: 1,
		marginLeft: 8,
	},
	textStatuse: {
		display: 'flex',
		textAlign: 'left',
		fontSize: 15,
		fontFamily: 'Lato-Light',
	},
	checkStatuse: {
		display: 'flex',
		flex: 1,
	},
	href: {
		color: '#4d6999',
		fontFamily: 'Lato-Bold',
	},
	image: {
		width: 100,
		height: 100,
		marginBottom: 30,
		fontFamily: 'Lato-Light',
	},
})
