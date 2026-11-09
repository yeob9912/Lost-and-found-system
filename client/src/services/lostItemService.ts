const API_URL = "http://localhost:5000/api";
const BASE_URL = `${API_URL}/lost-items`;

// Lost item status
export type LostItemStatus = "lost" | "found" | "claimed";

// Lost item interface
export interface LostItem {
    _id: string;
    name: string;
    category: string;
    brand?: string;
    color?: string;
    location: string;
    date: string;
    description: string;
    image: string;
    imagePublicId: string;
    status: LostItemStatus;
    reportedBy:
        | string
        | {
            _id: string;
            fullName?: string;
            email?: string;
        };
    createdAt: string;
    updatedAt: string;
}

// Data required to report a lost item
export interface CreateLostItemData {
    name: string;
    category: string;
    brand?: string;
    color?: string;
    location: string;
    date: string;
    description: string;
    image?: File | Blob | string;
}

// Data for updating an item
export interface UpdateLostItemData {
    name?: string;
    category?: string;
    brand?: string;
    color?: string;
    location?: string;
    date?: string;
    description?: string;
    status?: LostItemStatus;
    image?: File | Blob | string;
}

// Search and filter parameters
export interface LostItemQuery {
    search?: string;
    category?: string;
    status?: LostItemStatus;
    location?: string;
    page?: number;
    limit?: number;
}

// Standard API response
interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

// Pagination response
export interface LostItemsResponse {
    success: boolean;
    count: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    data: LostItem[];
}

// Get authentication token
const getToken = (): string | null => {
    return (
        sessionStorage.getItem("token") ||
        sessionStorage.getItem("findback_token") ||
        localStorage.getItem("token")
    );
};

// Common request headers
const getHeaders = (): HeadersInit => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Handle API errors
const handleResponse = async <T>(response: Response): Promise<T> => {
    const result = await response.json().catch(() => ({
        message: "Unable to process server response",
    }));

    if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
    }

    return result as T;
};

// Convert lost item data to FormData
const createFormData = (
    data: CreateLostItemData | UpdateLostItemData
): FormData => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            formData.append(key, value as any);
        }
    });

    return formData;
};

// 1. CREATE LOST ITEM
export const createLostItem = async (
    data: CreateLostItemData
): Promise<LostItem> => {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: getHeaders(),
        body: createFormData(data),
    });

    const result = await handleResponse<ApiResponse<LostItem>>(response);
    return result.data;
};

// 2. GET ALL LOST ITEMS WITH SEARCH AND FILTER
export const getLostItems = async (
    filters: LostItemQuery = {}
): Promise<LostItemsResponse> => {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            queryParams.append(key, String(value));
        }
    });

    const queryString = queryParams.toString();

    const response = await fetch(
        `${BASE_URL}${queryString ? `?${queryString}` : ""}`,
        {
            method: "GET",
            headers: getHeaders(),
        }
    );

    return handleResponse<LostItemsResponse>(response);
};

// 3. GET SINGLE LOST ITEM
export const getLostItemById = async (id: string): Promise<LostItem> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "GET",
        headers: getHeaders(),
    });

    const result = await handleResponse<ApiResponse<LostItem>>(response);
    return result.data;
};

// 4. GET MY REPORTED LOST ITEMS
export const getMyLostItems = async (): Promise<LostItem[]> => {
    const response = await fetch(`${BASE_URL}/my-items`, {
        method: "GET",
        headers: getHeaders(),
    });

    const result = await handleResponse<ApiResponse<LostItem[]>>(response);
    return result.data;
};

// 5. UPDATE LOST ITEM
export const updateLostItem = async (
    id: string,
    data: UpdateLostItemData
): Promise<LostItem> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: createFormData(data),
    });

    const result = await handleResponse<ApiResponse<LostItem>>(response);
    return result.data;
};

// 6. DELETE LOST ITEM
export const deleteLostItem = async (id: string): Promise<string> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
    });

    const result = await handleResponse<{ success: boolean; message: string }>(
        response
    );
    return result.message;
};
