import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Icon as IconBase, IconProps } from 'react-native-elements'
import styles from './Icon.styles'

type Variant = 'backIcon' | 'exitIcon'

type Props = {
	variant?: Variant
	onPress?: () => void
	name?: string
} & Omit<IconProps, 'name'>

const Icon = ({
	onPress,
	variant,
	size = 28,
	color = '#fff',
	name = 'arrowleft',
	...props
}: Props) => {
	if (variant === 'backIcon') {
		return (
			<TouchableOpacity onPress={onPress}>
				<IconBase
					{...props}
					style={styles.backIcon}
					size={size}
					name='arrowleft'
					type='antdesign'
					color={color}
				/>
			</TouchableOpacity>
		)
	}

	if (variant === 'exitIcon') {
		return (
			<TouchableOpacity containerStyle={styles.exitIcon} onPress={onPress}>
				<IconBase {...props} size={size} name='close' type='antdesign' color={color} />
			</TouchableOpacity>
		)
	}

	return (
		<TouchableOpacity onPress={onPress}>
			<IconBase {...props} size={size} name={name} color={color} />
		</TouchableOpacity>
	)
}

export default Icon
