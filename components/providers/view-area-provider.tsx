"use client"

import * as React from "react"

const ViewAreaContext = React.createContext<HTMLElement | null>(null)

export function useViewArea() {
	return React.useContext(ViewAreaContext)
}

interface ViewAreaProviderProps {
	children: React.ReactNode
	className?: string
}

/**
 * Bọc view area (vùng nội dung có max-width, căn giữa).
 * Cung cấp container cho Sheet/Dialog để overlay và panel chỉ nằm trong view area.
 */
export function ViewAreaProvider({ children, className }: ViewAreaProviderProps) {
	const [container, setContainer] = React.useState<HTMLElement | null>(null)
	const setRef = React.useCallback((el: HTMLDivElement | null) => {
		setContainer(el)
	}, [])

	return (
		<ViewAreaContext.Provider value={container}>
			<div ref={setRef} className={className}>
				{children}
			</div>
		</ViewAreaContext.Provider>
	)
}
