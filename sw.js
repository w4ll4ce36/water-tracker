self.addEventListener("install",event=>{event.waitUntil(self.skipWaiting())});
self.addEventListener("activate",event=>{event.waitUntil(self.clients.claim())});

self.addEventListener("push",event=>{
  let data={};
  try{data=event.data?event.data.json():{}}catch(e){}
  event.waitUntil(self.registration.showNotification(
    data.title||"💧 水分リマインダー",
    {
      body:data.body||"そろそろ水分補給しましょう！",
      tag:data.tag||"water-reminder",
      renotify:true,
      data:{url:"./"}
    }
  ));
});

self.addEventListener("notificationclick",event=>{
  event.notification.close();
  event.waitUntil(
    clients.matchAll({type:"window",includeUncontrolled:true}).then(list=>{
      for(const c of list) if("focus" in c) return c.focus();
      if(clients.openWindow) return clients.openWindow("./");
    })
  );
});