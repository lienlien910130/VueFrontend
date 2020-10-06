
const tokens = { // 水星 業主 大樓管理員 防災中心
  mercuryfire: {
    token: 'mercuryfire'
  },
  owner: {
    token: 'owner'
  },
  manager: {
    token: 'manager'
  },
  prevention: {
    token: 'prevention'
  }
  
}

const users = {
  'mercuryfire': {
    roles: 'mercuryfire',
    authority: ['a','b','c','d'],
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    account: 'mercuryfire-水星',
    token:'mercuryfire',
    id: '1',
    building: ['1','2','3']
  },
  'owner': {
    roles: 'owner',
    authority: ['a','b','c','d'],
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    account: 'owner-業主',
    token:'owner',
    id: '2',
    building: ['1']
  },
  'manager': {
    roles: 'manager',
    authority: ['a','b','c','d'],
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    account: 'manager-大樓管理員',
    token:'manager',
    id: '3',
    building: ['1']
  },
  'prevention': {
    roles: 'prevention',
    authority: ['a','b','c','d'],
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    account: 'prevention-防災中心',
    token:'prevention',
    id: '4',
    building: ['1']
  }
}
//模擬回傳的數據資料
const version = {
  'version':{
    id: '@id',
    name: '@sentence(1, 2)',
    components: '@integer(300, 5000)',
    logo: '../../../dist/static/img/login_logo.png'
  }
}

module.exports = [
  {
    url: '/vue-admin-template/user/version',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: version
      }
    }
  },

  // {
  //   url: '/vue-admin-template/user/login',
  //   type: 'post',
  //   response: config => {
  //     console.log('res')
  //     const { username } = config.body
  //     const data = tokens[username]
  //     // mock error
  //     if (!data) {
  //       return {
  //         code: 60204,
  //         message: 'Account and password are incorrect.'
  //       }
  //     }

  //     return {
  //       code: 20000,
  //       data: data
  //     }
  //   }
  // },

  // get user info
  // {
  //   url: '/vue-admin-template/user/info\.*',
  //   type: 'get',
  //   response: config => {
  //     const { token } = config.query
  //     const info = users[token]

  //     // mock error
  //     if (!info) {
  //       return {
  //         code: 50008,
  //         message: 'Login failed, unable to get user details.'
  //       }
  //     }

  //     return {
  //       code: 20000,
  //       data: info
  //     }
  //   }
  // },

  // user logout
  {
    url: '/vue-admin-template/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
