/* eslint-disable no-console */
import { useEffect, DependencyList } from 'react'

const useAsyncEffect = (
	asyncFunction: () => Promise<void | (() => void)>,
	deps?: DependencyList,
) => {
	useEffect(() => {
		let shouldClear = false
		let clearCallback: void | (() => void)

		const maybeClear = () => {
			if (clearCallback && shouldClear) {
				clearCallback()
			}
		}

		Promise.resolve(asyncFunction())
			.then((clear) => {
				clearCallback = clear
				maybeClear()
			})
			.catch((error: any) => {
				console.error('useAsyncEffect', error)
			})

		return () => {
			shouldClear = true
			maybeClear()
		}
	}, deps)
}

export default useAsyncEffect
