# Load dotenv (reads .env file automatically)
load('ext://dotenv', 'dotenv')
dotenv()

# ── PostgreSQL via Docker Compose ─────────────────────────────────────────────
docker_compose('docker-compose.yml')

# ── Create DB if it doesn't exist ─────────────────────────────────────────────
local_resource(
  'create-db',
  cmd='node createDatabase.js',
  resource_deps=['db'],  # wait for postgres container first
)

# ── NestJS Application ─────────────────────────────────────────────────────────
local_resource(
  'nestjs-app',
  serve_cmd='pnpm start:dev',
  resource_deps=['create-db'],
  labels=['app'],
)
