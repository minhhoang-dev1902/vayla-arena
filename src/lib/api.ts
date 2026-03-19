import type { InternalAxiosRequestConfig } from "axios";
import { axiosInstance } from "./axios";

interface RequestOptions {
	url: string;
	params?: Record<string, unknown>;
	payload?: Record<string, unknown>;
	toRequest?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
	toResponse?: (data: unknown) => unknown;
}

function buildConfig(options: RequestOptions) {
	return {
		params: options.params,
		toRequest: options.toRequest,
		toResponse: options.toResponse,
	};
}

export const apiService = {
	async get<T>(options: Omit<RequestOptions, "payload">): Promise<T> {
		const { data } = await axiosInstance.get<T>(options.url, buildConfig(options));
		return data;
	},

	async post<T>(options: RequestOptions): Promise<T> {
		const { data } = await axiosInstance.post<T>(
			options.url,
			options.payload,
			buildConfig(options),
		);
		return data;
	},

	async put<T>(options: RequestOptions): Promise<T> {
		const { data } = await axiosInstance.put<T>(options.url, options.payload, buildConfig(options));
		return data;
	},

	async patch<T>(options: RequestOptions): Promise<T> {
		const { data } = await axiosInstance.patch<T>(
			options.url,
			options.payload,
			buildConfig(options),
		);
		return data;
	},

	async delete<T>(options: Omit<RequestOptions, "payload">): Promise<T> {
		const { data } = await axiosInstance.delete<T>(options.url, buildConfig(options));
		return data;
	},
};
