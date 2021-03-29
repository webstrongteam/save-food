import React, { ReactText, useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { Icon } from 'react-native-elements'
// @ts-ignore
import { TextField } from '@ubaids/react-native-material-textfield'
import { validator } from '../../common/validation'
import { primaryColor, replaceComma } from '../../common/utility'
import { InputControl, InputValue } from '../../types/common'
import { Translations } from '../../types/settings'
import { ViewType } from '../../types/styles'
import styles from './Input.styles'

type Props = {
	inputConfig: InputControl
	value?: InputValue
	changed: (value: ReactText, control: InputControl) => void
	translations: Translations
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
					textColor='#5e5e5e'
					baseColor='#5e5e5e'
					tintColor={primaryColor}
					lineWidth={2}
					placeholder={placeholder}
					errorColor={error === true ? '#5e5e5e' : '#d9534f'}
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
