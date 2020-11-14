import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-elements'
import styles from './ButtonAdd.styles'

const ButtonAdd = ({ color = '#fff', onPressMinus, onPressAdd, value }) => (
	<View style={{ borderColor: color, ...styles.container }}>
		<TouchableOpacity onPress={onPressMinus} style={styles.button}>
			<Icon size={25} name='minus' type='entypo' color={color} />
		</TouchableOpacity>
		<View
			style={{
				borderColor: color,
				...styles.contentWrapper,
			}}
		>
			<Text
				style={{
					color: color,
					...styles.contentText,
				}}
			>
				{value}
			</Text>
		</View>
		<TouchableOpacity onPress={onPressAdd} style={styles.button}>
			<Icon size={25} name='add' type='material' color={color} />
		</TouchableOpacity>
	</View>
)

export default ButtonAdd
