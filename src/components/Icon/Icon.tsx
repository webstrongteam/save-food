import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Icon as IconBase, IconProps } from 'react-native-elements'
import styles from './Icon.styles'
import { whiteColor } from '../../common/colors'

type Props = {
	variant?: Variant
	onPress?: () => void
	name?: string
} & Omit<IconProps, 'name'>

type Variant = 'backIcon' | 'exitIcon'

const Icon = ({
	onPress,
	variant,
	size = 28,
	color = whiteColor,
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
			<TouchableOpacity style={styles.exitIcon} onPress={onPress}>
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
