import React, { useEffect } from 'react'
import { BackHandler, Dimensions, Keyboard } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import Modal, { ModalButton, ModalContent, ModalFooter, ModalTitle } from 'react-native-modals'

const modal = ({ toggleModal, visible, title, buttons = [], bgColor = '#fff', content }) => {
	const backAction = () => {
		if (visible) {
			toggleModal()
			return true
		}
		return false
	}

	useEffect(() => {
		BackHandler.addEventListener('hardwareBackPress', backAction)

		return () => {
			BackHandler.removeEventListener('hardwareBackPress', backAction)
		}
	}, [visible])

	return (
		<Modal
			width={Dimensions.get('window').width - 50}
			visible={visible}
			onSwipeOut={toggleModal}
			onTouchOutside={toggleModal}
			modalStyle={{ backgroundColor: bgColor }}
			modalTitle={
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<ModalTitle title={title} />
				</TouchableWithoutFeedback>
			}
			footer={
				<ModalFooter>
					{buttons.map((item, i) => (
						<ModalButton key={i} text={item.text} onPress={item.onPress} />
					))}
				</ModalFooter>
			}
		>
			<ModalContent>{content}</ModalContent>
		</Modal>
	)
}

export default modal
