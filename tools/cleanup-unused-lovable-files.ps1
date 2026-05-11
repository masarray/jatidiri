# Jalankan dari root project: D:\Git\jatidiri
# Tujuan: hapus file/folder bawaan Lovable/TanStack Start/Cloudflare/shadcn yang tidak dipakai runtime app static.

$ErrorActionPreference = "SilentlyContinue"

Remove-Item -Recurse -Force .\.lovable
Remove-Item -Recurse -Force .\src\components\ui
Remove-Item -Force .\src\server.ts
Remove-Item -Force .\src\start.ts
Remove-Item -Force .\src\lib\error-capture.ts
Remove-Item -Force .\src\lib\utils.ts
Remove-Item -Force .\src\hooks\use-mobile.tsx
Remove-Item -Force .\wrangler.jsonc
Remove-Item -Force .\bun.lock
Remove-Item -Force .\human_energy_map_project_blueprint.md
Remove-Item -Force .\human_pattern_question_bank_v_1.md

Remove-Item -Recurse -Force .\dist
Remove-Item -Recurse -Force .\node_modules\.vite
Remove-Item -Recurse -Force .\.vite
Remove-Item -Recurse -Force .\.tanstack
Remove-Item -Recurse -Force .\.vinxi
Remove-Item -Recurse -Force .\.wrangler
Remove-Item -Recurse -Force .\.output

Write-Host "Cleanup selesai. Jalankan: npm install, lalu npm run build" -ForegroundColor Green
