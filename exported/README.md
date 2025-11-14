# EduKids Export

Este diretório contém instruções para o ZIP gerado pelo script `scripts/export-project.mjs`.

O arquivo gerado:
- exported/edukids-export.zip

O que o ZIP inclui (se presente no repositório):
- src/ (código-fonte)
- public/ (ativos públicos)
- package.json
- README.md, README_EXPORT.md
- vercel.json, vite.config.ts, index.html
- scripts/ (scripts úteis)
- supabase/ (Edge Functions)
- twa-manifest.json

O que é excluído automaticamente:
- node_modules/
- .git/
- dist/
- build/
- android/

Como gerar o ZIP localmente
1. No terminal, na raiz do projeto (onde está package.json):
   npm install
   npm run export

2. O ZIP será criado em:
   exported/edukids-export.zip

Conectar à plataforma trae.ai
- Faça o upload do arquivo exported/edukids-export.zip no painel do trae.ai conforme as instruções da plataforma.
- Se a plataforma aceitar um repositório Git, você também pode enviar apenas os arquivos listados acima.

Observações
- Se precisar incluir/excluir pastas adicionais (por exemplo `android/`), me diga e eu atualizo o script.
- O script usa a dependência `archiver` (já presente nas dependências do projeto).