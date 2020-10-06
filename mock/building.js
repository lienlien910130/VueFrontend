const Mock = require('mockjs')

module.exports = [
  {
    url: '/vue-element-admin/building/infor',
    type: 'get',
    response: config => {
      const data = Mock.mock({
        'items': [{
          id: Mock.Random.guid(),
          name: Mock.Random.cname(),
          address:Mock.mock('@county(true)'),
          ares: Mock.Random.integer(500, 2500),
          height: Mock.Random.integer(500, 2500),
          floor: [Mock.Random.integer(0, 150),Mock.Random.integer(0, 15),'4'],
          license: '(108)桃市都建執照字第會桃00019號'
        }]
      })
      const items = data.items
      return {
        code: 20000,
        data: items
      }
    }
  },
  {
    url: '/vue-element-admin/building/editinfor',
    type: 'post',
    response: config => {
      
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/building/fetchList',
    type: 'get',
    response: config => {
      const List = []
      const count = 100
      for (let i = 0; i < count; i++) {
        List.push(Mock.mock({
          id: '@increment',
          name: Mock.Random.cname(), //姓名
          'title|1': ['主任委員','副主任委員','監察委員'], //職稱
          address: Mock.mock('@county(true)'), //地址
          'job|1': ['65號2樓','67號8樓','61號2樓'], //單位
          'urgent|1': 
          ['0937-454-129','0988-441-849','0976-791-034','0962-479-555','0937-469-169','0978-000-473','0935-297-048'], //緊急
          'phone|1': ['02-71456893','02-29569119','02-26579448','02-35471996','03-3274698','02-21134479','03-3471648'], //電話
          remarks: '', //備註
          'type|1': ['MC', 'SC', 'FM', 'ME','GR','PW'], // 種類
          'state|1':['0', '1'] //0未配合 1配合中
        }))
      }

      
      const {  type,  page = 1, limit = 10 , sort } = config.query

      let mockList = List.filter(item => {
        if (type && item.type !== type) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/vue-element-admin/building/floorList', //取得樓層的住戶list
    type: 'get',
    response: config => {
      const start = parseInt(config.query.floor) * 100
      const List = []
      for (let i = start; i < start+20; i++) {
        List.push(Mock.mock({
          id: '@increment',
          name: Mock.Random.cname(), //姓名
          floor: config.query.floor, //樓層
          number: Mock.Random.integer(i, start+20), //門牌 總樓層是0
          nameurgent: Mock.Random.cname(),
          'urgent|1': 
          ['0937-454-129','0988-441-849','0976-791-034','0962-479-555','0937-469-169','0978-000-473','0935-297-048'], //緊急
          'phone|1': ['02-71456893','02-29569119','02-26579448','02-35471996','03-3274698','02-21134479','03-3471648'],
          file:'',
          remarks:''
        }))
      }
      return {
        code: 20000,
        data: List
      }
    }
  },
  {
    url: '/vue-element-admin/building/floorImage', //取得樓層的住戶list
    type: 'get',
    response: config => {
      
      return {
        code: 20000,
        data: "/static/img/5F_MAP.jpg"
      }
    }
  }

]
