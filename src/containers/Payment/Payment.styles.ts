import { Platform, StyleSheet } from 'react-native'
import { primaryColor } from '../../common/utility'

export default StyleSheet.create({
	flex: {
		flex: 1,
	},
	imageContainer: {
		width: 200,
		height: 200,
		flex: 1,
		marginBottom: Platform.OS === 'ios' ? 0 : -1, // Prevent a random Android rendering issue
		backgroundColor: '#fff',
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
		borderBottomLeftRadius: 5,
		borderBottomRightRadius: 5,
	},
	image: {
		...StyleSheet.absoluteFillObject,
		resizeMode: 'cover',
		borderRadius: 5,
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
	},
	imageHeading: {
		fontSize: 18,
		fontFamily: 'Lato-Bold',
		color: '#fff',
		position: 'absolute',
		bottom: 16,
		left: 16,
	},
	header: {
		color: '#000',
		fontSize: 21,
		fontFamily: 'Lato-Bold',
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
		marginTop: 32,
		marginBottom: 32,
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
		backgroundColor: primaryColor,
	},
	paymentButtonTitle: {
		color: '#fff',
		fontSize: 18,
		padding: 25,
		fontFamily: 'Lato-Light',
	},
})
