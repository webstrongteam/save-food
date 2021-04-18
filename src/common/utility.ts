import { ReactText } from 'react'
import { Dimensions, Image, NativeModules, Platform } from 'react-native'
import { SQLResultSetRowList } from 'expo-sqlite'
import { ResizeMode, WastedFood } from '../types/westedFood'
import { InputsControl } from '../types/common'
import config from '../config/config'

export const { width } = Dimensions.get('window')

export const replaceComma = (value: ReactText): string => `${value}`.replace(/,/g, '.')

export const getResizeMode = (image: string, callback: (type: ResizeMode) => void) => {
	Image.getSize(image, (imageWidth, imageHeight) => {
		if (imageWidth < imageHeight) {
			callback('contain')
		} else {
			callback('cover')
		}
	})
}

export const getQuantitySuffix = (quantitySuffixIndex: number): 'g' | 'ml' =>
	quantitySuffixIndex === 0 ? 'g' : 'ml'

export const getAllResults = <T>(rows: SQLResultSetRowList): T[] => {
	const results = []
	for (let i = 0; i < rows.length; i++) {
		results.push(rows.item(i))
	}
	return results
}

export const getLocale = () => {
	if (Platform.OS === 'web') {
		return { lang: 'en', currency: 'USD' }
	}

	const locale =
		Platform.OS === 'ios'
			? NativeModules.SettingsManager.settings.AppleLocale
			: NativeModules.I18nManager.localeIdentifier
	if (locale === 'pl_PL') {
		return { lang: 'pl', currency: 'PLN' }
	}
	return { lang: 'en', currency: 'USD' }
}

export const getImage = (image?: string): number | { uri: string } =>
	image ? { uri: image } : require('../assets/common/dish.png')

export const prepareData = (data: WastedFood, controls: InputsControl): WastedFood => {
	const preparedData = { ...data } as WastedFood

	;(Object.keys(data) as Array<keyof WastedFood>).forEach((key) => {
		if (preparedData[key] && controls[key]?.number) {
			if (controls[key].precision !== undefined) {
				// @ts-ignore
				preparedData[key] = +(+preparedData[key]!).toFixed(controls[key].precision)
			} else {
				// @ts-ignore
				preparedData[key] = +preparedData[key]!
			}
		}
	})

	return preparedData
}

export const getPrice = (price: number): string => {
	return price > 10000 ? '>10000' : `${price}`
}

export const logConfigStatus = () => {
	/* eslint-disable no-console */
	console.info(`Sentry: ${config.SETUP_SENTRY}`)
	console.info(`Google Analytics: ${config.SETUP_ANALYTICS}`)
	console.info('To change this setup, edit config.ts file.')
}
