Gerar pasta/ZIP pronta para upload (Export do projeto)
=====================================================

O repositório já inclui um utilitário para empacotar todo o projeto (exceto node_modules e .git) em um arquivo ZIP pronto para você fazer upload em outra plataforma.

Arquivos importantes
- scripts/package-app.mjs — script Node que cria dist/edukids-app.zip
- package.json — contém o script "package-app" (npm run package-app)
- dist/edukids-app.zip — saída esperada após executar o script

Como gerar o ZIP (passos)
1. Abra um terminal na pasta raiz do projeto.
2. Instale dependências (uma vez):
   npm install
3. Gere o pacote:
   npm run package-app
4. Depois do script terminar, o ZIP estará em:
   dist/edukids-app.zip

Observações
- O ZIP contém todo o projeto exceto node_modules, .git, dist, build e alguns arquivos temporários.
- Para subir apenas a pasta (não um ZIP), descompacte dist/edukids-app.zip e use a pasta resultante.
- Se quiser ajustar exclusões ou o nome do arquivo, edite scripts/package-app.mjs.

Problemas comuns
- Se o script reclamar de falta do pacote 'archiver', instale-o:
  npm install archiver
- Se você quiser acelerar: rode o script em um ambiente com Node.js 18+.

Se preferir, posso ajustar o comportamento do script (incluir/excluir arquivos, mudar destino, gerar uma pasta em vez de ZIP). Diga exatamente o formato que você precisa (zip ou pasta), e eu atualizo o script.