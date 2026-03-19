export function createQueryKey<T extends Record<string, unknown>>(endpoint: string, data?: T) {
	return data ? ([endpoint, data] as const) : ([endpoint] as const);
}
