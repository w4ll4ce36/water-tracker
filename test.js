document.addEventListener("DOMContentLoaded",function(){
  const btn=document.getElementById("notifyDirectBtn");
  const out=document.getElementById("notifyResult");
  if(!btn || !out) return;

  btn.addEventListener("click",async function(){
    const show=s=>{out.textContent=s;console.log("[notify-test]",s);};
    try{
      show("① 外部JavaScriptのクリック成功");
      if(!("Notification" in window)){show("❌ Notification APIがありません");return;}
      show("② Notification API OK / permission="+Notification.permission);
      let permission=Notification.permission;
      if(permission!=="granted") permission=await Notification.requestPermission();
      show("③ permission="+permission);
      if(permission!=="granted"){show("❌ 通知が許可されていません");return;}
      if(!("serviceWorker" in navigator)){show("❌ Service Worker APIがありません");return;}
      show("④ Service Workerを確認中…");
      const reg=await Promise.race([
        navigator.serviceWorker.getRegistration("./"),
        new Promise((_,reject)=>setTimeout(()=>reject(new Error("Service Worker取得が10秒でタイムアウト")),10000))
      ]);
      if(!reg){show("❌ Service Worker登録が見つかりません");return;}
      show("⑤ Service Worker OK");
      await reg.showNotification("💧 水分管理",{body:"v5.3.8 通知テスト成功！",tag:"water-v538-test"});
      show("⑥ ✅ showNotification() 成功");
    }catch(e){
      console.error("[notify-test]",e);
      show("❌ "+e.name+" / "+e.message);
    }
  });
});
