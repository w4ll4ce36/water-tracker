document.addEventListener("DOMContentLoaded",function(){
  const btn=document.getElementById("notifyDirectBtn");
  const out=document.getElementById("notifyResult");
  if(!btn || !out) return;

  btn.addEventListener("click",async function(){
    const show=s=>{out.textContent=s;console.log("[notify-test]",s);};

    try{
      show("① 外部JavaScriptのクリック成功");

      if(!("Notification" in window)){
        show("❌ Notification APIがありません");
        return;
      }

      show("② Notification API OK / permission="+Notification.permission);

      let permission=Notification.permission;
      if(permission!=="granted"){
        permission=await Notification.requestPermission();
      }

      show("③ permission="+permission);

      if(permission!=="granted"){
        show("❌ 通知が許可されていません");
        return;
      }

      if(!("serviceWorker" in navigator)){
        show("❌ Service Worker APIがありません");
        return;
      }

      show("④ Service Workerを登録中…");

      const reg=await navigator.serviceWorker.register("./sw.js",{scope:"./"});
      await navigator.serviceWorker.ready;

      if(!reg){
        show("❌ Service Worker登録に失敗しました");
        return;
      }

      show("⑤ Service Worker登録OK");

      await reg.showNotification("💧 水分管理",{
        body:"v5.3.9 通知テスト成功！",
        tag:"water-v539-test"
      });

      show("⑥ ✅ showNotification() 成功");
    }catch(e){
      console.error("[notify-test]",e);
      show("❌ "+e.name+" / "+e.message);
    }
  });
});

document.addEventListener("DOMContentLoaded",function(){
  const msg=document.getElementById("reminderMessage");
  const hours=document.getElementById("reminderHours");
  const save=document.getElementById("saveReminderSettings");
  const result=document.getElementById("reminderSaveResult");
  if(!msg || !hours || !save) return;

  const defaults={message:"💧 そろそろ水分補給しましょう！",hours:2};
  try{
    const saved=JSON.parse(localStorage.getItem("waterReminderSettings")||"null");
    msg.value=(saved&&saved.message)||defaults.message;
    hours.value=(saved&&saved.hours)||defaults.hours;
  }catch(e){
    msg.value=defaults.message;
    hours.value=defaults.hours;
  }

  save.addEventListener("click",function(){
    const data={
      message:(msg.value||defaults.message).trim().slice(0,120),
      hours:Math.max(0.5,Math.min(12,Number(hours.value)||2))
    };
    localStorage.setItem("waterReminderSettings",JSON.stringify(data));
    msg.value=data.message;
    hours.value=data.hours;
    result.textContent="✅ リマインダー設定を保存しました";
  });
});

document.addEventListener("DOMContentLoaded",function(){
  const nowBtn=document.getElementById("testReminderNow");
  const oneBtn=document.getElementById("testReminder1m");
  const result=document.getElementById("reminderTestResult");
  const msg=document.getElementById("reminderMessage");
  if(!nowBtn || !oneBtn || !result || !msg) return;

  async function showReminder(label){
    try{
      if(!("Notification" in window)){
        result.textContent="❌ Notification APIがありません";
        return;
      }
      let permission=Notification.permission;
      if(permission!=="granted") permission=await Notification.requestPermission();
      if(permission!=="granted"){
        result.textContent="❌ 通知が許可されていません";
        return;
      }
      if(!("serviceWorker" in navigator)){
        result.textContent="❌ Service Worker APIがありません";
        return;
      }

      const reg=await navigator.serviceWorker.register("./sw.js",{scope:"./"});
      await navigator.serviceWorker.ready;

      const text=(msg.value||"💧 そろそろ水分補給しましょう！").trim().slice(0,120);
      await reg.showNotification("💧 水分リマインダー",{
        body:text,
        tag:"water-reminder-test",
        data:{test:true}
      });
      result.textContent="✅ "+label+"：通知を送信しました";
    }catch(e){
      console.error("[reminder-test]",e);
      result.textContent="❌ "+e.name+" / "+e.message;
    }
  }

  nowBtn.addEventListener("click",function(){ showReminder("今すぐテスト"); });

  oneBtn.addEventListener("click",function(){
    result.textContent="⏱️ 1分後に通知します…";
    window.setTimeout(function(){
      showReminder("1分テスト");
    },60000);
  });
});
