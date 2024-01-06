/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthProvider, HttpError, UserIdentity } from "react-admin";
import { Feature, FeatureSet } from "./Feature";

export type MinimalTokenPayloadType = {
    features: string[];
    superuser: boolean;
    userId: string;
    userName?: string;
};
export type LocallyStoredTokenData = {
    token: string;
    refresh_token: string;
    payload: MinimalTokenPayloadType;
};

export class ApplicationAuthProvider implements AuthProvider {
    private static LOCAL_STORAGE_AUTH_KEY = "auth";
    private static LOCAL_STORAGE_ID_KEY = "dms_id";
    private static LOCAL_STORAGE_PREV_ID_KEY = "dms_prev_id";

    private static instance: ApplicationAuthProvider | null = null;
    private current_token = "";

    private constructor() {}

    public static getInstance() {
        if (this.instance == null) this.instance = new ApplicationAuthProvider();
        return this.instance;
    }

    //yeah... this is not a very good solution.
    public hasPermissions(...perm: FeatureSet<string>[]): boolean {
        const { status, data } = this.getAuthData();
        if (!status) return false;
        const res = perm.length == 0 || perm.some((e) => Feature.eval(new Set(data.payload.features), e));
        console.debug("Checking permissions", perm, data.payload.superuser, res);
        return data.payload.superuser || res;
    }

    public async fetchJson<T = any>(
        input: string | URL | Request,
        init?: RequestInit & {
            retryDisallowed: boolean;
            refreshDisallowed: boolean;
        },
    ): Promise<{ status: number; headers: Headers; body: string; json: T | null }> {
        const hdr = { Authorization: `Bearer ${this.current_token}`, ...((init || {})?.headers || {}) };
        const ret = await fetch(input, { ...(init || {}), headers: hdr });
        const status = ret.status;
        const statusText = ret.statusText;
        const body = await ret.text();
        const headers = ret.headers;
        let json: T | null = null;

        try {
            json = JSON.parse(body);
        } catch {
            console.debug("The returned body is not json parsable.");
        }

        if (status == 401 || status == 403) {
            console.debug("Fetch failed with an auth related error");
            if (!init?.refreshDisallowed) {
                console.log("Trying to refresh the token");
                if (await this.refreshToken()) {
                    console.debug("Retrying fetching the resource...");
                    if (!init?.retryDisallowed) return await this.fetchJson(input, init);
                }
            }
        }

        if (status < 200 || status >= 300) {
            return Promise.reject(
                new HttpError(
                    (json &&
                        (
                            json as unknown as {
                                message: string;
                            }
                        ).message) ||
                        statusText,
                    status,
                    json || body,
                ),
            );
        }

        return { status, headers, body, json };
    }

    public async checkAuth() {
        const { status, data } = this.getAuthData();
        if (!status) return Promise.reject();
        console.debug("Found login data:", data);
        this.current_token = data.token;
        console.debug("Session restored");

        const check = await this.fetchJson("/api/token/");
        if (check.status != 200) {
            console.debug("Session was not usable.");
            return Promise.reject();
        }
        return Promise.resolve();
    }

    public async checkError(error: HttpError) {
        const status = error.status;
        if (status === 401 || status === 403) {
            console.debug("Error was auth related");
            await this.logout();
            return Promise.reject();
        }
        return Promise.resolve();
    }

    public async login(tokens: { token: string; refresh_token: string }): Promise<void> {
        console.debug("Logging in:", tokens);
        const { token, refresh_token } = tokens;
        const payload = this.parseJwt(token);
        console.debug("Token payload", payload);

        if (!payload.features) return Promise.reject();
        if (!payload.superuser) return Promise.reject();

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
        localStorage.removeItem(ApplicationAuthProvider.LOCAL_STORAGE_AUTH_KEY);
        this.current_token = "";
    }

    public async getIdentity(): Promise<UserIdentity> {
        return this.getIdentitySync() || Promise.reject();
    }

    public async getPermissions(): Promise<string[]> {
        const { status, data } = this.getAuthData();
        if (!status) return Promise.reject();
        return data?.payload.features;
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

    private getAuthData(): { status: false; data: undefined } | { status: true; data: LocallyStoredTokenData } {
        const auth = localStorage.getItem(ApplicationAuthProvider.LOCAL_STORAGE_AUTH_KEY);
        if (!auth) return { status: false, data: undefined };
        try {
            const data = JSON.parse(auth) as LocallyStoredTokenData;
            if (!data.payload?.superuser) return { status: false, data: undefined };
            if (!data.payload?.features) return { status: false, data: undefined };
            if (!data.token) return { status: false, data: undefined };
            if (!data.refresh_token) return { status: false, data: undefined };
            return { status: true, data };
        } catch {
            return { status: false, data: undefined };
        }
    }

    private async refreshToken(): Promise<boolean> {
        const { status, data } = this.getAuthData();
        if (!status) return false;

        console.debug("Trying to refresh the session");
        const refresh_status = await fetch("/api/token/", {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${data.refresh_token}`,
                "X-Old-Token": data.token,
            },
        });

        if (
            !(
                refresh_status.status == 204 &&
                refresh_status.headers.has("X-Auth-Token") &&
                refresh_status.headers.has("X-Refresh-Token")
            )
        )
            return false;

        console.debug(
            "Refresh succeeded:",
            refresh_status.headers.get("X-Auth-Token"),
            refresh_status.headers.get("X-Refresh-Token"),
        );
        await this.login({
            token: refresh_status.headers.get("X-Auth-Token") || "",
            refresh_token: refresh_status.headers.get("X-Refresh-Token") || "",
        });
        return true;
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
        return JSON.parse(jsonPayload) as MinimalTokenPayloadType;
    }
}
