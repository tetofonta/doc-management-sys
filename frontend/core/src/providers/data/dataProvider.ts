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
    ) {
        if (!this.fetchFunc) this.fetchFunc = ApplicationAuthProvider.getInstance().fetchJson;
    }

    public async getList<T extends RaRecord<Identifier> = any>(
        resource: string,
        params: GetListParams,
    ): Promise<GetListResult<T>> {
        const query = this.prepareListQuery(params);
        const url = `${this.apiRoot}/${resource}/?${querystring.stringify(query, { arrayFormat: "bracket" })}`;
        const { json, headers } = await this.fetchFunc(url, { method: "GET" });
        return {
            data: json,
            total: parseInt(headers.get("content-range").split("/").pop(), 10),
        };
    }

    public async getOne<TT extends RaRecord<Identifier> = any>(
        resource: string,
        params: GetOneParams,
    ): Promise<GetOneResult<TT>> {
        const url = `${this.apiRoot}/${resource}/${params.id}/`;
        const { json } = await this.fetchFunc(url);
        return { data: json };
    }

    public async getMany<T extends RaRecord<Identifier> = any>(
        resource: string,
        params: GetManyParams,
    ): Promise<GetManyResult<T>> {
        const query = this.filterParameterName("id", params.ids);
        const url = `${this.apiRoot}/${resource}/?${querystring.stringify(query, { arrayFormat: "bracket" })}`;
        const { json } = await this.fetchFunc(url);
        return { data: json };
    }

    public async getManyReference<T extends RaRecord<Identifier> = any>(
        resource: string,
        params: GetManyReferenceParams,
    ): Promise<GetManyReferenceResult<T>> {
        const query = this.prepareListQuery(params);

        const url = `${this.apiRoot}/${params.target}/${params.id}/${resource}?${querystring.stringify(query, {
            arrayFormat: "bracket",
        })}`;
        const { json, headers } = await this.fetchFunc(url, { method: "GET" });
        return {
            data: json,
            total: parseInt(headers.get("content-range").split("/").pop(), 10),
        };
    }

    public async create<T extends RaRecord<Identifier> = any>(
        resource: string,
        params: CreateParams<T>,
    ): Promise<CreateResult<T>> {
        const { json } = await this.fetchFunc(`${this.apiRoot}/${resource}/`, {
            method: "POST",
            body: JSON.stringify(params.data),
        });
        return { data: json };
    }

    public async update<T extends RaRecord<Identifier> = any>(
        resource: string,
        params: UpdateParams<T>,
    ): Promise<UpdateResult<T>> {
        const { json } = await this.fetchFunc(`${this.apiRoot}/${resource}/`, {
            method: "PATCH",
            body: JSON.stringify(params.data),
        });
        return { data: json };
    }

    public async updateMany<T extends RaRecord<Identifier> = any>(
        resource: string,
        params: UpdateManyParams<T>,
    ): Promise<UpdateManyResult<T>> {
        const query = this.filterParameterName("id", params.ids);
        const { json } = await this.fetchFunc(
            `${this.apiRoot}/${resource}/?${querystring.stringify(query, { arrayFormat: "bracket" })}`,
            {
                method: "PATCH",
                body: JSON.stringify(params.data),
            },
        );
        return { data: json };
    }

    public async delete<T extends RaRecord<Identifier> = any>(
        resource: string,
        params: DeleteParams<T>,
    ): Promise<DeleteResult<T>> {
        const { json } = await this.fetchFunc(`${this.apiRoot}/${resource}/${params.id}/`, {
            method: "DELETE",
        });
        return { data: json };
    }

    public async deleteMany<T extends RaRecord<Identifier> = any>(
        resource: string,
        params: DeleteManyParams<T>,
    ): Promise<DeleteManyResult<T>> {
        const query = this.filterParameterName("id", params.ids);
        const { json } = await this.fetchFunc(
            `${this.apiRoot}/${resource}/?${querystring.stringify(query, { arrayFormat: "bracket" })}`,
            {
                method: "DELETE",
            },
        );
        return { data: json };
    }

    private prepareListQuery(params: GetListParams) {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;

        const query = {
            offset: (page - 1) * perPage,
            take: perPage,
            sort: [field],
            sortDir: [order],
        };
        return Object.assign(
            query,
            Object.keys(params.filter).reduce((a, b) => Object.assign(a, this.filterParameterName(b, params.filter[b])), {}),
        );
    }

    private filterParameterName(
        filter_key: string,
        filter_value:
            | string
            | number
            | boolean
            | (string | number | boolean)[]
            | {
                  op: "GT" | "LT" | "GTE" | "LTE" | "LIKE" | "EQ";
                  value: string | number | boolean | (string | number | boolean)[];
              },
    ): object {
        let operator = "";
        let val = filter_value;
        if (typeof filter_value == "object" && !Array.isArray(filter_value)) {
            if (filter_value.op != "EQ") operator = `_${filter_value.op.toLowerCase()}`;
            val = filter_value.value;
        }
        if (Array.isArray(val)) val = val.map((e) => e.toString());
        return { [`q${operator}${filter_key}`]: val };
    }
}
