To install dependencies:
```sh
bun install
```

To run:
```sh
bun run dev
```

open http://localhost:3000

# Database operations
bun run migrate          # Development migrations
bun run migrate:deploy   # Production deployments  
bun run migrate:reset    # Reset database
bun run db:push          # Push schema changes
bun run db:studio        # Open Prisma Studio GUI
bun run db:generate      # Generate Prisma client