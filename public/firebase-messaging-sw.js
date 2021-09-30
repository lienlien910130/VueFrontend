// importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');
// firebase.initializeApp({
//   apiKey: "AIzaSyBXIfFxYh6c6Jb6Haa3zWr2RtS22nFVQEs",
//   authDomain: "mercuryfire-886cf.firebaseapp.com",
//   databaseURL: "https://mercuryfire-886cf-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "mercuryfire-886cf",
//   storageBucket: "mercuryfire-886cf.appspot.com",
//   messagingSenderId: "656647175001",
//   appId: "1:656647175001:web:8255534ebbedb4a5d22a48",
//   measurementId: "G-3CQ60MXFKF"
// });
// const messaging = firebase.messaging()
// messaging.onBackgroundMessage((payload) => {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   // Customize notification here
//   const notificationTitle = payload.data.title;
//   const notificationOptions = {
//     body: payload.data.body,
//     icon: '/static/icon.png',
//     vibrate: [100, 50, 100],
//     data: {
//         dateOfArrival: Date.now()
//     },
//     click_action: 'https://google.com.tw'
//     // actions: [
//     //     {
//     //         action: "confirm", title: "Go interact with this!",
//     //         icon: "images/checkmark.png"
//     //     },
//     //     {
//     //         action: "close", title: "Ignore",
//     //         icon: "images/red_x.png"
//     //     },
//     // ]
//   };
//   self.registration.showNotification(notificationTitle,notificationOptions);
// });

// self.addEventListener('notificationclick', function(event) {
//   var url = click_action;
//   event.notification.close();
//   event.waitUntil(
//     clients.matchAll({
//       type: 'window'
//     }).then(windowClients => {
//       // 如果tab是開著的，就 focus 這個tab
//       for (var i = 0; i < windowClients.length; i++) {
//         var client = windowClients[i];
//         if(client.url === url && 'focus' in client) {
//           return client.focus();
//         }
//       }
//       // 如果沒有，就新增tab
//       if(clients.openWindow) {
//         return clients.openWindow(click_action);
//       }
//     })
//   );
// });