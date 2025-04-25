# Node-Express-Prisma

This example is for strating project using Node, Express, and Prisma.

## How to Start
### Setup DB
```bash
cd container

# start postgres db in docker
docker compose up -d
```

### Start developing 
```bash
npm i

# setup prisma/schema.prisma

# initialize primsa
npx prisma generate
npx prisma migrate dev

npm run dev
```
