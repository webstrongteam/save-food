import { TextInputProps } from 'react-native'
import { ReactText } from 'react'

export type InputControl = {
	label?: string
	required?: boolean
	characterRestriction?: number
	number?: boolean
	positiveNumber?: boolean
	precision?: number
	error?: boolean | string
	email?: boolean
} & TextInputProps

export type InputValue = ReactText | null

export type InputsControl = Record<string, InputControl>
