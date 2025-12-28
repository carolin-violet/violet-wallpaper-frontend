/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * 图片上传响应模型
 */
export type PictureUploadResponse = {
    /**
     * 主键
     */
    id: number;
    /**
     * 对象存储桶名称
     */
    bucket: string;
    /**
     * 原图对象名（MinIO key）
     */
    object_name: string;
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
     * 图片格式（JPEG/PNG等）
     */
    format: string;
    /**
     * 颜色模式（RGB/RGBA等）
     */
    mode: string;
    /**
     * 文件大小（字节）
     */
    size_bytes: number;
    /**
     * 文件 MD5，用于去重
     */
    md5: string;
    /**
     * DPI 信息（JSON）
     */
    dpi?: (Record<string, any> | null);
    /**
     * 原图预签名预览链接
     */
    url?: (string | null);
    /**
     * 压缩WebP对象名
     */
    webp_object_name?: (string | null);
    /**
     * 压缩WebP预签名预览链接
     */
    webp_url?: (string | null);
    /**
     * 缩略图WebP对象名
     */
    thumbnail_object_name?: (string | null);
    /**
     * 缩略图WebP预签名预览链接
     */
    thumbnail_url?: (string | null);
    /**
     * 设备类型：1=PC端，2=移动端，3=头像
     */
    device_type?: (number | null);
    /**
     * 审核状态：0=未审核，1=通过，2=未通过
     */
    status?: number;
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
};
