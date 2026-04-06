# finance dashboard system
The system demonstrate role base access, advance pagination, clean and maintainable code, rate limiting, performance optimization and importantly a well structure codebase.

## Core features
- Role base access with well structure implementation.
- Secure authentication with jwt access and refresh token.
- Advance pagination for getting summary of records.
- Well structure, consistent and predictable APIs with best practices.
- Rate-limit implementation with easily maintainable clean code.
- Easy to setup locally with Docker.

## Tech stack
- Backend: Node.js, TypeScript, NestJS
- Database: PostgreSQL, Prisma ORM
- Rate-limit: Redis, rate-limiter-flexible
- Package Manager: pnpm
- Tool: Docker

## Setup instructions
To run the app with Docker run:
```bash
   docker compose up
   ```
Alternative way of running the app:
1. Clone the repository  
   ```bash
   git clone https://github.com/mdarkanurl/finance-dashboard-system.git
   ```
2. Install dependencies
   ```bash
   pnpm install --frozen-lockfile
   ```
3. Add environment variable
   create a `.env` file and add the variable. Use `.env.example` for guidance.

4. Setup database
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Run the app
   ```bash
   pnpm run start:dev   # development
   pnpm run build && pnpm run start  # production
   ```

## API documentation
- Base URL: `/api/v1`
- Authentication: JWT access token and refresh token stored in cookies
- Main endpoints:
  - `/auth` for signup, signin, refresh and logout
  - `/users` for admin user management
  - `/records` for record CRUD and pagination
  - `/dashboard` for summary, trends, recent transactions and categories

## API Response Format
All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "...",
  "data": { ... },
  "error": null
}
```

### Error Response
```json
{
  "success": false,
  "message": "...",
  "data": null,
  "error": { ... }
}
```

## Contributing
Contributions, issues, and feature requests are welcome!
If you want to contribute to Find Decisions, please follow the guidelines outlined in the [contributing.md](contributing.md) file.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
