/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * 图片分页查询响应模型
 */
export type PictureResponseInfo = {
    /**
     * 主键
     */
    id: number;
    /**
     * 原始文件名
     */
    original_filename?: (string | null);
    /**
     * 图片宽度（px）
     */
    width: number;
    /**
     * 图片高度（px）
     */
    height: number;
    /**
     * 压缩WebP预签名预览链接
     */
    webp_url?: (string | null);
    /**
     * 缩略图WebP预签名预览链接
     */
    thumbnail_url?: (string | null);
    /**
     * 设备类型：1=PC端，2=移动端，3=头像
     */
    device_type?: (number | null);
    /**
     * 分类
     */
    category?: (string | null);
    /**
     * 预览次数
     */
    view_count?: number;
    /**
     * 下载次数
     */
    download_count?: number;
    /**
     * 标签列表
     */
    tags?: (Array<string> | null);
    /**
     * 创建时间
     */
    created_at: string;
    /**
     * 更新时间
     */
    updated_at: string;
    /**
     * 审核状态：0=未审核，1=通过，2=未通过
     */
    status: number;
};
