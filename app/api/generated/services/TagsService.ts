/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

// 内联类型定义
export type TagCreateRequest = {
    /**
     * 标签名称
     */
    name: string;
};
export type TagResponse = {
    /**
     * 主键
     */
    id: number;
    /**
     * 标签名称
     */
    name: string;
    /**
     * 点击次数
     */
    click_count: number;
    /**
     * 创建时间
     */
    created_at: string;
    /**
     * 更新时间
     */
    updated_at: string;
};


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
