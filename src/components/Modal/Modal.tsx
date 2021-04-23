import React, { PropsWithChildren } from 'react'
import { Text, View, Keyboard, TouchableWithoutFeedback, Platform } from 'react-native'
import { Button } from 'react-native-elements'
import ModalBase from 'react-native-modal'
import styles from './Modal.styles'
import { height, STATUS_BAR_HEIGHT, width } from "../../common/utility";

export type ModalButtonType = {
	text: string
	onPress: () => void
}

type Props = PropsWithChildren<{
	toggleModal: () => void
	visible: boolean
	title: string
	buttons?: ModalButtonType[]
	bgColor?: string
	onModalHide?: () => void
}>

const MODAL_WIDTH = width - 64

const Modal = ({ toggleModal, visible, title, onModalHide, buttons = [], children }: Props) => {
	return (
		<ModalBase
			avoidKeyboard
			statusBarTranslucent
			useNativeDriver={Platform.OS === 'android'}
			useNativeDriverForBackdrop={Platform.OS === 'android'}
			isVisible={visible}
			deviceHeight={height + STATUS_BAR_HEIGHT}
			onModalWillHide={Keyboard.dismiss}
			onModalHide={onModalHide}
			onBackButtonPress={() => {
				Keyboard.dismiss()
				toggleModal()
			}}
			onBackdropPress={() => {
				Keyboard.dismiss()
				toggleModal()
			}}
		>
			<View style={styles.contentWrapper}>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<View style={styles.header}>
						<Text style={styles.title}>{title}</Text>
					</View>
				</TouchableWithoutFeedback>

				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<View style={styles.content}>{children}</View>
				</TouchableWithoutFeedback>

				{!!buttons?.length && (
					<View style={styles.buttons}>
						{buttons.map((item) => (
							<Button
								buttonStyle={[styles.button, { width: MODAL_WIDTH / buttons.length }]}
								titleStyle={styles.buttonText}
								key={item.text}
								onPress={item.onPress}
								title={item.text}
							/>
						))}
					</View>
				)}
			</View>
		</ModalBase>
	)
}

export default Modal
