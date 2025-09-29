# Crime Reporting System

A comprehensive web-based platform that enables citizens to report crimes digitally and allows law enforcement agencies to efficiently manage, track, and investigate reported incidents. Built with modern web technologies, this system promotes community safety through secure, accessible crime reporting and real-time case management.

![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![Auth.js](https://img.shields.io/badge/Auth.js-Authentication-orange)

## 🚀 Live Demo

[Live Application](https://your-deployment-url.com) • [API Documentation](https://your-api-docs.com)

## ✨ Features

### 🔐 Multi-Role Authentication System

- **Role-based Access Control**: Four distinct user roles with specific permissions
  - **Citizens**: Submit crime reports, track case status, manage personal profile
  - **Police Officers**: Review reports, update investigation status, manage assigned cases
  - **Investigators**: Advanced case analysis, evidence management, detailed reporting
  - **Admin**: User management, system oversight, analytics dashboard
- **Google OAuth Integration**: Secure authentication via Google accounts
- **Session Management**: Persistent login with secure session handling

### 📝 Comprehensive Crime Reporting

- **Detailed Report Forms**: Structured data collection for various crime types
  - Theft, Assault, Vandalism, Fraud, Missing Person, Domestic Violence, Burglary, Accidents, Drug-related, and Other
- **Interactive Location Selection**: Click-to-pin location mapping with address autocomplete
- **Incident Documentation**: Date, time, witness information, suspect details
- **Evidence Management**: Support for multiple file attachments
- **Priority Classification**: Low, Normal, High, Critical priority levels

### 🗺️ Advanced Mapping Features

- **Interactive Maps**: Leaflet integration for precise location marking
- **Coordinate Storage**: GeoJSON format for accurate geographical data
- **Mini Map Views**: Compact map displays in report listings and details
- **Responsive Map Sizing**: Configurable map dimensions for different contexts

### 📊 Real-time Status Tracking

- **Status Pipeline**: Clear progression through investigation stages
  - Submitted → Under Review → Investigating → Resolved/Closed/Rejected
- **Visual Status Indicators**: Color-coded badges and progress indicators
- **Timeline Tracking**: Created and updated timestamps for all reports

### 👥 Advanced User Management

- **Profile Completion System**: Comprehensive user profiles with verification status
- **Aadhaar Integration**: Indian national ID verification support
- **Contact Information**: Phone, email, and address management
- **User Analytics**: Registration dates, activity tracking, report statistics

### 🔍 Powerful Search & Filtering

- **Multi-criteria Search**: Filter by status, type, location, date range, priority
- **Real-time Updates**: Live data refresh for admin dashboards
- **Pagination Support**: Efficient handling of large datasets
- **Sort Options**: Multiple sorting criteria for data organization

### 🎨 Modern User Interface

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Mode**: System preference detection and manual toggle
- **Component Library**: shadcn/ui for consistent, accessible components
- **Loading States**: Skeleton loaders and progress indicators
- **Toast Notifications**: Real-time feedback for user actions

## 🛠️ Tech Stack

### Frontend

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Modern React component library
- **[Leaflet](https://leafletjs.com/)** - Interactive mapping library
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library

### Backend & Database

- **[Prisma ORM](https://www.prisma.io/)** - Type-safe database client
- **[MongoDB](https://www.mongodb.com/)** - NoSQL document database
- **[Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)** - Serverless API endpoints

### Authentication & Security

- **[Auth.js (NextAuth)](https://authjs.dev/)** - Complete authentication solution
- **[Google OAuth](https://developers.google.com/identity/protocols/oauth2)** - Secure social authentication
- **[Zod](https://zod.dev/)** - Schema validation library

### Development Tools

- **[React Hook Form](https://react-hook-form.com/)** - Performant forms with validation
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notification system
- **[ESLint](https://eslint.org/)** - Code linting and formatting
- **[Prisma Studio](https://www.prisma.io/studio)** - Visual database management

## 📁 Project Structure

```
crime_reporting_system/
├── public/                          # Static assets
│   ├── images/                     # Application images
│   └── icons/                      # Icon files
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── account/               # Authentication pages
│   │   │   ├── login/            # Login page
│   │   │   └── profile/          # User profile management
│   │   ├── api/                   # API routes
│   │   │   ├── auth/             # NextAuth configuration
│   │   │   └── users/            # User management endpoints
│   │   ├── dashboard/             # Main dashboard
│   │   └── menu/                  # Feature modules
│   │       ├── admin/            # Admin management
│   │       │   ├── users/        # User management
│   │       │   └── reports/      # Report management
│   │       └── complaints/       # Citizen complaint system
│   ├── components/                # Reusable components
│   │   ├── ui/                   # shadcn/ui components
│   │   └── custom/               # Custom components
│   │       ├── elements/         # UI elements
│   │       └── Loaders/          # Loading components
│   ├── hooks/                     # Custom React hooks
│   ├── lib/                       # Utility libraries
│   │   ├── auth.ts              # Authentication configuration
│   │   ├── data_queries.ts      # Database queries
│   │   └── utils.ts             # Helper functions
│   ├── prisma/                    # Database configuration
│   │   ├── schema.prisma        # Database schema
│   │   └── prisma.ts            # Prisma client
│   └── server_action/             # Server actions
│       ├── account/              # Account management
│       └── complaints/           # Complaint handling
├── .env.example                   # Environment variables template
├── package.json                   # Dependencies and scripts
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Project documentation
```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** or **pnpm**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Google Cloud Console** account (for OAuth setup)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Void-Monarch/crime_reporting_system.git
   cd crime_reporting_system
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in the required environment variables in `.env`:

   ```env
   # Database
   MONGODB_URL="your-mongodb-connection-string"

   # Authentication
   AUTH_SECRET="your-secret-key-minimum-32-characters"
   AUTH_GOOGLE_ID="your-google-client-id"
   AUTH_GOOGLE_SECRET="your-google-client-secret"

   # Application
   NODE_ENV="development"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up Google OAuth**

   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select an existing one
   - Enable the Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Copy the Client ID and Client Secret to your `.env` file

5. **Set up the database**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Push the schema to your database
   npx prisma db push
   ```

6. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

7. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Database Management

- **Prisma Studio**: Visual database browser

  ```bash
  npx prisma studio
  ```

  Access at [http://localhost:5555](http://localhost:5555)

- **Reset Database**: Clear all data and reset schema
  ```bash
  npx prisma db push --force-reset
  ```

### Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Database commands
npx prisma generate      # Generate Prisma client
npx prisma db push       # Push schema changes
npx prisma studio        # Open database browser
```

## 📱 Usage

### For Citizens

1. **Register/Login**: Use Google OAuth to create an account
2. **Complete Profile**: Add personal information for verification
3. **Report Crime**:
   - Navigate to "New Complaint"
   - Fill in incident details
   - Pin location on the map
   - Upload evidence (optional)
   - Submit report
4. **Track Status**: Monitor your reports in the "My Complaints" section

### For Law Enforcement

1. **Admin Access**: Contact system administrator for role assignment
2. **Review Reports**: Access the admin dashboard to view pending reports
3. **Manage Cases**: Update status, add comments, assign investigators
4. **User Management**: Manage citizen accounts and user roles
5. **Analytics**: View crime statistics and trends

## 🔒 Security Features

- **Authentication**: Secure OAuth 2.0 with Google
- **Authorization**: Role-based access control (RBAC)
- **Data Validation**: Zod schema validation on all inputs
- **Session Management**: Secure session handling with Auth.js
- **Database Security**: Prisma ORM with parameterized queries
- **Input Sanitization**: XSS protection and CSRF prevention

## 📈 Performance Optimizations

- **Server Components**: Leveraging React Server Components for better performance
- **Lazy Loading**: Dynamic imports and component-level code splitting
- **Image Optimization**: Next.js automatic image optimization
- **Caching**: Efficient data fetching with proper cache headers
- **Bundle Analysis**: Optimized bundle size with tree shaking

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use conventional commit messages
- Ensure all tests pass
- Update documentation as needed
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Void-Monarch**

- GitHub: [@Void-Monarch](https://github.com/Void-Monarch)
- Project: [Crime Reporting System](https://github.com/Void-Monarch/crime_reporting_system)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Vercel](https://vercel.com/) for inspiration and deployment platform
- [Prisma](https://www.prisma.io/) for the excellent ORM
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

## 📞 Support

If you have any questions or need help with setup, please:

- Open an issue on GitHub
- Check the [documentation](https://github.com/Void-Monarch/crime_reporting_system/wiki)
- Contact the maintainer

---

<div align="center">
  <p>Built with ❤️ for community safety</p>
  <p>
    <a href="#top">Back to top ⬆️</a>
  </p>
</div>

## ScreenShots 📷

<img width="1919" height="976" alt="image" src="https://github.com/user-attachments/assets/65866a6d-c11e-4ff6-a914-44ec82416111" />

<img width="1919" height="980" alt="image" src="https://github.com/user-attachments/assets/1f533c78-6f70-4073-b893-abcebd9564ae" />

<img width="1919" height="981" alt="image" src="https://github.com/user-attachments/assets/c877d2cb-6f0b-410d-8935-c7bd383375c3" />


