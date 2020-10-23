/**
 * api接口的统一出口
 */

// 文章模块接口
import build from '@/api/build';
import files from '@/api/files';
// 其他模块的接口……

// 导出接口
export default {    
  build,
  files
}