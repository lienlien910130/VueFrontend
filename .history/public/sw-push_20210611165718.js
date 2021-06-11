// 添加service worker对push的监听
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