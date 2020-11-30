import React, { Component } from 'react'
import { View } from 'react-native'
import { Icon } from 'react-native-elements'
import { TextField } from '@ubaids/react-native-material-textfield'
import { validator } from '../../common/validation'
import { replaceComma } from '../../common/utility'
import styles from './Input.styles'

class Input extends Component {
	state = {
		control: {},
	}

	componentDidMount() {
		const { elementConfig, value } = this.props
		this.setState({ control: elementConfig }, () => {
			this.checkValid(value, true)
		})
	}

	componentDidUpdate(prevProps) {
		if (prevProps.value !== this.props.value && this.props.value === null) {
			this.checkValid(null)
		}
	}

	checkValid = (value = this.props.value, initial = false) => {
		const { control } = this.state
		const { changed, translations } = this.props

		let newValue = value
		if (value && control.number) {
			newValue = replaceComma(value)
		}

		if (initial && control.required && (newValue === null || newValue === undefined)) {
			// Initial valid without label
			control.error = true
			changed('', control)
			this.textField.setValue('')
			this.setState({ control })
		} else {
			validator(control, newValue, translations, (newControl) => {
				changed(newValue, newControl)
				this.textField.setValue(newValue)
				this.setState({ control: newControl })
			})
		}
	}

	render() {
		const { control } = this.state
		const { style, focus, value, placeholder, hideClearIcon } = this.props

		return (
			<View style={styles.container}>
				<View style={styles.wrapper}>
					<TextField
						{...control}
						ref={(e) => {
							this.textField = e
						}}
						style={{ ...style }}
						textColor='#5e5e5e'
						baseColor='#5e5e5e'
						tintColor='#4b8b1d'
						lineWidth={2}
						placeholder={placeholder}
						errorColor={control.error === true ? '#5e5e5e' : '#d9534f'}
						autoFocus={focus || false}
						onChangeText={(val) => this.checkValid(val)}
						value={value}
					/>
				</View>
				<View style={styles.clearIconWrapper}>
					{!hideClearIcon && (
						<Icon
							style={styles.clearIcon}
							onPress={() => this.checkValid('')}
							name='clear'
							size={18}
						/>
					)}
				</View>
			</View>
		)
	}
}

export default Input
