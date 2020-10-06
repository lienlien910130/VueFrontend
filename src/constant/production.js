import baseConstant from './development'
let constant = baseConstant

// 僅調整與 dev 有差別的部分就好
constant = { ...constant, apiUrl: 'http://11.22.33.44/api/' }
export default constant