import React, {
	createContext,
	PropsWithChildren,
	RefObject,
	useContext,
	useEffect,
	useMemo,
	useReducer,
	useRef,
} from 'react'

interface Subscription<I, T> {
	getter: (store: I) => T
	callback: () => void
	lastValue: T
}

interface CommonState<I> {
	storeRef: RefObject<I>
	useSubscribe: <T extends any>(getter: (store: I) => T) => T
}

export const createStateContext = <I, A>(
	storeInitialState: I,
	actions: (setStore: (callback: (store: I) => I) => void) => A,
) => {
	const Context = createContext<CommonState<I> & A>({} as any)

	return {
		Provider: ({ children }: PropsWithChildren<{}>) => {
			const store = useRef(storeInitialState)
			const subscriptions = useRef<Set<Subscription<I, any>>>(new Set())

			const setStore = (callback: (store: I) => I) => {
				store.current = callback(store.current)
				subscriptions.current.forEach((sub) => {
					const newValue = sub.getter(store.current)
					if (!Object.is(newValue, sub.lastValue)) {
						sub.lastValue = newValue
						sub.callback()
					}
				})
			}

			const contextValue = useMemo<CommonState<I> & A>(
				() => ({
					useSubscribe<T extends any>(getter: (store: I) => T): T {
						const [, forceRender] = useReducer((s: number) => s + 1, 0)
						const subscription = useRef<Subscription<I, T>>({
							getter,
							callback: forceRender,
							lastValue: getter(store.current),
						})

						useEffect(() => {
							const { current } = subscription

							subscriptions.current.add(current)

							return () => {
								subscriptions.current.delete(current)
							}
						}, [])

						return subscription.current.lastValue
					},
					storeRef: store,
					...actions(setStore),
				}),
				[],
			)

			return <Context.Provider value={contextValue}>{children}</Context.Provider>
		},
		useContext: () => useContext(Context),
	}
}
