/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PictureResponseInfo } from './PictureResponseInfo';

/**
 * 图片响应模型
 */
export type PictureQueryResponse = {
    /**
     * 页码，从 1 开始
     */
    page_num?: number;
    /**
     * 每页数量，最大 100
     */
    page_size?: number;
    /**
     * 图片列表
     */
    records: Array<PictureResponseInfo>;
    /**
     * 总记录数
     */
    total: number;
};
