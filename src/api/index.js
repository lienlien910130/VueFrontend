/**
 * api接口的统一出口
 */

// 文章模块接口
import building from '@/api/build';
import files from '@/api/files';
import report from '@/api/report';
// 其他模块的接口……

// 导出接口
export default {    
  building,
  files,
  report
}