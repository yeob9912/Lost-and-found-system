const API_URL = "http://localhost:5000/api/auth";

export interface AuthUser {
    id: string;
    fullName: string;
    studentId: string;
    email: string;
    role: "student" | "admin";
}

interface AuthResponse {
    message: string;
    token: string;
    user: AuthUser;
}

export interface RegisterData {
    fullName: string;
    studentId: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeTerms: boolean;
}

export interface LoginData {
    email: string;
    password: string;
}

const saveAuthentication = (data: AuthResponse) => {
    sessionStorage.setItem("findback_token", data.token);
    sessionStorage.setItem("findback_user", JSON.stringify(data.user));
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("user", JSON.stringify(data.user));
};

export const registerUser = async (
    formData: RegisterData
): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    const data: AuthResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
    }

    saveAuthentication(data);

    return data;
};

export const loginUser = async (
    formData: LoginData
): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    const data: AuthResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Login failed.");
    }

    saveAuthentication(data);

    return data;
};

export const getToken = (): string | null => {
    return sessionStorage.getItem("findback_token");
};

export const getCurrentUser = (): AuthUser | null => {
    const user = sessionStorage.getItem("findback_user") || sessionStorage.getItem("user");

    return user ? JSON.parse(user) as AuthUser : null;
};

export const logoutUser = (): void => {
    sessionStorage.removeItem("findback_token");
    sessionStorage.removeItem("findback_user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
};

