export interface WastedFood {
	id: number
	name: string
	image?: string
	quantity: number
	price: number
	percentage: number
	paid: number
	productQuantity: number
	quantitySuffixIndex: number
	selected: number
	resizeMode?: ResizeMode
}

export type ResizeMode = 'contain' | 'cover'
