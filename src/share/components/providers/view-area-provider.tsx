"use client";

import * as React from "react";

const ViewAreaContext = React.createContext<HTMLElement | null>(null);

export function useViewArea() {
	return React.useContext(ViewAreaContext);
}

interface ViewAreaProviderProps {
	className?: string;
	children: React.ReactNode;
	style?: React.CSSProperties;
}

export function ViewAreaProvider({ style, children, className }: ViewAreaProviderProps) {
	const [container, setContainer] = React.useState<HTMLElement | null>(null);
	const setRef = React.useCallback((el: HTMLDivElement | null) => {
		setContainer(el);
	}, []);

	return (
		<ViewAreaContext.Provider value={container}>
			<div ref={setRef} style={style} className={className}>
				{children}
			</div>
		</ViewAreaContext.Provider>
	);
}
