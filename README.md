# Quản Lý Chi Tiêu - Cấu trúc tách thư mục
```
Quan-ly-chi-tieu/
├── index.html      <- KHUNG: chỉ chứa bố cục, không chứa code tính toán
├── css/
│   └── style.css   <- SỬA GIAO DIỆN Ở ĐÂY: màu, bo tròn, font, nút
├── js/
│   ├── data.js     <- SỬA DỮ LIỆU Ở ĐÂY: thu nhập mặc định, hũ tiền mặc định
│   └── app.js      <- SỬA CHỨC NĂNG Ở ĐÂY: thêm nút, thêm tính toán, sửa logic
└── README.md       <- File này
```
## Muốn sửa gì?
- Muốn đổi MÀU, đổi ĐẸP/XẤU -> sửa `css/style.css`
- Muốn đổi SỐ TIỀN mặc định -> sửa `js/data.js`
- Muốn THÊM CHỨC NĂNG -> sửa `js/app.js`
- Muốn đổi CHỮ, đổi TIÊU ĐỀ -> sửa `index.html`
## Muốn sửa thu nhập?
Cách 1 (dễ nhất, không cần code): Mở web -> Tab 💵 Thu nhập -> Gõ số mới -> Lưu
Cách 2: Mở web -> Tab 🧾 Giao dịch -> Bấm Sửa ở dòng Lương
Cách 3 (sửa code): Mở `js/data.js` -> sửa amount
