import { StyleSheet } from 'react-native'
import { primaryColor } from '../../common/utility'

export default StyleSheet.create({
	headerTitle: {
		textAlign: 'center',
		fontSize: 22,
		color: '#fff',
	},
	openScannerIcon: {
		marginRight: 20,
	},
	deleteProductDescription: {
		marginTop: 15,
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 16,
		fontFamily: 'Lato-Light',
	},
	container: {
		flex: 1,
	},
	listItemContainer: {
		marginRight: 20,
		marginLeft: 20,
		marginTop: 20,
	},
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
	leftElement: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	image: {
		width: 80,
		height: 80,
		resizeMode: 'cover',
		borderRadius: 100,
		borderWidth: 2,
		borderColor: primaryColor,
		marginRight: 12,
	},
	productDetails: {
		flex: 1,
		marginRight: 8,
	},
	productName: {
		color: '#000',
		fontSize: 16,
		marginBottom: 8,
	},
	text: {
		fontFamily: 'Lato-Light',
		fontSize: 14,
		color: '#000',
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
	itemListFooter: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderTopWidth: 1,
		borderTopColor: '#ddd',
		paddingTop: 8,
		marginTop: 16,
	},
	priceContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	checkbox: {
		color: '#fff',
		padding: 0,
	},
	priceWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	priceText: {
		fontFamily: 'Lato-Bold',
		color: '#000',
		fontSize: 20,
	},
	quantityText: {
		marginLeft: 8,
		fontSize: 14,
		fontFamily: 'Lato-Light',
		color: '#a4a4a4',
	},
	deleteProductIcon: {
		marginRight: 12,
	},
	listFooter: {
		marginBottom: 90,
	},
	paymentButtonContainer: {
		position: 'absolute',
		width: '100%',
		bottom: 0,
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
