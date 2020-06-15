import React from 'react';
import {Dimensions} from 'react-native';
import Modal, {ModalButton, ModalContent, ModalFooter, ModalTitle} from 'react-native-modals';

const modal = ({toggleModal, visible, title, buttons = [], bgColor = '#fff', content}) => {
    return (
        <Modal
            width={Dimensions.get('window').width - 50}
            visible={visible}
            swipeDirection={['up', 'down', 'left', 'right']} // can be string or an array
            swipeThreshold={200} // default 100
            onSwipeOut={toggleModal}
            onTouchOutside={toggleModal}
            modalStyle={{backgroundColor: bgColor}}
            modalTitle={<ModalTitle title={title}/>}
            footer={
                <ModalFooter>
                    {buttons.map((item, i) => (
                        <ModalButton
                            key={i}
                            text={item.text}
                            onPress={item.onPress}
                        />
                    ))}
                </ModalFooter>
            }
        >
            <ModalContent>
                {content}
            </ModalContent>
        </Modal>
    )
};

export default modal;