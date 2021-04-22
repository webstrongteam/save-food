export interface Settings {
	id?: number
	lang: Language
	currency: Currency
	notification_cycle?: number
	email: string
	version: string
}

export type Currency = 'PLN' | 'USD'
export type Language = 'pl' | 'en'

export type Translation = Record<string, string>
export type Translations = {
	Start: Record<string, string>
	Settings: Record<string, string>
	Payment: Record<string, string>
	Home: Record<string, string>
	FoodList: Record<string, string>
	Food: Record<string, string>
	common: Record<string, string>
}
