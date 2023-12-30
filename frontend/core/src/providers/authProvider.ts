import { AuthProvider, HttpError, UserIdentity } from "react-admin";

export type FeatureBase<T> = T;
export type FeatureBinary<T> = {
    operation: "OR" | "AND";
    a: FeatureSet<T>;
    b: FeatureSet<T>;
};
export type FeatureUnary<T> = {
    operation: "NOT";
    a: FeatureSet<T>;
};
export type FeatureOperation<T> = FeatureBinary<T> | FeatureUnary<T>;
export type FeatureSet<T> = FeatureBase<T> | FeatureOperation<T>;

export class Feature {
    public static AND<T>(a: FeatureSet<T>, b: FeatureSet<T>): FeatureSet<T> {
        return { operation: "AND", a, b };
    }

    public static OR<T>(a: FeatureSet<T>, b: FeatureSet<T>): FeatureSet<T> {
        return { operation: "OR", a, b };
    }

    public static NOT<T>(a: FeatureSet<T>): FeatureSet<T> {
        return { operation: "NOT", a };
    }

    public static NAND<T>(a: FeatureSet<T>, b: FeatureSet<T>): FeatureSet<T> {
        return Feature.NOT(Feature.NAND(a, b));
    }

    public static NOR<T>(a: FeatureSet<T>, b: FeatureSet<T>): FeatureSet<T> {
        return Feature.NOT(Feature.OR(a, b));
    }

    public static XOR<T>(a: FeatureSet<T>, b: FeatureSet<T>): FeatureSet<T> {
        return Feature.AND(Feature.OR(a, Feature.NOT(b)), Feature.OR(b, Feature.NOT(a)));
    }

    public static eval<T>(set: Set<T>, func?: FeatureSet<T>): boolean {
        if (!func) return false;
        if (!this.isBase(func)) {
            //this is a composed function. evaluate it
            const f = func as FeatureOperation<T>;
            if (f.operation == "AND") {
                if (!this.eval(set, f.a)) return false;
                return this.eval(set, f.b);
            }
            if (f.operation == "OR") {
                if (this.eval(set, f.a)) return true;
                return this.eval(set, f.b);
            }
            return !this.eval(set, f.a);
        }
        return set.has(func as FeatureBase<T>);
    }

    private static isBase<T>(f: FeatureSet<T>): boolean {
        if (!f) return true;
        return !(f as FeatureUnary<T>).operation;
    }

    private static composedFunction<T>(f: FeatureSet<T>): FeatureOperation<T> {
        if (this.isBase(f)) throw Error();
        return f as FeatureOperation<T>;
    }
}

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

    //yeah... this is not a very good solution.
    public static hasPermissions(...perm: FeatureSet<string>[]): boolean {
        const auth = localStorage.getItem(ApplicationAuthProvider.LOCAL_STORAGE_AUTH_KEY);
        if (!auth) return false;
        const user_auth_data = JSON.parse(auth);
        const res = perm.some((e) => Feature.eval(new Set(user_auth_data?.payload?.features), e));
        console.debug("Checking permissions", perm, user_auth_data?.payload?.superuser, res);
        return /*user_auth_data?.payload?.superuser ||*/ res;
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
