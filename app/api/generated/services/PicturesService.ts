/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

// 内联类型定义
export type Body_upload_wallpaper_api_pictures__post = {
    /**
     * 壁纸文件
     */
    file: Blob;
    /**
     * 标签
     */
    tags: Array<string>;
    /**
     * 分类
     */
    category: string;
};
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
export type PictureUpdateRequest = {
    /**
     * 审核状态：0=未审核，1=通过，2=未通过
     */
    status?: (number | null);
    /**
     * 分类
     */
    category?: (string | null);
    /**
     * 标签列表
     */
    tags?: (Array<string> | null);
};
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


export class PicturesService {

    /**
     * 上传壁纸
     * 上传新壁纸，提取图片属性，并返回预签名下载链接和元数据。
 *
 * 返回的元数据包括：
 * - width, height: 图片尺寸（像素）
 * - format: 图片格式（JPEG, PNG 等）
 * - mode: 颜色模式（RGB, RGBA 等）
 * - size_bytes: 文件大小
 * - md5: 文件 MD5 哈希（用于去重）
 * - dpi: 分辨率（如果有）
     * @returns PictureUploadResponse Successful Response
     * @throws ApiError
     */
    public static uploadWallpaperApiPicturesPost({
formData,
}: {
formData: Body_upload_wallpaper_api_pictures__post,
}): CancelablePromise<PictureUploadResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/pictures/',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * 分页查询壁纸列表
     * 分页查询壁纸列表，按创建时间倒序排列。
     * @returns PictureQueryResponse Successful Response
     * @throws ApiError
     */
    public static listWallpapersApiPicturesListGet({
pageNum = 1,
pageSize = 20,
format,
minWidth,
maxWidth,
minHeight,
maxHeight,
originalFilename,
deviceType,
status,
category,
tags,
}: {
/**
 * 页码，从 1 开始
 */
pageNum?: number,
/**
 * 每页数量，最大 100
 */
pageSize?: number,
/**
 * 图片格式筛选（如 JPEG、PNG）
 */
format?: (string | null),
/**
 * 最小宽度（px）
 */
minWidth?: (number | null),
/**
 * 最大宽度（px）
 */
maxWidth?: (number | null),
/**
 * 最小高度（px）
 */
minHeight?: (number | null),
/**
 * 最大高度（px）
 */
maxHeight?: (number | null),
/**
 * 原始文件名（模糊匹配）
 */
originalFilename?: (string | null),
/**
 * 设备类型：1=PC端，2=移动端，3=头像
 */
deviceType?: (number | null),
/**
 * 审核状态：0=未审核，1=通过，2=未通过
 */
status?: (number | null),
/**
 * 分类
 */
category?: (string | null),
/**
 * 标签列表
 */
tags?: (Array<string> | null),
}): CancelablePromise<PictureQueryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/pictures/list',
            query: {
                'page_num': pageNum,
                'page_size': pageSize,
                'format': format,
                'min_width': minWidth,
                'max_width': maxWidth,
                'min_height': minHeight,
                'max_height': maxHeight,
                'original_filename': originalFilename,
                'device_type': deviceType,
                'status': status,
                'category': category,
                'tags': tags,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * 下载图片
     * 根据图片ID下载图片，返回图片流。
     * @returns any Successful Response
     * @throws ApiError
     */
    public static downloadPictureApiPicturesPictureIdDownloadGet({
pictureId,
}: {
pictureId: number,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/pictures/{picture_id}/download',
            path: {
                'picture_id': pictureId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * 增加图片预览次数
     * 增加图片的预览次数。
     * @returns any Successful Response
     * @throws ApiError
     */
    public static incrementPictureViewApiPicturesPictureIdViewPost({
pictureId,
}: {
pictureId: number,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/pictures/{picture_id}/view',
            path: {
                'picture_id': pictureId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * 编辑壁纸信息
     * 编辑壁纸信息，主要修改标签、分类、审核状态。
     * @returns PictureResponseInfo Successful Response
     * @throws ApiError
     */
    public static updateWallpaperApiPicturesPictureIdPut({
pictureId,
requestBody,
}: {
pictureId: number,
requestBody: PictureUpdateRequest,
}): CancelablePromise<PictureResponseInfo> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/pictures/{picture_id}',
            path: {
                'picture_id': pictureId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * 删除壁纸
     * 删除指定壁纸。先删除 MinIO 文件，再删除数据库记录。
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteWallpaperApiPicturesPictureIdDelete({
pictureId,
}: {
pictureId: number,
}): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/pictures/{picture_id}',
            path: {
                'picture_id': pictureId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
