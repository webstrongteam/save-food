import { StyleSheet } from 'react-native'
import { blackColor, darkColor, grayColor, primaryColor, whiteColor } from '../../common/colors'
import { width } from '../../common/utility'

export default StyleSheet.create({
	headerTitle: {
		textAlign: 'center',
		fontSize: 22,
		color: whiteColor,
	},
	openScannerIcon: {
		marginRight: 20,
	},
	deleteProductDescription: {
		fontFamily: 'Lato-Light',
		marginTop: 22,
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 16,
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
		fontFamily: 'Lato-Bold',
		color: blackColor,
		fontSize: 16,
		marginBottom: 8,
	},
	text: {
		fontSize: 14,
		color: blackColor,
	},
	rightElement: {
		flexDirection: 'column',
		borderWidth: 1,
		borderColor: grayColor,
		borderRadius: 12,
	},
	quantityAddIcon: {
		padding: 8,
		borderBottomWidth: 1,
		borderBottomColor: grayColor,
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
		borderTopColor: grayColor,
		paddingTop: 8,
		marginTop: 16,
	},
	priceContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	checkbox: {
		color: whiteColor,
		padding: 0,
	},
	priceWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		flexWrap: 'wrap',
		maxWidth: width * 0.6,
	},
	priceText: {
		fontFamily: 'Lato-Bold',
		color: blackColor,
		fontSize: 20,
		marginRight: 8,
	},
	quantityText: {
		fontSize: 14,
		color: darkColor,
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
		color: whiteColor,
		fontSize: 18,
		paddingTop: 4,
		paddingBottom: 4,
		paddingRight: 12,
		paddingLeft: 12,
		maxWidth: width * 0.75,
		fontFamily: 'Lato-Light',
	},
})
