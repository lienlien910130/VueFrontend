
const Mock = require('mockjs')
//const hasToken = getToken()

const List = []
const count = 1

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    count: [Mock.Random.integer(0, 500) ,Mock.Random.integer(0, 500) ,Mock.Random.integer(0, 500) ]
  }))
}

module.exports = [
  
    {
        url: '/vue-admin-template/index/equipment',
        type: 'get',
        response: config => {
          const a = Mock.mock({
            count: [Mock.Random.integer(0, 500) ,Mock.Random.integer(0, 500) ,Mock.Random.integer(0, 500) ]
          })
          return {
            code: 20000,
            data: a
          }
        }
    },
    {
      url: '/vue-admin-template/index/getequipment',
      type: 'get',
      response: config => {
      
        const equipments = Mock.mock({
          'items|30': [{
            id: '@id',
            'name|1':['撒水器', '室內消防栓', '水霧', '連結送水管', '手動報警設備','滅火器','排煙'],
            'type|1': ['F', 'P', 'B', 'G', 'O'],
            state:config.query[0],
            'floor|1' :['1','2','3','4','5','B1','B2','B3'],
            'position|1' :['wjji','sjiqwd','xjiopqw','qwip','siodpq','xnjkii','wqojo','cjwjoc']
          }]
        })
        return {
          code: 20000,
          data: equipments
        }
      }
  }


]