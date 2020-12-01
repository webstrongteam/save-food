import { Dimensions, Image } from 'react-native'

export const { width } = Dimensions.get('window')

export const replaceComma = (value) => `${value}`.replace(/,/g, '.')

export const getResizeMode = (image, callback) => {
	Image.getSize(image, (width, height) => {
		if (width < height) {
			callback('contain')
		} else {
			callback('cover')
		}
	})
}

export const getQuantitySuffix = (quantitySuffixIndex, translations) => {
	if (quantitySuffixIndex === 0) {
		return translations.gramsSuffix
	}
	if (quantitySuffixIndex === 1) {
		return translations.millilitersSuffix
	}
}
