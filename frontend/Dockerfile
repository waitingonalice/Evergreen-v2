FROM node:20-alpine as base

RUN apk add --no-cache libc6-compat libc6-compat g++ make py3-pip
WORKDIR /app

FROM base as dev

COPY ./package.json ./yarn.lock /app/
RUN yarn install --frozen-lockfile

FROM base as builder

COPY --from=dev /app/node_modules /app/node_modules
COPY . .
RUN yarn run build

# Production build strips out dev dependencies and only copies the necessary files
FROM base as prod

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder /app/public /app/public
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone /app
COPY --from=builder --chown=nextjs:nodejs /app/.next/static /app/.next/static

USER nextjs

ENV HOSTNAME "0.0.0.0"
ENV PORT 3000
EXPOSE 3000
# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
