import React, { ReactText, useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { Icon } from 'react-native-elements'
import { TextField } from 'react-native-material-textfield'
import { validator } from '../../common/validation'
import { replaceComma } from '../../common/utility'
import { InputControl, InputValue } from '../../types/common'
import { Translation } from '../../types/settings'
import { ViewType } from '../../types/styles'
import styles from './Input.styles'
import { redColor, primaryColor, darkColor } from '../../common/colors'

type Props = {
	inputConfig: InputControl
	value?: InputValue
	changed: (value: ReactText, control: InputControl) => void
	translations: Translation
	hideClearIcon?: boolean
	placeholder?: string
	style?: ViewType
	focus?: boolean
}

const Input = ({
	inputConfig,
	value,
	changed,
	translations,
	hideClearIcon,
	placeholder,
	style,
	focus = true,
}: Props) => {
	const textField = useRef<TextField>(null)
	const [error, setError] = useState<string | boolean | undefined>(inputConfig.error)

	const checkValidation = (value?: InputValue, initial = false) => {
		let newValue = value
		if (value && inputConfig.number) {
			newValue = replaceComma(value)
		}

		if (initial && inputConfig.required && !newValue) {
			// Initial valid without label
			changed('', { ...inputConfig, error: true })
			textField.current?.setValue('')
			setError(true)
		} else {
			const newControl = validator(inputConfig, newValue!, translations)
			changed(newValue!, newControl)
			textField.current?.setValue(`${newValue}`)
			setError(newControl.error)
		}
	}

	useEffect(() => {
		checkValidation(value, true)
	}, [])

	return (
		<View style={styles.container}>
			<View style={styles.wrapper}>
				<TextField
					{...inputConfig}
					error={typeof error === 'boolean' ? '' : error}
					ref={textField}
					style={style}
					textColor={darkColor}
					baseColor={darkColor}
					tintColor={primaryColor}
					lineWidth={2}
					placeholder={placeholder}
					errorColor={error === true ? darkColor : redColor}
					autoFocus={focus}
					onChangeText={(value: InputValue) => checkValidation(value)}
					value={`${value}`}
				/>
			</View>
			<View style={styles.clearIconWrapper}>
				{!hideClearIcon && (
					<Icon
						style={styles.clearIcon}
						onPress={() => checkValidation('')}
						name='clear'
						size={18}
					/>
				)}
			</View>
		</View>
	)
}

export default Input
