# CTNET: Clinical Trial Network Ethiopia

A comprehensive web application built for managing clinical trial information, research updates, and community engagement in Ethiopia. CTNET combines a modern React/Vite frontend with a Node.js/Express backend and PostgreSQL database support.

## Features

### Public Features
- **Clinical Trial Registry**: Browse and search registered clinical trials with details on title, phase, status, and timelines.
- **News & Events**: Read the latest announcements and upcoming events.
- **Partners Section**: Display collaborating institutions and partner organizations.
- **Resources Library**: Share guidelines, directives, documents, and Google Drive previews.
- **Team Directory**: Showcase the professionals supporting CTNET.
- **Volunteer Registration**: Let users sign up to participate as volunteers.
- **Contact Form**: Collect inquiries and feedback from visitors.

### Admin Features (Protected)
- **Content Management**: Create, read, update, and delete news, events, partners, resources, and team member entries.
- **Admin Authentication**: Secure login and session handling for administrators.
- **Email Notifications**: Send admin credential emails using SMTP.
- **Audit Logging**: Record administrative activity to a log file for accountability.
- **Session Timeout**: Protect admin sessions with idle timeout settings.
- **Partner Applications**: Receive and review inbound partnership requests.

## Technology Stack

### Frontend
- **React 19**
- **Vite 6**
- **TypeScript**
- **Tailwind CSS 4**
- **Lucide React**
- **motion**

### Backend
- **Node.js**
- **Express.js**
- **PostgreSQL**
- **TypeScript**
- **Nodemailer**

### Key Packages
- `@google/genai`
- `@neondatabase/serverless`
- `bcryptjs`
- `jsonwebtoken`
- `dotenv`
- `nodemailer`
- `pg`

## Installation and Setup

### Prerequisites
- Node.js v18 or newer
- PostgreSQL database
- Git

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ctnet-ethiopia.git
   cd ctnet-ethiopia
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables by creating a `.env` file in the project root:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   SMTP_HOST=your_smtp_host
   SMTP_PORT=587
   SMTP_USER=your_smtp_username
   SMTP_PASS=your_smtp_password
   SMTP_FROM=no-reply@ctn-et.org
   APP_NAME=CTNET
   PGSSL=false
   SESSION_DEBUG=false
   AUDIT_LOG_PATH=./logs/ctn-et-audit-log.txt
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The app should be available at `http://localhost:3000`.

5. Build for production:
   ```bash
   npm run build
   npm run preview
   ```

## API Overview

### Public Endpoints
- `GET /api/health`
- `GET /api/news`
- `GET /api/events`
- `GET /api/partners`
- `GET /api/resources`
- `GET /api/team-members`
- `GET /api/trials`
- `GET /api/volunteers/count`
- `POST /api/contact`
- `POST /api/volunteers`
- `POST /api/partner-applications`

### Admin Endpoints
- `GET /api/auth/me`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/signup`
- `POST /api/auth/update-password`
- `POST /api/admin/news`
- `DELETE /api/admin/news/:id`
- `POST /api/admin/events`
- `DELETE /api/admin/events/:id`
- `POST /api/admin/partners`
- `DELETE /api/admin/partners/:id`
- `POST /api/admin/resources`
- `DELETE /api/admin/resources/:id`
- `POST /api/admin/team-members`
- `DELETE /api/admin/team-members/:id`
- `GET /api/admin/contacts`
- `GET /api/admin/partner-applications`
- `GET /api/admin/notifications`
- `GET /api/admin/admins`
- `POST /api/admin/add`
- `DELETE /api/admin/admins/:id`

## Project Structure

```
ctnet-et-updated-/
├── apis/               # API helper scripts
├── pages/              # Page-level routing and demo pages
├── src/                # Frontend source code
│   ├── components/     # React components
│   ├── images/         # Image assets
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Frontend entrypoint
│   └── translations.ts # Language support data
├── server.ts           # Backend server implementation
├── package.json        # Scripts and dependencies
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
├── schema.sql          # Database schema file
├── .env               # Local environment variables
└── README.md           # Project documentation
```

## Developer
- Developed by: **Abrham Molla**
- LinkedIn: https://www.linkedin.com/in/abrham-molla-6867511b6/
- Email: abrhammolla4@gmail.com

## Contact
For inquiries, support, or partnership requests:
- Email: abrhammolla4@gmail.com
