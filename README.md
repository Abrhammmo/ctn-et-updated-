# CTNET: Clinical Trial Network Ethiopia

A comprehensive web application designed to manage and disseminate information related to clinical trials, research activities, and healthcare initiatives in Ethiopia. CTNET serves as a centralized platform for researchers, healthcare professionals, volunteers, and the general public to access up-to-date information about ongoing clinical trials, news, events, partnerships, and educational resources.

## Features

### Public Features
- **Clinical Trial Registry**: Browse and search registered clinical trials with details including title, phase, status, and dates.
- **News & Events**: Stay informed with the latest news announcements and upcoming events in both English and Amharic.
- **Partners Section**: View information about collaborating institutions including universities, banks, and other organizations.
- **Resources Library**: Access guidelines, directives, online courses, and publications with Google Drive previews.
- **Team Directory**: Learn about the professionals behind CTNET with detailed profiles.
- **Volunteer Registration**: Easy form for individuals to register as volunteers for clinical trials.
- **Contact Form**: Secure way to send inquiries or feedback to the CTNET team.

### Admin Features (Protected)
- **Content Management**: Create, read, update, and delete news articles, events, partners, resources, and team members.
- **User Administration**: Manage administrator accounts with secure credential handling.
- **Audit Logging**: Track administrative actions for security and accountability.
- **Session Management**: Secure admin sessions with automatic timeout and activity tracking.
- **Volunteer Analytics**: View total volunteer registration count.
- **Partner Applications**: Review and manage incoming partnership applications.

## Technology Stack

### Frontend
- **React 19** - Modern JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **TypeScript** - Typed superset of JavaScript for enhanced code quality
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Framer Motion** - Animation library for enhanced user experience
- **Lucide React** - Beautifully simple icons

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated, minimalist web framework
- **PostgreSQL** - Robust, open-source object-relational database system
- **TypeScript** - For type-safe backend development

### Key Dependencies
- `@google/genai` - Google AI integration
- `bcryptjs` - Password hashing for security
- `jsonwebtoken` - Authentication token handling
- `nodemailer` - Email sending functionality
- `dotenv` - Environment variable management
- `lucide-react` - Icon set
- `motion` - Animation library

## Installation and Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Git

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ctnet-ethiopia.git
   cd ctnet-ethiopia
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory based on `.env.example`:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   SMTP_HOST=your_smtp_host
   SMTP_PORT=587
   SMTP_USER=your_smtp_username
   SMTP_PASS=your_smtp_password
   SMTP_FROM=no-reply@ctn-et.org
   APP_NAME=CTNET
   ```

   Note: For development, you can use the provided `.env.example` as a starting point.

4. **Database Setup**
   The application will automatically initialize the database schema on first startup. Ensure your PostgreSQL server is running and the `DATABASE_URL` points to a valid database.

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`.

6. **Production Build**
   ```bash
   npm run build
   npm run preview
   ```

## API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `GET /api/news` - Retrieve all news articles
- `GET /api/events` - Retrieve all events
- `GET /api/partners` - Retrieve all partners
- `GET /api/resources` - Retrieve all resources
- `GET /api/team-members` - Retrieve all team members
- `GET /api/trials` - Retrieve all clinical trials
- `GET /api/volunteers/count` - Get total volunteer count
- `POST /api/contact` - Submit a contact form message
- `POST /api/volunteers` - Register a new volunteer
- `POST /api/partner-applications` - Submit a partnership application

### Admin Endpoints (Require Admin Authentication)
- `GET /api/auth/me` - Get current user session
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/update-password` - Change password
- `POST /api/admin/news` - Create news article
- `DELETE /api/admin/news/:id` - Delete news article
- `POST /api/admin/events` - Create event
- `DELETE /api/admin/events/:id` - Delete event
- `POST /api/admin/partners` - Create partner
- `DELETE /api/admin/partners/:id` - Delete partner
- `POST /api/admin/resources` - Create resource
- `DELETE /api/admin/resources/:id` - Delete resource
- `POST /api/admin/team-members` - Create team member
- `DELETE /api/admin/team-members/:id` - Delete team member
- `GET /api/admin/contacts` - Retrieve contact messages
- `GET /api/admin/partner-applications` - Retrieve partnership applications
- `GET /api/admin/notifications` - Get unread contact and application counts
- `GET /api/admin/admins` - List administrator accounts
- `POST /api/admin/add` - Add new administrator
- `DELETE /api/admin/admins/:id` - Delete administrator

## Usage

### For General Users
1. Visit the homepage to see an overview of current trials, news, and events.
2. Navigate to specific sections using the menu:
   - **Trials**: Browse registered clinical trials
   - **News**: Read latest announcements (available in English and Amharic)
   - **Events**: View upcoming conferences, workshops, and meetings
   - **Partners**: Learn about collaborating institutions
   - **Resources**: Access educational materials and guidelines
   - **Team**: Meet the CTNET team
   - **Volunteer**: Register to participate in clinical trials
   - **Contact**: Send inquiries or feedback

### For Administrators
1. Navigate to the sign-in page and log in with admin credentials.
2. Access the admin dashboard via the menu.
3. Manage content:
   - Create, edit, or delete news articles, events, partners, resources, and team members.
4. Manage users:
   - Add new administrator accounts (credentials sent via email).
   - View and manage existing administrator accounts.
5. Monitor activity:
   - View unread contact messages and partnership applications.
   - Check audit logs for administrative actions (stored in logs directory).

## Project Structure

```
ctnet-et-updated-/
├── src/                 # Frontend source code
│   ├── components/      # React components
│   ├── types/           # TypeScript type definitions
│   ├── translations/    # Language translation files
│   └── App.tsx          # Main application component
├── server.ts            # Backend server implementation
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
├── .env.example         # Example environment variables
├── README.md            # This file
└── ...                  # Other configuration files
```

## Contributing

We welcome contributions to improve CTNET! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests where applicable.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For inquiries, partnerships, or support, please contact:
- Email: abrhammolla4@gmail.com
- Website: https://ctn-et.org

---
*Last updated: May 2026*