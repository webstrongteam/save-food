import { Dimensions, StyleSheet } from 'react-native'

const heightWindow = Dimensions.get('window').height

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
		marginLeft: 5,
		color: '#fff',
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
		color: '#fff',
		fontFamily: 'Lato-Light',
	},
	containerCenter: {
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 10,
	},
	container: {
		height: heightWindow,
	},
	textWhite: {
		color: '#fff',
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
	infoWindowWrapper: {
		marginBottom: 30,
	},
})
