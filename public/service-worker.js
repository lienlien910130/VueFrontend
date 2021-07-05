
/**
 * service worker 用了offline-plugin之后，这个文件就不使用了
 */
var cacheName = 'bs-0-0-1'
var cacheFiles = [
  '/',
  './index.html'
]

// 监听install事件，安装完成后，进行文件缓存
self.addEventListener('install', function (e) {
  console.log('Service Worker 狀態： install')

  // 找到key对应的缓存并且获得可以操作的cache对象
  var cacheOpenPromise = caches.open(cacheName).then(function (cache) {
    // 将需要缓存的文件加进来
    return cache.addAll(cacheFiles)
  })
  // 将promise对象传给event
  e.waitUntil(cacheOpenPromise)
})
// 监听activate事件，激活后通过cache的key来判断是否更新cache中的静态资源
self.addEventListener('activate', function (e) {
  console.log('Service Worker 狀態： activate')
  var cachePromise = caches.keys().then(function (keys) {
    // 遍历当前scope使用的key值
    return Promise.all(keys.map(function (key) {
      // 如果新获取到的key和之前缓存的key不一致，就删除之前版本的缓存
      if (key !== cacheName) {
        return caches.delete(key)
      }
    }))
  })
  e.waitUntil(cachePromise)
  // 保证第一次加载fetch触发
  return self.clients.claim()
})
//攔截取求-暫無儲存至cache
self.addEventListener('fetch', function (e) {
  console.log('event.request:', e.request.method , '// e.request.url:',e.request.url)
  e.respondWith(
    // 判断当前请求是否需要缓存
    caches.match(e.request).then(function (cache) {
      // 有缓存就用缓存，没有就从新发请求获取
      return cache || fetch(e.request)
    }).catch(function (err) {
      console.log(err)
      // 缓存报错还直接从新发请求获取
      return fetch(e.request)
    })
  )
})
// // 添加service worker对push的监听
self.addEventListener('push', function (e) {
  var body;

  if (e.data) {
    body = e.data.text();
  } else {
    body = "Standard Message";
  }
  var options = {
      body: body,
      icon: "./manifestimg/512.png",
      vibrate: [100, 50, 100],
      data: {
          dateOfArrival: Date.now()
      },
      actions: [
          {
              action: "confirm", title: "Go interact with this!",
              icon: "images/checkmark.png"
          },
          {
              action: "close", title: "Ignore",
              icon: "images/red_x.png"
          },
      ]
  };
  e.waitUntil(
      self.registration.showNotification("Push Notification", options)
  );

  // var data = e.data
  // if (e.data) {
    
  //   //data = data.json()
  //   console.log('push的數據為：', data)
  //   self.registration.showNotification(data.text)
  // } else {
  //   console.log('push沒有任何數據')
  // }
})
//監聽使用者對推播訊息操作的選項
self.addEventListener('notificationclick', function(event) {
  var notification = event.notification;
  var action = event.action;
  
  console.log(notification);
  if(action === 'confirm') {
      console.log('使用者點選確認');
      notification.close();
  } else {
      console.log(action);
  }
})
//滑掉推播
self.addEventListener('notificationclose', function(event){
  console.log('使用者沒興趣',event);
});
// caches.match(e.request).then(function (cache) {
//   // 有缓存就用缓存，没有就从新发请求获取
//   return cache || fetch(e.request).then(res =>
//     // 存 caches 之前，要先打開 caches.open(dataCacheName)
//     caches.open(cacheName)
//     .then(function(cache) {
//       // cache.put(key, value)
//       // 下一次 caches.match 會對應到 event.request
//       var method = e.request.method
//       if (method !== 'POST' && method !== 'DELETE' &&
//       method !== 'PUT') {
//         // cache is unsupported POST and so on
//         cache.put(e.request, res.clone())
        
//       }
//       // cache.put(e.request, res.clone())
//       return res
//     })
//   )
// }).catch(function (err) {
//   console.log(err)
//   // 缓存报错还直接从新发请求获取
//   return fetch(e.request)
// })

