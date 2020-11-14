import { StyleSheet } from 'react-native'

export default StyleSheet.create({
	container: {
		width: '100%',
		marginTop: 15,
		justifyContent: 'center',
		alignItems: 'center',
	},
	wrapper: {
		width: '90%',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.3,
		shadowRadius: 5,
		elevation: 7,
	},
	titleWrapper: {
		flex: 5,
	},
	title: {
		fontFamily: 'Lato-Light',
		fontSize: 20,
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
	},
	valueWrapper: {
		borderBottomLeftRadius: 30,
		borderTopLeftRadius: 30,
		overflow: 'hidden',
		flex: 5,
	},
	gradient: {
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	value: {
		color: '#fff',
		marginLeft: 5,
		fontSize: 16,
		textAlign: 'center',
		fontFamily: 'Lato-Bold',
	},
})
