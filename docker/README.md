# Docker

Mesmo desenho do BREW: `ARG APP_PORT` e `ARG APP_ENV` no Dockerfile, Compose em `production` e `development`, e o `docker/.env` gerado na hora do deploy.

O `.env` da máquina não entra na imagem. O script copia as chaves para `docker/.env`. Portfolio estático: sem banco.

No Coolify: Build Pack Dockerfile, Location `/docker/Dockerfile`, Base `/`. Grave as env no painel. Não envie o `.env`.

```bash
cd docker
bash production/deploy.sh
```

Homologação: `bash development/deploy.sh`.
