import { Dimensions, StyleSheet } from 'react-native'

const heightWindow = Dimensions.get('window').height

export default StyleSheet.create({
	leftHeaderIcon: {
		marginTop: 5,
		marginLeft: 20,
	},
	headerTitle: {
		textAlign: 'center',
		fontSize: 22,
		color: '#fff',
	},
	listItem: {
		width: '100%',
		borderRadius: 5,
		flexDirection: 'row',
		alignItems: 'center',
		height: 160,
		marginTop: 10,
		marginBottom: 10,
		padding: 5,
	},
	checkbox: {
		color: '#fff',
		flex: 1,
	},
	text: {
		fontFamily: 'Lato-Light',
		fontSize: 14,
		color: '#fff',
		marginLeft: 10,
		marginBottom: 5,
	},
	priceText: {
		fontFamily: 'Lato-Bold',
		position: 'absolute',
		bottom: 12,
		right: 10,
		color: '#fff',
		fontSize: 22,
	},
	swipeable: {
		paddingLeft: 10,
		paddingRight: 10,
	},
	delete: {
		height: 75,
		borderRadius: 5,
		marginTop: 10,
		marginBottom: 0,
		flexDirection: 'row',
		padding: 10,
		justifyContent: 'flex-start',
		marginLeft: 10,
		alignItems: 'center',
		backgroundColor: '#dc3545',
	},
	edit: {
		height: 75,
		borderRadius: 5,
		marginTop: 10,
		marginBottom: 10,
		flexDirection: 'row',
		padding: 10,
		justifyContent: 'flex-start',
		marginLeft: 10,
		alignItems: 'center',
		backgroundColor: '#f8aa24',
	},
	icon: {
		marginLeft: 10,
	},
	checkboxWrapper: {
		flex: 1,
	},
	imageWrapper: {
		paddingBottom: 10,
	},
	image: {
		width: 100,
		height: 100,
	},
	productDetails: {
		flex: 3,
	},
	container: {
		marginBottom: 75,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.3,
		shadowRadius: 5,
		elevation: 7,
	},
	containerColor: {
		width: '200%',
		height: heightWindow * 0.7,
		left: '-30%',
		top: '-25%',
		backgroundColor: 'red',
		transform: [{ skewY: '-30deg' }],
		position: 'absolute',
		zIndex: -1,
	},
	nameText: {
		fontFamily: 'Lato-Bold',
		fontSize: 20,
		color: '#fff',
		marginLeft: 10,
		marginBottom: 5,
		marginTop: -30,
	},
	paymentButtonContainer: {
		position: 'absolute',
		width: '100%',
		bottom: 0,
	},
	paymentButtonWrapper: {
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.2,
		shadowRadius: 5,
		elevation: 7,
	},
	paymentButton: {
		backgroundColor: '#4b8b1d',
	},
	paymentButtonTitle: {
		color: '#fff',
		fontSize: 18,
		padding: 25,
		fontFamily: 'Lato-Light',
	},
})
