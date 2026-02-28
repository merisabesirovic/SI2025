# Docker Production Setup

## 1. Prepare environment files

1. Backend secrets/config are in `api/.env` (already wired in code).
2. Copy root env template for compose variables:

```powershell
Copy-Item .env.prod.example .env.prod
```

3. In `.env.prod`, set:

- `DB_SA_PASSWORD` (strong password for SQL Server).

## 2. Start containers

```powershell
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
```

## 3. Access apps

- Frontend: `http://localhost:3000`
- API: `http://localhost:5241`

## 4. Stop containers

```powershell
docker compose --env-file .env.prod -f docker-compose.prod.yml down
```

To remove DB volume too:

```powershell
docker compose --env-file .env.prod -f docker-compose.prod.yml down -v
```
