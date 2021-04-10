import React, { PropsWithChildren } from 'react'
import { StatusBar, View } from 'react-native'
import Spinner from '../Spinner/Spinner'
import { useSettingsContext } from '../../common/context/SettingsContext'

type Props = PropsWithChildren<{}>

const Template = ({ children }: Props) => {
	const { useSubscribe } = useSettingsContext()
	const settingsId = useSubscribe((s) => s.settings.id)

	if (settingsId !== 0) {
		return <Spinner size={64} />
	}

	return (
		<View style={{ flex: 1 }}>
			<StatusBar barStyle='light-content' translucent backgroundColor='transparent' />
			{children}
		</View>
	)
}

export default Template
