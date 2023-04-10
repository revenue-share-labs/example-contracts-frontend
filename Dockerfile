# Install dependencies only when needed
FROM node:16-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable
RUN pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM node:16-alpine AS builder
RUN corepack enable

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN pnpm use-prod
RUN pnpm use-docker-config
RUN pnpm build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
RUN corepack enable
WORKDIR /app

ENV NODE_ENV production

# RUN addgroup --system --gid 1001 bloggroup
# RUN adduser --system --uid 1001 bloguser

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=builder /app/.next/ ./.next
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# USER bloguser

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]