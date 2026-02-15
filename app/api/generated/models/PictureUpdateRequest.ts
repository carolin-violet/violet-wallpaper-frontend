/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * 图片更新请求模型
 */
export type PictureUpdateRequest = {
    /**
     * 审核状态：0=未审核，1=通过，2=未通过
     */
    status?: (number | null);
    /**
     * 是否精选：0=否，1=是
     */
    is_featured?: (number | null);
    /**
     * 分类
     */
    category?: (string | null);
    /**
     * 标签列表
     */
    tags?: (Array<string> | null);
};
