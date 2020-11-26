import { Dimensions, StyleSheet } from 'react-native'

const heightWindow = Dimensions.get('window').height

export default StyleSheet.create({
	listItem: {
		flex: 1,
		width: '100%',
		flexDirection: 'column',
	},
	details: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	deleteProductDescription: {
		marginTop: 15,
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 16,
		fontFamily: 'Lato-Light',
	},
	leftElement: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	priceWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	quantityText: {
		marginLeft: 8,
		fontSize: 14,
		fontFamily: 'Lato-Light',
		color: '#a4a4a4',
	},
	rightElement: {
		flexDirection: 'column',
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 12,
	},
	quantityAddIcon: {
		padding: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
	},
	quantityMinusIcon: {
		padding: 8,
	},
	priceContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	deleteProductIcon: {
		marginRight: 12,
	},
	productName: {
		color: '#000',
		fontSize: 16,
		marginBottom: 8,
	},
	productDetails: {
		flex: 1,
		marginRight: 8,
	},
	footer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderTopWidth: 1,
		borderTopColor: '#ddd',
		paddingTop: 8,
		marginTop: 16,
	},
	leftHeaderIcon: {
		marginTop: 5,
		marginLeft: 20,
	},
	headerTitle: {
		textAlign: 'center',
		fontSize: 22,
		color: '#fff',
	},
	checkbox: {
		color: '#fff',
		padding: 0,
	},
	text: {
		fontFamily: 'Lato-Light',
		fontSize: 14,
		color: '#000',
	},
	priceText: {
		fontFamily: 'Lato-Bold',
		color: '#000',
		fontSize: 20,
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
		width: 80,
		height: 80,
		marginRight: 8,
	},
	container: {
		flex: 1,
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
	shadow: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.2,
		shadowRadius: 5,
		elevation: 7,
	},
})
