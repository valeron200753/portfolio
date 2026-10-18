
export type AuthUser = {
    id: number;
    email: string;
    created_at: string;
};

export async function getCurrentUser(): Promise<AuthUser | null> {
    const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include"
    });

    if (response.status === 401) {
        return null;
    }

    if (!response.ok) {
        throw new Error(
            `Failed to fetch current user: ${response.status}`
        );
    }

    const user: AuthUser = await response.json();

    return user;
}




export async function login(
    email: string,
    password: string
): Promise<AuthUser> {
    const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    if (response.status === 401) {
        throw new Error("Неправильна пошта або пароль");
    }

    if (!response.ok) {
        throw new Error(
            `Помилка входу: HTTP ${response.status}`
        );
    }

    const user: AuthUser = await response.json();

    return user;
}



export async function registerUser(
    email: string,
    password: string
): Promise<AuthUser> {
    const response = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    if (response.status === 409) {
        throw new Error(
            "Ця електронна адреса вже зареєстрована"
        );
    }

    if (response.status === 400) {
        throw new Error(
            "Перевір email і пароль (15–128 символів)"
        );
    }

    if (!response.ok) {
        throw new Error(
            `Помилка реєстрації: HTTP ${response.status}`
        );
    }

    const user: AuthUser = await response.json();

    return user;
}



export async function logoutUser(): Promise<void> {
    const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error(
            `Помилка виходу: HTTP ${response.status}`
        );
    }
}
