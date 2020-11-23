import request from '@/utils/request'

//下載檢修/公安檔案
export function downloadfile(filesId) {
  return request({
    url: '/report/fileDownload/'+filesId,
    method: 'get'
  })
}
//刪除檢修/公安檔案
export function delfile(filesId) {
  return request({
    url: '/report/fileDelete/'+filesId,
    method: 'delete'
  })
}

