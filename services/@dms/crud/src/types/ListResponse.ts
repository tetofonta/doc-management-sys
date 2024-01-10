export class ListResponse<T> {
    result: T[];
    count: number;
    from: number;
    to: number;
}
