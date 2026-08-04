# Custom Workspace Rules — Student Council Project (sc 69)

1. **Data Persistence & Realtime Synchronization:**
   - All dynamic elements (Exams, Reports/Complaints, Active Theme) are loaded from and persisted to `localStorage` (keys: `sc69_exams`, `sc69_reports`, `sc69_active_theme`, `sc69_admin_session`).
   - Listen to `window.addEventListener('storage', ...)` on both `index.html` (`script.js`) and `admin.html` (`admin.js`) to sync updates live across tabs without losing data.
   - Do NOT reset or overwrite user/admin added data on page reload.

2. **Exam Library & Google Drive Links:**
   - When an Admin adds or edits an exam in `admin.html`, the Google Drive URL is saved in `pdfLink`.
   - The download button on `index.html` opens the Google Drive link (`<a href="${exam.pdfLink}" target="_blank">ดาวน์โหลด PDF</a>`) in a new tab.

3. **Authentic Data & Reports:**
   - Admin Email: `student69@gmail.com`
   - Admin Password: `11222333344444`
   - Placeholders in login forms should remain clean without leaking auto-filled text.
   - Reports in Admin Dashboard must show ONLY actual user submissions from the contact form on `index.html` (no fake/pre-set mock reports).
