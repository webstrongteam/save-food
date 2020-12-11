import React, { Component } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Camera as CameraComponent } from 'expo-camera'
import { Button, Icon } from 'react-native-elements'
import { exitIcon, shadow } from '../../common/styles'
import styles from './Camera.styles'

class Camera extends Component {
	state = {
		buttonTitle: undefined,
		takePhoto: undefined,
	}

	componentDidMount() {
		const { navigation } = this.props

		const buttonTitle = navigation.getParam('buttonTitle', undefined)
		const takePhoto = navigation.getParam('takePhoto', undefined)

		if (buttonTitle && takePhoto) {
			this.setState({ buttonTitle, takePhoto })
		} else {
			navigation.goBack()
		}
	}

	takePicture = async () => {
		if (this.camera) {
			await this.camera.takePictureAsync({
				onPictureSaved: ({ uri }) => {
					this.state.takePhoto(uri)
					this.props.navigation.goBack()
				},
			})
		}
	}

	render() {
		return (
			<CameraComponent
				style={styles.camera}
				ratio='16:9'
				type={CameraComponent.Constants.Type.back}
				ref={(ref) => {
					this.camera = ref
				}}
			>
				<TouchableOpacity style={exitIcon} onPress={() => this.props.navigation.goBack()}>
					<Icon size={30} name='close' type='antdesign' color='#fff' />
				</TouchableOpacity>

				<View style={{ ...styles.takePhotoButtonWrapper, ...shadow }}>
					<Button
						onPress={this.takePicture}
						buttonStyle={styles.takeFoodButton}
						titleStyle={styles.takeFoodButtonTitle}
						title={this.state.buttonTitle}
					/>
				</View>
			</CameraComponent>
		)
	}
}

export default Camera
