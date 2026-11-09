
const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const BASE_URL = `${API_URL}/lost-items`;

export type LostItemStatus =
    | "lost"
    | "match_found"
    | "returned";

export type ApprovalStatus =
    | "pending"
    | "approved"
    | "rejected";

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
    approvalStatus: ApprovalStatus;

    rejectionReason?: string;

    reportedBy:
    | string
    | {
        _id: string;
        name: string;
        email: string;
    };

    reviewedBy?: string;
    reviewedAt?: string;

    returnedTo?: string;
    returnedBy?: string;
    returnedAt?: string;
    returnNotes?: string;

    createdAt: string;
    updatedAt: string;
}

export interface CreateLostItemData {
    name: string;
    category: string;
    brand?: string;
    color?: string;
    location: string;
    date: string;
    description: string;
    image: File;
}

export interface UpdateLostItemData {
    name?: string;
    category?: string;
    brand?: string;
    color?: string;
    location?: string;
    date?: string;
    description?: string;
    image?: File;
}

export interface LostItemFilters {
    search?: string;
    category?: string;
    status?: LostItemStatus;
    location?: string;
    page?: number;
    limit?: number;
}

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export interface PaginatedLostItems {
    success: boolean;
    count: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    data: LostItem[];
}

// Get authentication token
const getToken = (): string | null => {
    return localStorage.getItem("token");
};

// Request headers
const getHeaders = (): HeadersInit => {
    const token = getToken();

    return token
        ? { Authorization: `Bearer ${token}` }
        : {};
};

// Handle API response
const handleResponse = async <T>(
    response: Response
): Promise<T> => {
    const result = await response.json().catch(() => ({
        message: "Unable to process server response",
    }));

    if (!response.ok) {
        throw new Error(
            result.message || "Request failed"
        );
    }

    return result as T;
};

// Create FormData for image upload
const createFormData = (
    data: CreateLostItemData | UpdateLostItemData
): FormData => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            formData.append(key, value);
        }
    });

    return formData;
};

// 1. SUBMIT LOST ITEM REPORT
export const createLostItem = async (
    data: CreateLostItemData
): Promise<LostItem> => {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: getHeaders(),
        body: createFormData(data),
    });

    const result =
        await handleResponse<ApiResponse<LostItem>>(response);

    return result.data;
};

// 2. GET APPROVED PUBLIC LOST ITEMS
export const getLostItems = async (
    filters: LostItemFilters = {}
): Promise<PaginatedLostItems> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            params.append(key, String(value));
        }
    });

    const query = params.toString();

    const response = await fetch(
        `${BASE_URL}${query ? `?${query}` : ""}`,
        {
            method: "GET",
            headers: getHeaders(),
        }
    );

    return handleResponse<PaginatedLostItems>(response);
};

// 3. GET SINGLE PUBLIC LOST ITEM
export const getLostItemById = async (
    id: string
): Promise<LostItem> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "GET",
        headers: getHeaders(),
    });

    const result =
        await handleResponse<ApiResponse<LostItem>>(response);

    return result.data;
};

// 4. GET MY LOST ITEM REPORTS
export const getMyLostItems = async (): Promise<LostItem[]> => {
    const response = await fetch(`${BASE_URL}/my-items`, {
        method: "GET",
        headers: getHeaders(),
    });

    const result =
        await handleResponse<ApiResponse<LostItem[]>>(response);

    return result.data;
};

// 5. UPDATE MY LOST ITEM REPORT
export const updateLostItem = async (
    id: string,
    data: UpdateLostItemData
): Promise<LostItem> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: createFormData(data),
    });

    const result =
        await handleResponse<ApiResponse<LostItem>>(response);

    return result.data;
};

// 6. DELETE MY LOST ITEM REPORT
export const deleteLostItem = async (
    id: string
): Promise<string> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
    });

    const result =
        await handleResponse<{ success: boolean; message: string }>(
            response
        );

    return result.message;
};

// 7. ADMIN: GET ALL REPORTS
export const getAllLostItemReports = async (
    approvalStatus?: ApprovalStatus,
    page = 1,
    limit = 20
): Promise<PaginatedLostItems> => {
    const params = new URLSearchParams();

    if (approvalStatus) {
        params.append("approvalStatus", approvalStatus);
    }

    params.append("page", String(page));
    params.append("limit", String(limit));

    const response = await fetch(
        `${BASE_URL}/admin/reports?${params.toString()}`,
        {
            method: "GET",
            headers: getHeaders(),
        }
    );

    return handleResponse<PaginatedLostItems>(response);
};

// 8. ADMIN: APPROVE REPORT
export const approveLostItem = async (
    id: string
): Promise<LostItem> => {
    const response = await fetch(
        `${BASE_URL}/admin/${id}/approve`,
        {
            method: "PATCH",
            headers: getHeaders(),
        }
    );

    const result =
        await handleResponse<ApiResponse<LostItem>>(response);

    return result.data;
};

// 9. ADMIN: REJECT REPORT
export const rejectLostItem = async (
    id: string,
    reason: string
): Promise<LostItem> => {
    const response = await fetch(
        `${BASE_URL}/admin/${id}/reject`,
        {
            method: "PATCH",
            headers: {
                ...getHeaders(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ reason }),
        }
    );

    const result =
        await handleResponse<ApiResponse<LostItem>>(response);

    return result.data;
};

// 10. ADMIN: CONFIRM ITEM RETURN
export const confirmLostItemReturn = async (
    id: string,
    returnedTo: string,
    returnNotes?: string
): Promise<LostItem> => {
    const response = await fetch(
        `${BASE_URL}/admin/${id}/confirm-return`,
        {
            method: "PATCH",
            headers: {
                ...getHeaders(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                returnedTo,
                returnNotes,
            }),
        }
    );

    const result =
        await handleResponse<ApiResponse<LostItem>>(response);

    return result.data;
};
