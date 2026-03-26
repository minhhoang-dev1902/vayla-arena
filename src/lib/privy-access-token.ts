type PrivyTokenGetter = () => Promise<string | undefined>;

let getPrivyAccessTokenFromSdk: PrivyTokenGetter | null = null;

/** Called from PrivyTokenSync so axios can await a fresh JWT when localStorage is empty. */
export function setPrivyAccessTokenGetter(fn: PrivyTokenGetter | null): void {
	getPrivyAccessTokenFromSdk = fn;
}

export async function fetchPrivyAccessTokenForApi(): Promise<string | null> {
	if (!getPrivyAccessTokenFromSdk) return null;
	try {
		const t = await getPrivyAccessTokenFromSdk();
		return t ?? null;
	} catch {
		return null;
	}
}
