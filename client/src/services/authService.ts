const API_URL = "http://localhost:5000/api/auth";

export interface AuthUser {
    id: string;
    fullName: string;
    studentId: string;
    email: string;
    role: "student" | "admin";
    profileImage?: string;
    phone?: string;
    department?: string;
    yearOfStudy?: string;
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

export const getUserProfileImageKey = (user?: AuthUser | null): string | null => {
    const currentUser = user || getCurrentUser();
    if (!currentUser) return null;
    const identifier = currentUser.id || currentUser.studentId || currentUser.email;
    return identifier ? `findback-profile-image_${identifier}` : null;
};

export const getUserProfileImage = (user?: AuthUser | null): string | null => {
    const currentUser = user || getCurrentUser();
    if (!currentUser) return null;

    if (currentUser.profileImage) {
        return currentUser.profileImage;
    }

    const key = getUserProfileImageKey(currentUser);
    if (key) {
        const stored = localStorage.getItem(key);
        if (stored) return stored;
    }

    return null;
};

export const setUserProfileImage = (
    imageData: string | null,
    user?: AuthUser | null
): void => {
    const currentUser = user || getCurrentUser();
    if (!currentUser) return;

    const key = getUserProfileImageKey(currentUser);
    if (imageData && key) {
        localStorage.setItem(key, imageData);
    } else if (key) {
        localStorage.removeItem(key);
    }

    // Always clean up legacy global key so pictures never bleed across accounts
    localStorage.removeItem("findback-profile-image");

    const updatedUser: AuthUser = {
        ...currentUser,
        profileImage: imageData || "",
    };

    sessionStorage.setItem("findback_user", JSON.stringify(updatedUser));
    sessionStorage.setItem("user", JSON.stringify(updatedUser));

    window.dispatchEvent(new Event("profile_image_updated"));
};

const saveAuthentication = (data: AuthResponse) => {
    sessionStorage.setItem("findback_token", data.token);
    sessionStorage.setItem("findback_user", JSON.stringify(data.user));
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("user", JSON.stringify(data.user));

    // Clear legacy unkeyed storage
    localStorage.removeItem("findback-profile-image");

    // Cache image specifically for this user
    if (data.user?.profileImage) {
        const key = getUserProfileImageKey(data.user);
        if (key) {
            localStorage.setItem(key, data.user.profileImage);
        }
    }

    window.dispatchEvent(new Event("profile_image_updated"));
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
    localStorage.removeItem("findback-profile-image");
    sessionStorage.removeItem("findback_token");
    sessionStorage.removeItem("findback_user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    window.dispatchEvent(new Event("profile_image_updated"));
};

