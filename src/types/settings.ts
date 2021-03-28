export interface Settings {
	id?: number
	lang: Language
	currency: Currency
	notification_cycle?: number
	email: string
	version: string
}

export type Currency = 'PLN' | 'USD'
export type Translations = Record<string, string>
export type Language = 'pl' | 'en'
