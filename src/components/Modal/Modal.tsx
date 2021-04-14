import React, { PropsWithChildren, useEffect } from 'react'
import { BackHandler, Dimensions, Keyboard } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import ModalBase, {
	ModalButton,
	ModalContent,
	ModalFooter,
	ModalTitle,
	SlideAnimation,
} from 'react-native-modals'

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
}>

const Modal = ({ toggleModal, visible, title, buttons = [], children }: Props) => {
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

	if (!visible) {
		return <></>
	}

	return (
		<ModalBase
			width={Dimensions.get('window').width - 50}
			visible={visible}
			onSwipeOut={toggleModal}
			onTouchOutside={toggleModal}
			modalAnimation={
				new SlideAnimation({
					slideFrom: 'bottom',
				})
			}
			modalTitle={
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<ModalTitle title={title} />
				</TouchableWithoutFeedback>
			}
			footer={
				<ModalFooter>
					{buttons.map((item) => (
						<ModalButton key={item.text} text={item.text} onPress={item.onPress} />
					))}
				</ModalFooter>
			}
		>
			<ModalContent>{children}</ModalContent>
		</ModalBase>
	)
}

export default Modal
