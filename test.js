document.addEventListener("DOMContentLoaded",function(){
  const btn=document.getElementById("jsTestBtn");
  const out=document.getElementById("notifyResult");
  if(!btn || !out) return;
  btn.addEventListener("click",function(){
    out.textContent="✅ 外部JavaScript OK";
  });
});
