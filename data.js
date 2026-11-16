
/* ===== DATA.JS - DỮ LIỆU MẶC ĐỊNH =====
Muốn đổi thu nhập mặc định, đổi hũ tiền mặc định -> sửa ở đây */
const DEFAULT_DATA = {
  names:{husband:'Chồng',wife:'Vợ'},
  // SỬA THU NHẬP MẶC ĐỊNH Ở ĐÂY - ví dụ chồng 16tr, vợ 13tr
  // Thu nhập = 1 giao dịch Thu, nên sửa số ở đây là sửa luôn thu nhập
  categories:{Thu:['Lương','Thưởng','Kinh doanh','Khác'],Chi:['Xăng xe','Tiền học cho con','Tiền mua sắm','Ăn uống','Điện nước','Nhà cửa','Khác']},
  envelopes:[
    {id:'xang',name:'Xăng xe',budget:1500000,color:'#f59e0b'},
    {id:'hoc',name:'Tiền học cho con',budget:3000000,color:'#8b5cf6'},
    {id:'mua',name:'Tiền mua sắm',budget:2000000,color:'#ec4899'},
    {id:'an',name:'Ăn uống',budget:4000000,color:'#10b981'},
    {id:'dien',name:'Điện nước',budget:1200000,color:'#3b82f6'},
    {id:'tk',name:'Tiết kiệm',budget:3000000,color:'#0f766e'}
  ],
  tx:[
    {id:1,type:'Thu',person:'Chồng',cat:'Lương',amount:16000000,date:'2026-11-05',note:'Lương tháng 11',env:''},
    {id:2,type:'Thu',person:'Vợ',cat:'Lương',amount:13000000,date:'2026-11-05',note:'Lương tháng 11',env:''},
    {id:3,type:'Chi',person:'Chung',cat:'Xăng xe',amount:900000,date:'2026-11-08',note:'Đổ xăng',env:'xang'},
    {id:4,type:'Chi',person:'Chung',cat:'Tiền học cho con',amount:2500000,date:'2026-11-10',note:'Học thêm',env:'hoc'},
  ]
};
