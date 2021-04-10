import { StyleSheet } from 'react-native'
import { primaryColor } from '../../common/utility'

export default StyleSheet.create({
	flex: {
		flex: 1,
	},
	imageContainer: {
		width: 200,
		height: 200,
		flex: 1,
		backgroundColor: '#fff',
		marginTop: 12,
		marginBottom: 12,
	},
	image: {
		width: 200,
		height: 200,
		resizeMode: 'cover',
	},
	header: {
		color: '#000',
		fontSize: 21,
	},
	infoIcon: {
		marginRight: 20,
	},
	infoTextWrapper: {
		marginTop: 12,
	},
	infoText: {
		marginTop: 12,
		fontSize: 16,
		fontFamily: 'Lato-Light',
	},
	inputWrapper: {
		marginLeft: 25,
		marginRight: 25,
		marginBottom: 32,
	},
	contentWrapper: {
		flex: 1,
		alignItems: 'center',
		marginBottom: 110,
	},
	contentTextWrapper: {
		fontSize: 18,
		textAlign: 'center',
		marginLeft: 25,
		marginRight: 25,
	},
	lightText: {
		fontFamily: 'Lato-Light',
	},
	boldText: {
		fontFamily: 'Lato-Bold',
	},
	slider: {
		marginTop: 20,
		marginBottom: 20,
		overflow: 'visible',
	},
	paymentButtonContainer: {
		position: 'absolute',
		width: '100%',
		bottom: 25,
	},
	paymentButtonWrapper: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	paymentButton: {
		width: 220,
		height: 42,
		backgroundColor: primaryColor,
	},
	paymentButtonTitle: {
		color: '#fff',
		fontSize: 18,
		padding: 25,
		fontFamily: 'Lato-Light',
	},
})
