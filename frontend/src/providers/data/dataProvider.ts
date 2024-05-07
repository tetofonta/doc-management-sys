/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    CreateParams,
    CreateResult,
    DataProvider,
    DeleteManyParams,
    DeleteManyResult,
    DeleteParams,
    DeleteResult,
    GetListParams,
    GetListResult,
    GetManyParams,
    GetManyReferenceParams,
    GetManyReferenceResult,
    GetManyResult,
    GetOneParams,
    GetOneResult,
    Identifier,
    RaRecord,
    UpdateManyParams,
    UpdateManyResult,
    UpdateParams,
    UpdateResult,
} from "react-admin";
import querystring from "query-string";
import { ApplicationAuthProvider } from "../auth/authProvider";

export class ApplicationDataProvider implements DataProvider {
    constructor(
        private readonly apiRoot: string,
        private readonly fetchFunc?: any,
        private readonly setFacets?: any,
    ) {
        if (!this.fetchFunc)
            this.fetchFunc = (
                input: string | URL | Request,
                init?: RequestInit & {
                    retryDisallowed: boolean;
                    refreshDisallowed: boolean;
                },
            ) => ApplicationAuthProvider.getInstance().fetchJson(input, init);
    }

    public async getList<T extends RaRecord<Identifier> = any>(
        resource: string,
        params: GetListParams,
    ): Promise<GetListResult<T>> {
        const query = this.prepareListQuery(params);
        const url = `${this.apiRoot}/${resource}/?${querystring.stringify(query, { arrayFormat: "bracket" })}`;
        const { json } = await this.fetchFunc(url, { method: "GET", cache: "no-cache" });
        if(this.setFacets && json.facets) {
            this.setFacets(resource, json.facets);
        }
        return {
            data: json.result,
            total: json.count,
        };
    }

    public async getOne<TT extends RaRecord<Identifier> = any>(
        resource: string,
        params: GetOneParams,
    ): Promise<GetOneResult<TT>> {
        const url = `${this.apiRoot}/${resource}/${params.id}/`;
        const { json } = await this.fetchFunc(url, { method: "GET", cache: "no-cache" });
        return { data: json };
    }

    public async getMany<T extends RaRecord<Identifier> = any>(
        resource: string,
        params: GetManyParams,
    ): Promise<GetManyResult<T>> {
        const query = this.filterParameterName(params.ids.map((id: any) => ({ id: id?.id || id })));
        const url = `${this.apiRoot}/${resource}/?${querystring.stringify(query, { arrayFormat: "bracket" })}`;
        const { json } = await this.fetchFunc(url, { method: "GET", cache: "no-cache" });
        return { data: json.result };
    }

    public async getManyReference<T extends RaRecord<Identifier> = any>(
        resource: string,
        params: GetManyReferenceParams,
    ): Promise<GetManyReferenceResult<T>> {
        const query = this.prepareListQuery(params);

        const url = `${this.apiRoot}/${params.target}/${params.id}/${resource}?${querystring.stringify(query, {
            arrayFormat: "bracket",
        })}`;
        const { json } = await this.fetchFunc(url, { method: "GET", cache: "no-cache" });
        return {
            data: json.result,
            total: json.count,
        };
    }

    public async create<T extends RaRecord<Identifier> = any>(
        resource: string,
        params: CreateParams<T>,
    ): Promise<CreateResult<T>> {
        const { json } = await this.fetchFunc(`${this.apiRoot}/${resource}/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(params.data),
            cache: "no-store",
        });
        return { data: json.result };
    }

    public async update<T extends RaRecord<Identifier> = any>(
        resource: string,
        params: UpdateParams<T>,
    ): Promise<UpdateResult<T>> {
        const { json } = await this.fetchFunc(`${this.apiRoot}/${resource}/${params.id}/`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(params.data),
            cache: "no-store",
        });
        return { data: json.result };
    }

    public async updateMany<T extends RaRecord<Identifier> = any>(
        resource: string,
        params: UpdateManyParams<T>,
    ): Promise<UpdateManyResult<T>> {
        const query = this.filterParameterName(params.ids.map((id) => ({ id })));
        const { json } = await this.fetchFunc(
            `${this.apiRoot}/${resource}/?${querystring.stringify(query, { arrayFormat: "bracket" })}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(params.data),
                cache: "no-store",
            },
        );
        return { data: json.result };
    }

    public async delete<T extends RaRecord<Identifier> = any>(
        resource: string,
        params: DeleteParams<T>,
    ): Promise<DeleteResult<T>> {
        await this.fetchFunc(`${this.apiRoot}/${resource}/${params.id}/`, {
            method: "DELETE",
            cache: "no-store",
        });
        return { data: { id: params.id } as T };
    }

    public async deleteMany<T extends RaRecord<Identifier> = any>(
        resource: string,
        params: DeleteManyParams<T>,
    ): Promise<DeleteManyResult<T>> {
        const query = this.filterParameterName(params.ids.map((id) => ({ id })));
        await this.fetchFunc(`${this.apiRoot}/${resource}/?${querystring.stringify(query, { arrayFormat: "bracket" })}`, {
            method: "DELETE",
            cache: "no-store",
        });
        return { data: params.ids };
    }

    private zip<T, V>(arr1: T[], arr2: V[]): [T | undefined, V | undefined][] {
        const bigger_len = Math.max(arr1.length, arr2.length);
        const ret = Array(bigger_len);
        for (let i = 0; i < bigger_len; i++) {
            ret[i] = [i < arr1.length ? arr1[i] : undefined, i < arr2.length ? arr2[i] : undefined];
        }
        return ret;
    }

    private prepareListQuery(params: GetListParams) {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const sort_match = this.zip([field], [order]).filter((e) => !!e[0]);
        const additional_queries = params.meta?.query_params ?? {};

        const raw_filter = params.meta?.filter_middleware ? params.meta?.filter_middleware(params.filter) : params.filter;

        return Object.assign(
            {
                offset: (page - 1) * perPage,
                take: perPage,
                sortAsc: sort_match.filter((e) => e[1] == "ASC" || !e[1]).map((e) => e[0]),
                sortDesc: sort_match.filter((e) => e[1] == "DESC").map((e) => e[0]),
                ...additional_queries,
            },
            params.meta?.filter_in_query ? raw_filter : this.filterParameterName(raw_filter),
        );
    }

    private filterParameterName(filter_obj: any | any[]) {
        return {
            filters: Array.isArray(filter_obj) ? filter_obj.map((e) => JSON.stringify(e)) : [JSON.stringify(filter_obj)],
        };
    }
}
