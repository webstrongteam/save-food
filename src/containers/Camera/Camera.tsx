import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { Camera as CameraComponent } from 'expo-camera'
import { Button } from 'react-native-elements'
import { shadow } from '../../common/styles'
import { NavigationScreenType } from '../../types/navigation'
import styles from './Camera.styles'
import Icon from '../../components/Icon/Icon'

type Props = {
	navigation: NavigationScreenType
}

const Camera = ({ navigation }: Props) => {
	const cameraRef = useRef<any>()

	const [buttonTitle, setButtonTitle] = useState<string>()

	const takePhotoHandler = async () => {
		const takePhoto = navigation.getParam('takePhoto', undefined)

		if (cameraRef.current && takePhoto) {
			await cameraRef.current.takePictureAsync({
				onPictureSaved: ({ uri }: { uri: string }) => {
					takePhoto(uri)
					navigation.goBack()
				},
			})
		}
	}

	useEffect(() => {
		const buttonTitle = navigation.getParam('buttonTitle', undefined)

		if (buttonTitle) {
			setButtonTitle(buttonTitle)
		} else {
			navigation.goBack()
		}
	}, [])

	return (
		<CameraComponent
			style={styles.camera}
			ratio='16:9'
			type={CameraComponent.Constants.Type.back}
			ref={cameraRef}
		>
			<Icon onPress={() => navigation.goBack()} variant='exitIcon' />

			<View style={{ ...styles.takePhotoButtonWrapper, ...shadow }}>
				<Button
					onPress={takePhotoHandler}
					buttonStyle={styles.takeFoodButton}
					titleStyle={styles.takeFoodButtonTitle}
					title={buttonTitle}
				/>
			</View>
		</CameraComponent>
	)
}

export default Camera
