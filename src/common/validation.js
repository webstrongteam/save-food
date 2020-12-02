import { replaceComma } from './utility'

export const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const validator = (control, value, translations, callback) => {
	let validStatus = true

	const isNumber = +replaceComma(value) === parseInt(replaceComma(value), 10)
	const isFloat =
		Number(+replaceComma(value)) === +replaceComma(value) && +replaceComma(value) % 1 !== 0

	if (value === undefined || value === null) {
		// Set initial error
		control.error = true
	} else {
		// Validation system
		if (control.characterRestriction) {
			if (value.length > control.characterRestriction) {
				control.error = translations.tooLongError
				validStatus = false
			}
		}

		if (control.email) {
			if (!emailRegEx.test(String(value).toLowerCase())) {
				control.error = translations.emailError
				validStatus = false
			}
		}

		if (control.number) {
			if (!isFloat && !isNumber) {
				control.error = translations.numberError
				validStatus = false
			} else if (control.positiveNumber) {
				if (+value <= 0) {
					control.error = translations.greaterThanZeroError
					validStatus = false
				}
			}
		}

		if (control.required) {
			if (`${value}`.trim() === '') {
				control.error = translations.requiredError
				validStatus = false
			}
		}

		if (validStatus && control.error) {
			delete control.error
		}
	}

	callback(control)
}

export const checkValid = (control, value) =>
	!!(!control.error && value && `${value}`.trim() !== '')
