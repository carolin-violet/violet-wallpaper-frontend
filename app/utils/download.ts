/**
 * 将 Blob 通过 a 标签触发浏览器下载并保存到本地
 * @param blob 要下载的二进制数据
 * @param filename 文件名（无扩展名时会根据 blob MIME 类型自动补充）
 */
export function downloadBlobAsFile(blob: Blob, filename: string): void {
  const downloadFilename = filename.includes('.')
    ? filename
    : `${filename}.${blob.type.split('/')[1] || 'jpg'}`
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = downloadFilename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
