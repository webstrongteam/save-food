import React, { PropsWithChildren, useEffect } from 'react'
import { createStateContext } from '../createStateContext'
import { Language, Settings, Translations } from '../../types/settings'
import { getSettings } from '../../../database/actions/settings'
import useAsyncEffect from '../hooks/useAsyncEffect'
import { VERSION } from '../../../database/db'

import en from '../../translations/en/en.json'
import pl from '../../translations/pl/pl.json'

export type SettingsState = {
	translations: Translations
	settings: Settings
}

const settingsInitialState: SettingsState = {
	translations: en,
	settings: {
		lang: 'en',
		email: '',
		currency: 'USD',
		version: VERSION,
	},
}

const SettingsContext = createStateContext(settingsInitialState, (setStore) => ({
	setSettings(settings: Settings) {
		setStore((store) => ({ ...store, settings }))
	},
	setTranslations(translations: Translations) {
		setStore((store) => ({ ...store, translations }))
	},
}))

const SettingsHandler = () => {
	const { setSettings, setTranslations, useSubscribe } = useSettingsContext()
	const contextSettings = useSubscribe((s) => s.settings)

	const fetchSettings = async () => {
		const settings: Settings = await getSettings()

		setSettings(settings)
		updateLanguage(settings.lang)
	}

	const updateLanguage = (lang: Language) => {
		setTranslations(lang === 'pl' ? pl : en)
	}

	useAsyncEffect(async () => {
		await fetchSettings()
	}, [])

	useEffect(() => {
		if (contextSettings?.lang) {
			updateLanguage(contextSettings.lang)
		}
	}, [contextSettings?.lang])

	return <></>
}

export const SettingsContextProvider = ({ children }: PropsWithChildren<{}>) => (
	<SettingsContext.Provider>
		<SettingsHandler />
		{children}
	</SettingsContext.Provider>
)

export const useSettingsContext = SettingsContext.useContext
