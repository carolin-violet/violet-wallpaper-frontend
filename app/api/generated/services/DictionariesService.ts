/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DictionariesService {

    /**
     * 查询整个字典表
     * 查询整个字典表，返回所有数据（不分页）。
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllDictionariesApiDictionariesGet({
type,
}: {
type?: (number | null),
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dictionaries/',
            query: {
                'type': type,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
