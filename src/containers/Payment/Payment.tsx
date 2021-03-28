import React, { useEffect } from 'react'
import { NavigationScreenType } from '../../types/navigation'

type Props = {
	navigation: NavigationScreenType
}

const Payment = ({ navigation }: Props) => {
	useEffect(() => {
		// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
		const ids = navigation.getParam('ids', undefined)
		// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
		const amount = navigation.getParam('amount', 0)
	}, [])

	return <></>
}
export default Payment
