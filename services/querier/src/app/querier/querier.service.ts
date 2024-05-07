//We expect the schema to be already set for the collections. We are not creating them.

import { BadRequestException, Injectable } from '@nestjs/common';
import { SearchQuery } from '../../types/SearchQuery';

export type QueryObject = { [k: string]: undefined | string | QueryObject };
export type FlatQueryObject = { [k: string]: undefined | string };

@Injectable()
export class QueryService {
    public extractQueryAndFilters(
        q: SearchQuery,
        separation?: {
            [k: string]: string;
        },
        username?: string,
        groups?: string[],
        additional_filters?: { [k: string]: string }
    ): { q: string; filters: FlatQueryObject } {
        const filter_regex =
            /[a-zA-Z][a-zA-Z0-9_]*:((([<>])?=?([0-9]+|\[([0-9]+\.\.[0-9]+|[0-9]+)(,\s*([0-9]+\.\.[0-9]+|[0-9]+))*]))|!?=?(\[(`.*`|[\w*]+)(,\s*(`.*`|[\w*]+))]|`.*`|[\w*]+))/g;

        const filters: { [k: string]: string } = {};
        if (username || groups)
            filters.__userfilter = [
                `owner:${this.sanitize_single_word(username)}`,
                ...(groups?.map((e) => `group:${this.sanitize_single_word(e)}`) || []),
            ].join(' || ');

        if (q.filter_string) {
            if (!this.is_filter_valid(q.filter_string)) return { q: q.q, filters };
            return {
                q: q.q,
                filters: {
                    ...filters,
                    __: `${q.filter_string}`,
                },
            };
        }

        const filter_strings = q.q.match(filter_regex) || [];
        const prompt = q.q.replace(filter_regex, '');

        for (const tag of filter_strings) {
            if (!this.is_filter_valid(tag)) continue;
            const name = tag.split(':', 1)[0].toLowerCase();
            const family = separation[name] || separation['*'] || '__';
            if (!filters[family]) filters[family] = `(${tag})`;
            else filters[family] += ` && (${tag})`;
        }

        if (additional_filters)
            for (const family of Object.keys(additional_filters)) {
                if (!filters[family]) filters[family] = `(${additional_filters[family]})`;
                else filters[family] += ` && (${additional_filters[family]})`;
            }

        const final_prompt = prompt.trim();

        return {
            q: final_prompt ? final_prompt : '*',
            filters,
        };
    }

    public assemble(
        search_data: FlatQueryObject,
        user_data_assoc?: string,
        oth: string[] = [],
        additional_filters?: {
            [k: string]: string;
        }
    ): string {
        search_data = this.unflatten(search_data, user_data_assoc, oth, additional_filters);
        return this.internal_assemble(search_data, user_data_assoc, oth);
    }

    private internal_assemble(search_data: QueryObject, user_data_assoc?: string, oth: string[] = []): string {
        const keys = Object.keys(search_data);

        return keys
            .map((k: string) => {
                if (k == '__') return this.join_filter(undefined, search_data[k] as string);
                if (typeof search_data[k] !== 'string' && !!search_data[k])
                    return this.join_filter(
                        k,
                        this.internal_assemble(search_data[k] as QueryObject, user_data_assoc, oth)
                    );
                return this.join_filter(k, search_data[k] as string);
            })
            .filter((e) => !!e)
            .join(' && ');
    }

    private join_filter(collection: string, filter: string | undefined): string {
        if (!filter && !collection) return '';
        if (!filter) return `$${collection}(id:*)`;
        if (!this.is_filter_valid(filter as string)) {
            throw new BadRequestException();
        }

        if (!collection) return `(${filter})`;
        return `$${collection}(${filter})`;
    }

    private assign_deep(obj: QueryObject, key: string[], value: string): QueryObject {
        let ref: QueryObject = obj;
        for (const sub_key of key.filter((e) => e != '__')) {
            if (!ref[sub_key]) ref[sub_key] = {};
            ref = ref[sub_key] as QueryObject;
        }
        if (!!ref.__)
            ref.__ = [this.join_filter(undefined, ref.__ as string), this.join_filter(undefined, value)]
                .filter((e) => !!e)
                .join(' && ');
        else ref.__ = value;
        return obj;
    }

    private unflatten(
        search_data: FlatQueryObject,
        user_data_assoc?: string,
        oth: string[] = [],
        additional_filters?: FlatQueryObject
    ): any {
        const ret: QueryObject = {};

        for (const k of [...Object.keys(search_data), ...oth]) {
            this.assign_deep(ret, k.split('.'), search_data[k]);
        }

        if (additional_filters)
            for (const k of Object.keys(additional_filters)) {
                this.assign_deep(ret, k.split('.'), additional_filters[k]);
            }

        if (ret.__userfilter) {
            this.assign_deep(ret, (user_data_assoc || '__').split('.'), ret['__userfilter']['__'] as string);
            delete ret.__userfilter;
        }
        return ret;
    }

    private is_filter_valid(s: string | undefined): boolean {
        if (!s) return false;

        const counters = {
            '[': 0,
            '(': 0,
        };

        for (const ch of s.split('')) {
            if (ch == '[') counters[ch] += 1;
            else if (ch == '(') counters[ch] += 1;
            else if (ch == ']') counters['['] -= 1;
            else if (ch == ')') counters['('] -= 1;

            if (counters['['] < 0 || counters['('] < 0) return false;
        }
        return !(counters['['] != 0 || counters['('] != 0);
    }

    private sanitize_single_word(word: string): string {
        return word.replace(/[|&$()]/g, ' ').split(' ')[0] || 'c422b5e2230d617d22759a19a5a5cb65792edebc'; //WTF
    }
}
