import { AuthProvider, HttpError, UserIdentity } from "react-admin";

export class ApplicationAuthProvider implements AuthProvider {
    private static LOCAL_STORAGE_AUTH_KEY = "auth";
    private static LOCAL_STORAGE_ID_KEY = "dms_id";
    private static LOCAL_STORAGE_PREV_ID_KEY = "dms_prev_id";

    private current_token = "";

    public async checkAuth() {
        const data = localStorage.getItem(ApplicationAuthProvider.LOCAL_STORAGE_AUTH_KEY);
        console.debug("Found login data:", data);
        if (!data) return Promise.reject();
        const d = JSON.parse(data);
        if (!d.token) return Promise.reject();
        this.current_token = d.token;
        console.debug("Session restored:", this.current_token);
        return Promise.resolve();
    }

    public async checkError(error: HttpError) {
        const status = error.status;
        if (status === 401 || status === 403) {
            console.debug("Error was auth related");

            const auth_data = localStorage.getItem(ApplicationAuthProvider.LOCAL_STORAGE_AUTH_KEY);
            if (auth_data) {
                console.debug("Trying to refresh the session");

                const data = JSON.parse(auth_data);
                const refresh_status = await fetch("/api/token/", {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${data.refresh_token}`,
                        "X-Old-Token": data.token,
                    },
                });

                if (
                    refresh_status.status == 204 &&
                    refresh_status.headers.has("X-Auth-Token") &&
                    refresh_status.headers.has("X-Refresh-Token")
                ) {
                    console.debug(
                        "Refresh succeeded:",
                        refresh_status.headers.get("X-Auth-Token"),
                        refresh_status.headers.get("X-Refresh-Token"),
                    );
                    await this.login({
                        token: refresh_status.headers.get("X-Auth-Token") || "",
                        refresh_token: refresh_status.headers.get("X-Refresh-Token") || "",
                    });
                    return Promise.resolve();
                }
            }

            await this.logout();
            return Promise.reject();
        }
        return Promise.resolve();
    }

    public async login(tokens: { token: string; refresh_token: string }): Promise<void> {
        console.debug("Logging in", tokens);
        const { token, refresh_token } = tokens;
        const payload = this.parseJwt(token);
        console.debug("Token payload", payload);
        if (!payload.features) return Promise.reject();

        localStorage.setItem(
            ApplicationAuthProvider.LOCAL_STORAGE_AUTH_KEY,
            JSON.stringify({
                token,
                refresh_token,
                payload,
            }),
        );

        localStorage.removeItem(ApplicationAuthProvider.LOCAL_STORAGE_PREV_ID_KEY);
        localStorage.setItem(
            ApplicationAuthProvider.LOCAL_STORAGE_ID_KEY,
            JSON.stringify({
                id: payload.userId || "-",
                fullName: payload.userName || "-",
                avatar: (payload.userName || "-")[0],
            }),
        );
        this.current_token = token;
    }

    public async logout(): Promise<void> {
        const old_id = localStorage.getItem(ApplicationAuthProvider.LOCAL_STORAGE_ID_KEY);
        localStorage.removeItem(ApplicationAuthProvider.LOCAL_STORAGE_ID_KEY);
        if (old_id) localStorage.setItem(ApplicationAuthProvider.LOCAL_STORAGE_PREV_ID_KEY, old_id);
        this.current_token = "";
    }

    public async getIdentity(): Promise<UserIdentity> {
        return this.getIdentitySync() || Promise.reject();
    }

    public async getPermissions(): Promise<string[]> {
        const auth = localStorage.getItem(ApplicationAuthProvider.LOCAL_STORAGE_AUTH_KEY);
        if (!auth) return Promise.reject();
        const user_auth_data = JSON.parse(auth);
        return user_auth_data?.payload?.features || Promise.reject();
    }

    public hasPermissions(...perm: string[]): boolean {
        const auth = localStorage.getItem(ApplicationAuthProvider.LOCAL_STORAGE_AUTH_KEY);
        if (!auth) return false;
        const user_auth_data = JSON.parse(auth);
        return perm.every(e => user_auth_data?.payload?.features.includes(e)) || user_auth_data?.payload?.superuser
    }

    public getPreviousIdentity(): UserIdentity | undefined {
        const id = localStorage.getItem(ApplicationAuthProvider.LOCAL_STORAGE_PREV_ID_KEY);
        if (!id) return undefined;
        return JSON.parse(id) as UserIdentity;
    }

    public getIdentitySync(): UserIdentity | undefined {
        const id = localStorage.getItem(ApplicationAuthProvider.LOCAL_STORAGE_ID_KEY);
        if (!id) return undefined;
        return JSON.parse(id) as UserIdentity;
    }

    public async authenticatedFetch(input: string | URL | Request, init?: RequestInit): Promise<Response> {
        const patch = { headers: { Authorization: `Bearer ${this.current_token}` } };
        const props = Object.assign(init || {}, patch);
        return fetch(input, props);
    }

    private parseJwt(token: string) {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            window
                .atob(base64)
                .split("")
                .map(function (c) {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join(""),
        );
        return JSON.parse(jsonPayload);
    }
}
