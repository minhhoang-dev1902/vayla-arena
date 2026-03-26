import { apiService } from "@/lib/api";

// ─── Types ──────────────────────────────────────────────────────────

export interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	imageUrl?: string;
	category: string;
	createdAt: string;
}

export interface GetProductListParams {
	page?: number;
	limit?: number;
	category?: string;
	search?: string;
}

export interface ProductListResponse {
	items: Product[];
	total: number;
	page: number;
	limit: number;
}

export interface CreateProductPayload {
	name: string;
	description: string;
	price: number;
	category: string;
	imageUrl?: string;
}

export interface UpdateProductPayload {
	name?: string;
	description?: string;
	price?: number;
	category?: string;
	imageUrl?: string;
}

// ─── API Executors ──────────────────────────────────────────────────

export const getProductListApi = (params: GetProductListParams): Promise<ProductListResponse> =>
	apiService.get({ url: "/products", params: params as Record<string, unknown> });

export const getProductDetailApi = (id: string): Promise<Product> =>
	apiService.get({ url: `/products/${id}` });

export const createProductApi = (payload: CreateProductPayload): Promise<Product> =>
	apiService.post({
		url: "/products",
		payload,
	});

export const updateProductApi = (id: string, payload: UpdateProductPayload): Promise<Product> =>
	apiService.put({
		url: `/products/${id}`,
		payload,
	});

export const deleteProductApi = (id: string): Promise<void> =>
	apiService.delete({ url: `/products/${id}` });
