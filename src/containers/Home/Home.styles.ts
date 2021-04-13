import { StyleSheet } from 'react-native'
import { whiteColor } from '../../common/colors'

export default StyleSheet.create({
	leftHeaderIcon: {
		marginLeft: 20,
	},
	rightHeaderContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: 20,
	},
	rightHeaderText: {
		fontSize: 16,
		marginLeft: 5,
		color: whiteColor,
	},
	circleOne: {
		height: 200,
		width: 200,
		borderRadius: 100,
		marginBottom: 20,
	},
	circleTwo: {
		height: '80%',
		width: '80%',
		marginLeft: '10%',
		marginTop: '10%',
		borderRadius: 80,
	},
	circleThree: {
		height: '80%',
		width: '80%',
		marginLeft: '10%',
		marginTop: '10%',
		borderRadius: 60,
		justifyContent: 'center',
		alignItems: 'center',
	},
	textScan: {
		fontSize: 25,
	},
	text: {
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 20,
		marginTop: 20,
		marginBottom: 30,
		marginLeft: 50,
		marginRight: 50,
		color: whiteColor,
		fontFamily: 'Lato-Light',
	},
	containerCenter: {
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 10,
	},
	container: {
		height: '100%',
	},
	textWhite: {
		color: whiteColor,
		fontFamily: 'Lato-Bold',
		fontSize: 22,
		textAlign: 'center',
	},
	textBlack: {
		fontSize: 22,
		fontFamily: 'Lato-Light',
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
	},
	infoWindowWrapper: {
		marginBottom: 30,
	},
})
