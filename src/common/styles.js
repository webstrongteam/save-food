import { Platform } from 'react-native'

const os = Platform.OS

export const exitIcon = {
	position: 'absolute',
	top: os === 'ios' ? 40 : 50,
	left: 20,
	zIndex: 20,
}

export const shadow = {
	shadowColor: '#000',
	shadowOffset: {
		width: 0,
		height: 0,
	},
	shadowOpacity: 0.3,
	shadowRadius: 5,
	elevation: 7,
}
