// ============================================
// ⚙️ FILE CHỨC NĂNG DUY NHẤT - SỬA NÚT BẤM, TÍNH TOÁN Ở ĐÂY
// Muốn thêm chức năng mới -> chỉ sửa file này
// Dữ liệu nằm ở js/data.js, giao diện nằm ở index.html
// ============================================
function save(){localStorage.setItem('gd_chitieu_v2',JSON.stringify(state));}
function fmt(n){return new Intl.NumberFormat('vi-VN').format(n||0)+' ₫'}
let curType='Thu', editingId=null;
let chart1, chart2;
function monthVal(){return document.getElementById('monthPicker').value || new Date().toISOString().slice(0,7)}
function setMonthDefault(){let el=document.getElementById('monthPicker'); if(!el.value) el.value='2026-11'; document.getElementById('fDate').value='2026-11-16';}
function showTab(id,btn){document.querySelectorAll('[id^="tab-"]').forEach(e=>e.classList.add('hidden')); document.getElementById('tab-'+id).classList.remove('hidden'); document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); render();}
function openModal(id=null){editingId=id; document.getElementById('modal').style.display='flex'; if(id){let t=state.tx.find(x=>x.id==id); curType=t.type; document.getElementById('fPerson').value=t.person; document.getElementById('fAmount').value=t.amount; document.getElementById('fDate').value=t.date; document.getElementById('fNote').value=t.note; document.getElementById('modalTitle').textContent='Sửa giao dịch'; refreshCatSelect(t.cat); document.getElementById('fEnvelope').value=t.env||'';} else {curType='Thu'; document.getElementById('fAmount').value=''; document.getElementById('fNote').value=''; document.getElementById('modalTitle').textContent='Thêm giao dịch'; refreshCatSelect();} setType(curType);}
function closeModal(){document.getElementById('modal').style.display='none'}
function setType(t){curType=t; document.getElementById('btnThu').className=t=='Thu'?'btn':'btn2'; document.getElementById('btnChi').className=t=='Chi'?'btn !bg-red-600':'btn2'; refreshCatSelect();}
function refreshCatSelect(sel){let c=document.getElementById('fCat'); c.innerHTML=state.categories[curType].map(x=>`<option ${x==sel?'selected':''}>${x}</option>`).join(''); let e=document.getElementById('fEnvelope'); e.innerHTML='<option value="">Không chọn hũ</option>'+state.envelopes.map(x=>`<option value="${x.id}">${x.name}</option>`).join('');}
function saveTx(){
 let amt=parseInt(document.getElementById('fAmount').value||0); if(!amt) return alert('Nhập số tiền');
 let obj={type:curType,person:document.getElementById('fPerson').value,cat:document.getElementById('fCat').value,env:document.getElementById('fEnvelope').value,amount:amt,date:document.getElementById('fDate').value||new Date().toISOString().slice(0,10),note:document.getElementById('fNote').value||document.getElementById('fCat').value};
 if(editingId){let t=state.tx.find(x=>x.id==editingId); Object.assign(t,obj);} else {obj.id=Date.now(); state.tx.push(obj);}
 save(); closeModal(); render();
}
function delTx(id){if(confirm('Xóa giao dịch này?')){state.tx=state.tx.filter(x=>x.id!=id); save(); render();}}
function addEnvelope(){let n=prompt('Tên hũ mới (VD: Tiền biếu):'); if(!n) return; let b=parseInt(prompt('Ngân sách tháng (VD: 1000000):')||'0'); state.envelopes.push({id:'e'+Date.now(),name:n,budget:b||0,color:'#0f766e'}); save(); render();}
function editEnvelope(id){let e=state.envelopes.find(x=>x.id==id); let n=prompt('Đổi tên hũ:',e.name); if(n) e.name=n; let b=prompt('Đổi ngân sách:',e.budget); if(b!==null) e.budget=parseInt(b)||0; save(); render();}
function delEnvelope(id){if(confirm('Xóa hũ này? Giao dịch cũ vẫn giữ nguyên.')){state.envelopes=state.envelopes.filter(x=>x.id!=id); save(); render();}}
function addCategory(type){let n=prompt('Tên danh mục '+type+' mới:'); if(!n) return; if(!state.categories[type].includes(n)) state.categories[type].push(n); save(); render();}
function editCategory(type,old){let n=prompt('Đổi tên danh mục:',old); if(n && n!==old){state.categories[type]=state.categories[type].map(x=>x==old?n:x); save(); render();}}
function delCategory(type,old){if(confirm('Xóa danh mục '+old+'? Giao dịch cũ vẫn giữ nguyên.')){state.categories[type]=state.categories[type].filter(x=>x!=old); save(); render();}}
function saveNames(){state.names.husband=document.getElementById('nameHusband').value||'Chồng'; state.names.wife=document.getElementById('nameWife').value||'Vợ'; save(); render(); alert('Đã lưu tên!');}
function exportData(){let b=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); let a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='quan-ly-chi-tieu.json'; a.click();}
function importData(e){let f=e.target.files[0]; if(!f) return; let r=new FileReader(); r.onload=()=>{try{state=JSON.parse(r.result); save(); render(); alert('Nhập xong!');}catch{alert('File không đúng')}}; r.readAsText(f);}
function resetData(){if(confirm('Xóa hết dữ liệu?')){localStorage.removeItem('gd_chitieu_v2'); location.reload();}}
function monthStats(m){let tx=state.tx.filter(x=>x.date.slice(0,7)==m); let inH=tx.filter(x=>x.type=='Thu'&&x.person=='Chồng').reduce((s,x)=>s+x.amount,0); let inW=tx.filter(x=>x.type=='Thu'&&x.person=='Vợ').reduce((s,x)=>s+x.amount,0); let inC=tx.filter(x=>x.type=='Thu'&&x.person=='Chung').reduce((s,x)=>s+x.amount,0); let totalIn=inH+inW+inC; let totalOut=tx.filter(x=>x.type=='Chi').reduce((s,x)=>s+x.amount,0); return {tx,inH,inW,totalIn,totalOut,bal:totalIn-totalOut};}
function render(){
 let m=monthVal(); let s=monthStats(m);
 document.getElementById('incHusband').textContent=fmt(s.inH);
 document.getElementById('incWife').textContent=fmt(s.inW);
 document.getElementById('totalIn').textContent=fmt(s.totalIn);
 document.getElementById('totalOut').textContent=fmt(s.totalOut);
 document.getElementById('balance').textContent=fmt(s.bal);
 document.getElementById('monthLabel1').textContent='Tháng '+m;
 document.getElementById('incHusbandCount').textContent=state.names.husband+' • '+s.tx.filter(x=>x.type=='Thu'&&x.person=='Chồng').length+' khoản';
 document.getElementById('incWifeCount').textContent=state.names.wife+' • '+s.tx.filter(x=>x.type=='Thu'&&x.person=='Vợ').length+' khoản';
 document.getElementById('expenseRatio').textContent=s.totalIn?('Chi '+Math.round(s.totalOut/s.totalIn*100)+'% thu nhập'):'';
 let pct=s.totalIn?Math.max(0,Math.min(100,s.bal/s.totalIn*100)):0; document.getElementById('balanceBar').style.width=pct+'%'; document.getElementById('balanceNote').textContent=s.bal>=0?'Còn dư '+Math.round(pct)+'%':'⚠ Chi vượt thu!';
 // top3
 let top=[...s.tx].filter(x=>x.type=='Chi').sort((a,b)=>b.amount-a.amount).slice(0,3);
 document.getElementById('top3').innerHTML=top.length?top.map((t,i)=>`<div class="flex justify-between py-2 border-b"><span>${i+1}. ${t.note} • ${t.cat} • ${t.date}</span><b class="text-red-600">${fmt(t.amount)}</b></div>`).join(''):'<p class="text-slate-400 text-sm">Chưa có khoản chi nào tháng này</p>';
 // envelopes overview + list
 let envHtml=state.envelopes.map(e=>{let spent=s.tx.filter(x=>x.type=='Chi'&&x.env==e.id).reduce((a,x)=>a+x.amount,0); let left=e.budget-spent; let p=e.budget?Math.min(100,spent/e.budget*100):0; let color=left<0?'#dc2626':e.color; return `<div class="card !p-3"><div class="flex justify-between"><b>${e.name}</b><span class="badge" style="background:${e.color}22;color:${e.color}">${Math.round(p)}%</span></div><p class="text-xs mt-1">Đã chi: <b>${fmt(spent)}</b> / Ngân sách: ${fmt(e.budget)}</p><div class="progress mt-2"><div style="background:${color};width:${p}%"></div></div><p class="text-xs mt-1">Còn lại: <b style="color:${color}">${fmt(left)}</b> ${left<0?'⚠ Vượt ngân sách!':''}</p></div>`}).join('');
 document.getElementById('envelopeOverview').innerHTML=envHtml;
 document.getElementById('envelopeList').innerHTML=state.envelopes.map(e=>{let spent=s.tx.filter(x=>x.type=='Chi'&&x.env==e.id).reduce((a,x)=>a+x.amount,0); return `<div class="card"><div class="flex justify-between"><b>${e.name}</b><div class="flex gap-1"><button class="btn2 !py-1 !px-2 text-xs" onclick="editEnvelope('${e.id}')">Sửa</button><button class="btn2 !py-1 !px-2 text-xs !bg-red-50 !text-red-600" onclick="delEnvelope('${e.id}')">Xóa</button></div></div><p class="text-sm mt-2">Ngân sách: ${fmt(e.budget)} • Đã chi tháng này: ${fmt(spent)}</p></div>`}).join('');
 // categories
 document.getElementById('catIn').innerHTML=state.categories.Thu.map(c=>`<div class="flex justify-between items-center bg-slate-50 p-2 rounded-lg"><span>💰 ${c}</span><span class="flex gap-1"><button class="btn2 !py-1 !px-2 text-xs" onclick="editCategory('Thu','${c}')">Sửa</button><button class="btn2 !py-1 !px-2 text-xs !bg-red-50 !text-red-600" onclick="delCategory('Thu','${c}')">Xóa</button></span></div>`).join('');
 document.getElementById('catOut').innerHTML=state.categories.Chi.map(c=>`<div class="flex justify-between items-center bg-slate-50 p-2 rounded-lg"><span>🛒 ${c}</span><span class="flex gap-1"><button class="btn2 !py-1 !px-2 text-xs" onclick="editCategory('Chi','${c}')">Sửa</button><button class="btn2 !py-1 !px-2 text-xs !bg-red-50 !text-red-600" onclick="delCategory('Chi','${c}')">Xóa</button></span></div>`).join('');
 // tx list
 let q=(document.getElementById('searchTx').value||'').toLowerCase(); let fc=document.getElementById('filterCat').value; let fp=document.getElementById('filterPerson').value; let ft=document.getElementById('filterType').value;
 let fcSel=document.getElementById('filterCat'); let allCats=[...new Set(state.tx.map(x=>x.cat))]; fcSel.innerHTML='<option value="">Tất cả danh mục</option>'+allCats.map(c=>`<option ${c==fc?'selected':''}>${c}</option>`).join('');
 let list=s.tx.filter(x=>(!q||(x.note+x.cat).toLowerCase().includes(q))&&(!fc||x.cat==fc)&&(!fp||x.person==fp)&&(!ft||x.type==ft)).sort((a,b)=>b.date.localeCompare(a.date));
 document.getElementById('txList').innerHTML=list.length?list.map(t=>`<div class="flex justify-between items-center py-2 border-b"><div><p class="font-bold">${t.type=='Thu'?'⬆':'⬇'} ${t.note} <span class="badge bg-slate-100">${t.cat}</span> <span class="badge bg-blue-50 text-blue-700">${t.person}</span></p><p class="text-xs text-slate-500">${t.date}</p></div><div class="flex gap-2 items-center"><b class="${t.type=='Thu'?'text-emerald-600':'text-red-600'}">${t.type=='Thu'?'+':'-'}${fmt(t.amount)}</b><button class="btn2 !py-1 !px-2 text-xs" onclick="openModal(${t.id})">Sửa</button><button class="btn2 !py-1 !px-2 text-xs !bg-red-50 !text-red-600" onclick="delTx(${t.id})">Xóa</button></div></div>`).join(''):'<p class="text-slate-400 text-sm">Chưa có giao dịch nào.</p>';
 // stats table + best
 let months=[...new Set(state.tx.map(x=>x.date.slice(0,7)))].sort();
 let rows=months.map(mm=>{let st=monthStats(mm); return {m:mm,...st}}).reverse();
 document.getElementById('monthTable').innerHTML='<table class="w-full text-sm"><tr class="bg-slate-100"><th class="p-2 text-left">Tháng</th><th class="p-2 text-right">Thu chồng</th><th class="p-2 text-right">Thu vợ</th><th class="p-2 text-right">Tổng thu</th><th class="p-2 text-right">Tổng chi</th><th class="p-2 text-right">Còn lại</th></tr>'+rows.map(r=>`<tr class="border-b"><td class="p-2 font-bold">${r.m}</td><td class="p-2 text-right">${fmt(r.inH)}</td><td class="p-2 text-right">${fmt(r.inW)}</td><td class="p-2 text-right text-emerald-600 font-bold">${fmt(r.totalIn)}</td><td class="p-2 text-right text-red-600 font-bold">${fmt(r.totalOut)}</td><td class="p-2 text-right font-bold">${fmt(r.bal)}</td></tr>`).join('')+'</table>';
 if(rows.length){let bi=[...rows].sort((a,b)=>b.totalIn-a.totalIn)[0]; let bo=[...rows].sort((a,b)=>b.totalOut-a.totalOut)[0]; let bs=[...rows].sort((a,b)=>b.bal-a.bal)[0]; document.getElementById('bestIn').textContent=bi.m+' • '+fmt(bi.totalIn); document.getElementById('bestOut').textContent=bo.m+' • '+fmt(bo.totalOut); document.getElementById('bestSave').textContent=bs.m+' • '+fmt(bs.bal);}
 // charts
 let labels=months.slice(-12); let inData=labels.map(mm=>monthStats(mm).totalIn); let outData=labels.map(mm=>monthStats(mm).totalOut);
 if(chart1) chart1.destroy(); chart1=new Chart(document.getElementById('chartMonth'),{type:'bar',data:{labels,datasets:[{label:'Thu',data:inData,backgroundColor:'#10b981'},{label:'Chi',data:outData,backgroundColor:'#ef4444'}]},options:{responsive:true,plugins:{legend:{position:'bottom'}}}});
 let catMap={}; s.tx.filter(x=>x.type=='Chi').forEach(x=>catMap[x.cat]=(catMap[x.cat]||0)+x.amount);
 if(chart2) chart2.destroy(); chart2=new Chart(document.getElementById('chartCat'),{type:'doughnut',data:{labels:Object.keys(catMap),datasets:[{data:Object.values(catMap),backgroundColor:['#f59e0b','#8b5cf6','#ec4899','#10b981','#3b82f6','#ef4444','#f97316']}]},options:{responsive:true,plugins:{legend:{position:'bottom'}}}});
 document.getElementById('nameHusband').value=state.names.husband; document.getElementById('nameWife').value=state.names.wife;
}
document.getElementById('monthPicker').addEventListener('change',render);
setMonthDefault(); render();
