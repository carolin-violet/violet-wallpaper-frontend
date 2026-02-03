/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TagCreateRequest } from '../models/TagCreateRequest';
import type { TagResponse } from '../models/TagResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class TagsService {

    /**
     * 创建标签
     * 创建新标签。
     * @returns TagResponse Successful Response
     * @throws ApiError
     */
    public static createTagApiTagsPost({
requestBody,
}: {
requestBody: TagCreateRequest,
}): CancelablePromise<TagResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/tags/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * 查询所有标签列表
     * 查询所有标签列表，按点击次数倒序排列。
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listTagsApiTagsListGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tags/list',
        });
    }

    /**
     * 删除标签
     * 删除指定标签。
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteTagApiTagsTagIdDelete({
tagId,
}: {
tagId: number,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/tags/{tag_id}',
            path: {
                'tag_id': tagId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
