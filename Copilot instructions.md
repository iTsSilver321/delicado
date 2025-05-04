# AI Instructions: Technical Best Practices for Personalized Textiles Platform

**Objective:** Implement the e-commerce platform adhering to the following technical guidelines and best practices.

**Technologies:**

* **Frontend:** React.js
* **Backend:** Node.js (with Express.js)
* **Database:** PostgreSQL
* **Payment:** Stripe
* **Styling:** Tailwind CSS (preferred) or Bootstrap CSS

**I. Project Structure**

* **Do:** Maintain separate `client` and `server` directories at the root.
* **Do:** Use environment variables (`.env` files, accessed via `process.env` in Node.js) for all secrets (API keys, database URLs, JWT secrets). Load using `dotenv` package on the server.
* **Don't:** Commit `.env` files or hardcode secrets directly in the code.
* **Do:** Organize backend code logically (e.g., `/routes`, `/controllers`, `/services`, `/models`, `/middleware`, `/config`, `/utils`).
* **Do:** Organize frontend code by feature or component type (e.g., `/components`, `/pages` or `/features`, `/hooks`, `/contexts`, `/services`, `/utils`).

**II. React.js (Frontend)**

* **Do:** Use functional components and Hooks (`useState`, `useEffect`, `useContext`, `useReducer`, `useCallback`, `useMemo`).
* **Do:** Break down UI into small, reusable, single-responsibility components.
* **Do:** Use `React Router` for client-side routing.
* **Do:** Manage complex global state with Context API (split contexts by concern) or Zustand/Redux Toolkit. Use `useState`/`useReducer` for local state.
* **Do:** Implement Error Boundaries to catch rendering errors gracefully.
* **Do:** Use `React.lazy` and `Suspense` for code-splitting/lazy loading routes or heavy components.
* **Don't:** Put all global state into a single Context object.
* **Don't:** Forget `key` props when rendering lists.
* **Do:** Perform basic form validation on the client for UX, but *always* re-validate on the server.
* **Do:** Use PropTypes or TypeScript for prop validation.

**III. Node.js (Backend)**

* **Do:** Use `async/await` for all asynchronous operations (DB calls, API requests).
* **Do:** Implement centralized error handling middleware. Catch errors in async routes/middleware and pass them using `next(error)`.
* **Do:** Use an ORM (Prisma preferred, or Sequelize) for database interactions. Define clear models/schemas.
* **Do:** Validate and sanitize *all* incoming request data (body, params, query) using libraries like `Joi`, `express-validator`, or Zod.
* **Do:** Use middleware like `helmet` for security headers and `express-rate-limit` for rate limiting.
* **Do:** Implement robust logging (e.g., using `Winston` or `Pino`).
* **Don't:** Block the event loop with synchronous, long-running operations.
* **Don't:** Write raw SQL queries directly if using an ORM, unless absolutely necessary and properly parameterized.
* **Don't:** Send detailed error stack traces to the client in production environments. Send generic error messages.
* **Do:** Structure APIs following RESTful principles.

**IV. PostgreSQL (Database)**

* **Do:** Use the ORM's migration tools (e.g., `prisma migrate dev`, `sequelize db:migrate`) to manage schema changes. Keep migration files in version control.
* **Do:** Define appropriate data types and constraints (e.g., `NOT NULL`, `UNIQUE`).
* **Do:** Establish clear relationships using foreign keys.
* **Do:** Add indexes to columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses to optimize query performance. Use `EXPLAIN ANALYZE` to check query plans.
* **Do:** Use connection pooling (usually handled by the ORM or a library like `pg-pool`).
* **Don't:** Modify the production database schema manually outside the migration system.
* **Don't:** Store sensitive data like plain-text passwords (use hashing like `bcrypt`).

**V. Stripe (Payment)**

* **Do:** Keep Stripe Secret Keys exclusively on the server, loaded from environment variables.
* **Do:** Use Stripe Elements (`@stripe/react-stripe-js`) or Stripe Checkout on the React frontend to collect payment details securely (minimizes PCI scope).
* **Do:** Implement the Payment Intents API flow: Create the `PaymentIntent` on the server, pass the `client_secret` to the client, and use Stripe.js on the client to confirm the payment.
* **Do:** Create a dedicated server endpoint (webhook handler) to receive and process Stripe events (e.g., `payment_intent.succeeded`, `charge.failed`).
* **Do:** **Verify webhook signatures** on the server endpoint using your Stripe webhook signing secret to ensure authenticity.
* **Do:** Make webhook processing idempotent (e.g., check if an order update has already been processed based on the event ID) to handle potential duplicate events.
* **Don't:** Send the Stripe Secret Key to the frontend.
* **Don't:** Rely solely on client-side redirects after payment confirmation to fulfill orders; use webhooks as the source of truth.

**VI. Styling (Tailwind CSS / Bootstrap)**

* **Do (Tailwind):** Leverage utility classes directly in JSX. Use `tailwind.config.js` for customization. Ensure production builds are purged of unused styles. Extract reusable patterns into React components.
* **Do (Bootstrap):** Use the grid system for layout. Customize via Sass variables. Import only necessary components.
* **Do (Both):** Ensure the UI is fully responsive across mobile, tablet, and desktop screens. Prioritize accessibility (semantic HTML, contrast, keyboard navigation).

**General:**

* **Do:** Write clean, well-commented code.
* **Do:** Ensure consistent code style (use linters like ESLint and formatters like Prettier).
* **Do:** Implement comprehensive error handling across the stack.