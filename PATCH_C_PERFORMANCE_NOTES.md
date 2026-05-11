# Patch C — Performance & Startup Lightening

Tujuan patch ini: membuat awal web app lebih ringan dan mengurangi risiko Chrome menampilkan **Page Unresponsive**.

Perubahan utama:

1. Menghapus runtime dependency berat dari jalur awal:
   - `framer-motion` diganti CSS transition ringan.
   - `recharts` diganti visual bar sederhana tanpa library chart.
   - `@tanstack/react-query` dihapus karena belum dipakai.
   - TanStack Start / Cloudflare / Lovable config tidak dipakai lagi untuk static GitHub Pages.

2. `vite.config.ts` disederhanakan menjadi Vite React static app.

3. `src/routes/__root.tsx` disederhanakan menjadi SPA root biasa, tanpa `shellComponent`, `HeadContent`, dan `Scripts`.

4. `src/store/assessmentStore.ts` diberi sanitasi localStorage agar data lama/corrupt tidak membebani startup.

5. `ClusterRadar` diganti menjadi bar comparison ringan supaya result page tetap readable tanpa Recharts.

Setelah apply replacement files, jalankan cleanup opsional:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\cleanup-unused-lovable-files.ps1
```

Lalu:

```powershell
npm install
npm run build
npm run dev
```

Jika browser masih berat karena localStorage lama, jalankan di DevTools Console:

```js
localStorage.removeItem('peta-jati-diri-v1')
location.reload()
```
