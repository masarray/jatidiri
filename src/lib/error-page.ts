export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <title>Halaman gagal dimuat — Peta Jati Diri</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #faf8f1; color: #172033; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; background: #fff; border: 1px solid #ece4d7; border-radius: 1.5rem; box-shadow: 0 16px 40px rgba(23, 32, 51, .08); }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #687083; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.65rem 1rem; border-radius: 0.875rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #287078; color: #fff; }
      .secondary { background: #fff; color: #172033; border-color: #d8d0c5; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Halaman gagal dimuat</h1>
      <p>Terjadi kendala saat memuat Peta Jati Diri. Coba muat ulang, atau kembali ke beranda.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Coba lagi</button>
        <a class="secondary" href="/">Ke beranda</a>
      </div>
    </div>
  </body>
</html>`;
}
