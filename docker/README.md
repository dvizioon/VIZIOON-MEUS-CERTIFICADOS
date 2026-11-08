# Docker

Mesmo desenho do BREW: `ARG APP_PORT` e `ARG APP_ENV` no Dockerfile, Compose em `production` e `development`, e o `docker/.env` gerado na hora do deploy.

O `.env` da máquina não entra na imagem. O script copia as chaves para `docker/.env`. Portfolio estático: sem banco.

No Coolify o Build Pack **Dockerfile** sempre nomeia a imagem como `{uuid}:{commit}` (ex.: `hiuiesww…:85f17…`). Isso é do Coolify, não do repo.

Pra tagar `vizioon-meus-certificados`:
1. Build Pack **Docker Compose**
2. Compose file: `docker-compose.yml` (na raiz do frontend) ou `docker/production/docker-compose.yaml`
3. O `image: vizioon-meus-certificados:latest` do compose vira o nome da imagem

Container name no painel também pode ser `vizioon-meus-certificados`. Grave as env no painel. Não envie o `.env`.

```bash
cd docker
bash production/deploy.sh
```

Homologação: `bash development/deploy.sh`.
