
/* ===== APP.JS - SỬA CHỨC NĂNG Ở ĐÂY =====
Muốn thêm chức năng (ví dụ thêm nút, thêm tính toán) -> sửa file này
Muốn sửa giao diện -> ĐỪNG sửa ở đây, qua css/style.css */
let state = JSON.parse(localStorage.getItem('gd_v3')||'null') || JSON.parse(JSON.stringify(DEFAULT_DATA));
function save(){localStorage.setItem('gd_v3',JSON.stringify(state));}
function fmt(n){return new Intl.NumberFormat('vi-VN').format(n||0)+' ₫'}
let curType='Thu', editingId=null, chart1, chart2;
function monthVal(){return document.getElementById('monthPicker').value||'2026-11'}
function showTab(id,btn){document.querySelectorAll('[id^="tab-"]').forEach(e=>e.classList.add('hidden'));document.getElementById('tab-'+id).classList.remove('hidden');document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');render();}
// --- SỬA THU NHẬP TRỰC TIẾP: 2 ô này ---
function saveIncome(){
  let h=parseInt(document.getElementById('editIncHusband').value||0);
  let w=parseInt(document.getElementById('editIncWife').value||0);
  let m=monthVal();
  // Xóa lương cũ tháng này, thêm lương mới
  state.tx = state.tx.filter(x=>!(x.date.slice(0,7)==m && x.type=='Thu' && x.cat=='Lương'));
  if(h>0) state.tx.push({id:Date.now(),type:'Thu',person:'Chồng',cat:'Lương',amount:h,date:m+'-05',note:'Lương '+state.names.husband,env:''});
  if(w>0) state.tx.push({id:Date.now()+1,type:'Thu',person:'Vợ',cat:'Lương',amount:w,date:m+'-05',note:'Lương '+state.names.wife,env:''});
  save(); render(); alert('Đã lưu thu nhập tháng '+m+'!');
}
function openModal(id=null){
  editingId=id; document.getElementById('modal').style.display='flex';
  if(id){let t=state.tx.find(x=>x.id==id); curType=t.type; document.getElementById('fPerson').value=t.person; document.getElementById('fAmount').value=t.amount; document.getElementById('fDate').value=t.date; document.getElementById('fNote').value=t.note; document.getElementById('modalTitle').textContent='Sửa giao dịch - '+t.note; refreshCat(t.cat); document.getElementById('fEnvelope').value=t.env||'';}
  else{curType='Thu'; document.getElementById('fAmount').value=''; document.getElementById('fNote').value=''; document.getElementById('modalTitle').textContent='Thêm giao dịch'; refreshCat();}
  setType(curType);
}
function closeModal(){document.getElementById('modal').style.display='none'}
function setType(t){curType=t; document.getElementById('btnThu').className=t=='Thu'?'btn':'btn2'; document.getElementById('btnChi').className=t=='Chi'?'btn !bg-red-600':'btn2'; refreshCat();}
function refreshCat(sel){let c=document.getElementById('fCat'); c.innerHTML=state.categories[curType].map(x=>`<option ${x==sel?'selected':''}>${x}</option>`).join(''); let e=document.getElementById('fEnvelope'); e.innerHTML='<option value="">Không chọn hũ</option>'+state.envelopes.map(x=>`<option value="${x.id}">${x.name}</option>`).join('');}
function saveTx(){
  let amt=parseInt(document.getElementById('fAmount').value||0); if(!amt) return alert('Nhập số tiền');
  let obj={type:curType,person:document.getElementById('fPerson').value,cat:document.getElementById('fCat').value,env:document.getElementById('fEnvelope').value,amount:amt,date:document.getElementById('fDate').value||'2026-11-16',note:document.getElementById('fNote').value||document.getElementById('fCat').value};
  if(editingId){Object.assign(state.tx.find(x=>x.id==editingId),obj);} else {obj.id=Date.now(); state.tx.push(obj);}
  save(); closeModal(); render();
}
function delTx(id){if(confirm('Xóa giao dịch này?')){state.tx=state.tx.filter(x=>x.id!=id); save(); render();}}
function addEnvelope(){let n=prompt('Tên hũ mới:'); if(!n) return; let b=parseInt(prompt('Ngân sách tháng:')||'0'); state.envelopes.push({id:'e'+Date.now(),name:n,budget:b||0,color:'#0f766e'}); save(); render();}
function editEnvelope(id){let e=state.envelopes.find(x=>x.id==id); let n=prompt('Đổi tên hũ:',e.name); if(n) e.name=n; let b=prompt('Đổi ngân sách:',e.budget); if(b!==null) e.budget=parseInt(b)||0; save(); render();}
function delEnvelope(id){if(confirm('Xóa hũ? Giao dịch cũ vẫn giữ.')){state.envelopes=state.envelopes.filter(x=>x.id!=id); save(); render();}}
function addCategory(t){let n=prompt('Tên danh mục '+t+' mới:'); if(n && !state.categories[t].includes(n)) state.categories[t].push(n); save(); render();}
function editCategory(t,old){let n=prompt('Đổi tên:',old); if(n) state.categories[t]=state.categories[t].map(x=>x==old?n:x); save(); render();}
function delCategory(t,old){if(confirm('Xóa '+old+'?')){state.categories[t]=state.categories[t].filter(x=>x!=old); save(); render();}}
function saveNames(){state.names.husband=document.getElementById('nameHusband').value||'Chồng'; state.names.wife=document.getElementById('nameWife').value||'Vợ'; save(); render();}
function monthStats(m){let tx=state.tx.filter(x=>x.date.slice(0,7)==m); let inH=tx.filter(x=>x.type=='Thu'&&x.person=='Chồng').reduce((s,x)=>s+x.amount,0); let inW=tx.filter(x=>x.type=='Thu'&&x.person=='Vợ').reduce((s,x)=>s+x.amount,0); let inC=tx.filter(x=>x.type=='Thu'&&x.person=='Chung').reduce((s,x)=>s+x.amount,0); let totalIn=inH+inW+inC; let totalOut=tx.filter(x=>x.type=='Chi').reduce((s,x)=>s+x.amount,0); return {tx,inH,inW,totalIn,totalOut,bal:totalIn-totalOut};}
function render(){
  let m=monthVal(); let s=monthStats(m);
  document.getElementById('incHusband').textContent=fmt(s.inH);
  document.getElementById('incWife').textContent=fmt(s.inW);
  document.getElementById('totalIn').textContent=fmt(s.totalIn);
  document.getElementById('totalOut').textContent=fmt(s.totalOut);
  document.getElementById('balance').textContent=fmt(s.bal);
  document.getElementById('editIncHusband').value=s.inH||''; document.getElementById('editIncWife').value=s.inW||'';
  document.getElementById('nameHusband').value=state.names.husband; document.getElementById('nameWife').value=state.names.wife;
  // hũ
  document.getElementById('envelopeList').innerHTML=state.envelopes.map(e=>{let spent=s.tx.filter(x=>x.type=='Chi'&&x.env==e.id).reduce((a,x)=>a+x.amount,0); let p=e.budget?Math.min(100,spent/e.budget*100):0; return `<div class="card"><div class="flex justify-between"><b>${e.name}</b><div class="flex gap-1"><button class="btn2 !py-1 !px-2 text-xs" onclick="editEnvelope('${e.id}')">Sửa</button><button class="btn2 !py-1 !px-2 text-xs !bg-red-50 !text-red-600" onclick="delEnvelope('${e.id}')">Xóa</button></div></div><p class="text-sm mt-2">Ngân sách: ${fmt(e.budget)} • Đã chi: ${fmt(spent)} • Còn: ${fmt(e.budget-spent)}</p><div class="progress mt-2"><div style="background:${e.color};width:${p}%"></div></div></div>`}).join('');
  // danh mục
  document.getElementById('catIn').innerHTML=state.categories.Thu.map(c=>`<div class="flex justify-between bg-slate-50 p-2 rounded-lg"><span>💰 ${c}</span><span class="flex gap-1"><button class="btn2 !py-1 !px-2 text-xs" onclick="editCategory('Thu','${c}')">Sửa</button><button class="btn2 !py-1 !px-2 text-xs !bg-red-50 !text-red-600" onclick="delCategory('Thu','${c}')">Xóa</button></span></div>`).join('');
  document.getElementById('catOut').innerHTML=state.categories.Chi.map(c=>`<div class="flex justify-between bg-slate-50 p-2 rounded-lg"><span>🛒 ${c}</span><span class="flex gap-1"><button class="btn2 !py-1 !px-2 text-xs" onclick="editCategory('Chi','${c}')">Sửa</button><button class="btn2 !py-1 !px-2 text-xs !bg-red-50 !text-red-600" onclick="delCategory('Chi','${c}')">Xóa</button></span></div>`).join('');
  // giao dịch
  let list=[...s.tx].sort((a,b)=>b.date.localeCompare(a.date));
  document.getElementById('txList').innerHTML=list.length?list.map(t=>`<div class="flex justify-between items-center py-2 border-b"><div><p class="font-bold">${t.type=='Thu'?'⬆':'⬇'} ${t.note} <span class="badge">${t.cat}</span> <span class="badge">${t.person}</span></p><p class="text-xs text-slate-500">${t.date}</p></div><div class="flex gap-2 items-center"><b class="${t.type=='Thu'?'text-emerald-600':'text-red-600'}">${t.type=='Thu'?'+':'-'}${fmt(t.amount)}</b><button class="btn2 !py-1 !px-2 text-xs" onclick="openModal(${t.id})">✏️ Sửa</button><button class="btn2 !py-1 !px-2 text-xs !bg-red-50 !text-red-600" onclick="delTx(${t.id})">Xóa</button></div></div>`).join(''):'<p class="text-slate-400">Chưa có giao dịch tháng này</p>';
  // chart
  let months=[...new Set(state.tx.map(x=>x.date.slice(0,7)))].sort().slice(-12);
  if(chart1) chart1.destroy(); chart1=new Chart(document.getElementById('chartMonth'),{type:'bar',data:{labels:months,datasets:[{label:'Thu',data:months.map(mm=>monthStats(mm).totalIn),backgroundColor:'#10b981'},{label:'Chi',data:months.map(mm=>monthStats(mm).totalOut),backgroundColor:'#ef4444'}]}});
  let catMap={}; s.tx.filter(x=>x.type=='Chi').forEach(x=>catMap[x.cat]=(catMap[x.cat]||0)+x.amount);
  if(chart2) chart2.destroy(); chart2=new Chart(document.getElementById('chartCat'),{type:'doughnut',data:{labels:Object.keys(catMap),datasets:[{data:Object.values(catMap),backgroundColor:['#f59e0b','#8b5cf6','#ec4899','#10b981','#3b82f6','#ef4444']}]}});
  // bảng tháng
  let allMonths=[...new Set(state.tx.map(x=>x.date.slice(0,7)))].sort().reverse();
  document.getElementById('monthTable').innerHTML='<table class="w-full text-sm"><tr class="bg-slate-100"><th class="p-2 text-left">Tháng</th><th class="p-2 text-right">Thu chồng</th><th class="p-2 text-right">Thu vợ</th><th class="p-2 text-right">Tổng thu</th><th class="p-2 text-right">Tổng chi</th><th class="p-2 text-right">Còn lại</th></tr>'+allMonths.map(mm=>{let st=monthStats(mm); return `<tr class="border-b"><td class="p-2 font-bold">${mm}</td><td class="p-2 text-right">${fmt(st.inH)}</td><td class="p-2 text-right">${fmt(st.inW)}</td><td class="p-2 text-right text-emerald-600 font-bold">${fmt(st.totalIn)}</td><td class="p-2 text-right text-red-600 font-bold">${fmt(st.totalOut)}</td><td class="p-2 text-right font-bold">${fmt(st.bal)}</td></tr>`}).join('')+'</table>';
}
document.getElementById('monthPicker').addEventListener('change',render);
render();
