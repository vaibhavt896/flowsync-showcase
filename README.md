# FlowSync - AI-Powered Adaptive Pomodoro Timer

FlowSync is an intelligent productivity companion that adapts to your work patterns and protects your deep flow states. Unlike traditional Pomodoro timers, FlowSync uses AI to learn your productivity patterns and never interrupts you during deep work.

> **Latest Update**: Fixed Vercel deployment issues - build should now work correctly.
> **Status**: Package-lock.json restored for stable dependency resolution.

## 🌟 Features

### Core Innovation
- **AI-Powered Flow Detection**: Real-time detection of flow states using activity patterns
- **Adaptive Timer Intervals**: Learn from your behavior and adjust session lengths automatically
- **Flow Guard Protection**: Never interrupts during deep work - queues break suggestions for natural pauses
- **Productivity DNA Profiling**: Analyzes your unique work patterns and peak performance times

### Timer Features
- **Smart Pomodoro Timer**: Traditional 25/5/15 minute cycles with intelligent adaptations
- **Context-Aware Sessions**: Different intervals for different types of work
- **Activity Tracking**: Monitor keystrokes, mouse movements, and application focus
- **Interruption Management**: Track and minimize workflow disruptions

### Progressive Web App
- **Offline Support**: Full functionality without internet connection
- **Mobile Responsive**: Works perfectly on desktop and mobile devices
- **Push Notifications**: Gentle reminders that respect your flow state
- **Background Sync**: Syncs data when connection is restored

### Analytics & Insights
- **Weekly Reports**: Detailed analysis of productivity patterns
- **Peak Time Detection**: Identify your most productive hours
- **Flow Metrics**: Track time spent in deep focus states
- **Trend Analysis**: Monitor productivity improvements over time

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/flowsync.git
   cd flowsync
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and JWT secrets
   ```

4. **Set up the database**
   ```bash
   # Run migrations
   npm run db:migrate
   
   # Seed with demo data (optional)
   npm run db:seed
   ```

5. **Start the development servers**
   ```bash
   # Terminal 1: Start backend
   npm run server:dev
   
   # Terminal 2: Start frontend
   npm run dev
   ```

6. **Open FlowSync**
   - https://flow-sync-three.vercel.app/

### Demo Login
If you ran the seed script, you can use these demo credentials:
- **Email**: demo@flowsync.app
- **Password**: demo123456

## 🏗️ Architecture

### Frontend Stack
- **React 18** with Concurrent Features and Suspense
- **TypeScript** for type safety
- **Tailwind CSS** with custom design system
- **Framer Motion** for smooth animations
- **Zustand** for state management
- **Vite** for fast development and building

### Backend Stack
- **Node.js** with TypeScript
- **Fastify** web framework
- **PostgreSQL** with TimescaleDB for time-series data
- **JWT** authentication with refresh tokens
- **WebSocket** for real-time updates

### AI/ML Features
- **TensorFlow.js** for client-side pattern recognition
- **Activity Pattern Analysis** for flow detection
- **Behavioral Learning** for adaptive scheduling
- **Predictive Analytics** for productivity optimization

## 📁 Project Structure

```
FlowSync/
├── src/                          # Frontend React application
│   ├── components/              # React components
│   │   ├── timer/              # Timer-specific components
│   │   ├── ui/                 # Reusable UI components
│   │   └── layout/             # Layout components
│   ├── hooks/                   # Custom React hooks
│   ├── stores/                  # Zustand state stores
│   ├── services/                # Business logic services
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Utility functions
├── server/                       # Backend API server
│   ├── routes/                  # API route handlers
│   ├── middleware/              # Express middleware
│   ├── database/                # Database management
│   ├── types/                   # Backend type definitions
│   ├── scripts/                 # Database scripts
│   └── utils/                   # Server utilities
├── public/                       # Static assets and PWA files
├── tests/                        # Test files
└── docs/                         # Documentation
```

## 🎯 Usage Guide

### Starting a Focus Session
1. Click "Start Focus" on the main timer
2. FlowSync begins monitoring your activity patterns
3. The timer adapts based on your historical productivity data
4. Flow state detection begins after a few minutes of consistent activity

### Understanding Flow Detection
FlowSync uses multiple signals to detect flow states:
- **Typing Patterns**: Consistent keystroke rhythm
- **Mouse Activity**: Focused, purposeful movements
- **Application Focus**: Minimal window switching
- **Activity Consistency**: Steady work patterns without interruptions

### Customizing Your Experience
- **Timer Settings**: Adjust default session lengths in Settings
- **Notifications**: Enable/disable alerts and sounds
- **Website Blocking**: Block distracting sites during focus sessions
- **Auto-start Options**: Automatically begin breaks or sessions

### Analyzing Your Productivity
- **Dashboard**: View daily statistics and trends
- **Insights**: Access weekly reports and recommendations
- **Flow Metrics**: Track your flow state duration and quality
- **Peak Times**: Identify your most productive hours

## 🔧 Development

### Available Scripts

```bash
# Frontend Development
npm run dev                    # Start development server
npm run build                  # Build for production
npm run preview               # Preview production build
npm run lint                  # Run ESLint
npm run typecheck            # Run TypeScript checks

# Backend Development
npm run server:dev            # Start server in development
npm run server:build         # Build server for production
npm run server:start         # Start production server

# Database
npm run db:migrate           # Run database migrations
npm run db:seed              # Seed database with demo data

# Testing
npm run test                 # Run unit tests
npm run test:ui              # Run tests with UI
```

### Code Quality
- **TypeScript**: Strict mode enabled with comprehensive types
- **ESLint**: Configured with React and TypeScript rules
- **Prettier**: Automatic code formatting
- **Husky**: Pre-commit hooks for quality checks

### Testing
- **Vitest**: Fast unit testing framework
- **React Testing Library**: Component testing utilities
- **Supertest**: API testing framework

## 🔐 Security

FlowSync takes privacy and security seriously:

- **Local-First**: Activity tracking happens locally
- **Encrypted Storage**: Sensitive data is encrypted at rest
- **JWT Authentication**: Secure token-based authentication
- **No Tracking**: We don't track or sell your productivity data
- **GDPR Compliant**: Full data export and deletion capabilities

## 🌐 Deployment

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/flowsync
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=flowsync
POSTGRES_USER=username
POSTGRES_PASSWORD=password

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here

# Server
PORT=3001
NODE_ENV=production

# External APIs (Optional)
WEATHER_API_KEY=your-weather-api-key
GOOGLE_CALENDAR_CLIENT_ID=your-google-calendar-client-id
```

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   npm run server:build
   ```

2. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb flowsync
   
   # Run migrations
   NODE_ENV=production npm run db:migrate
   ```

3. **Start the production server**
   ```bash
   NODE_ENV=production npm run server:start
   ```

### Docker Deployment (Coming Soon)
We're working on Docker containers for easy deployment.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code of Conduct
Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## 📜 License

FlowSync is open source software licensed under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by the Pomodoro Technique® by Francesco Cirillo
- Flow state research by Mihaly Csikszentmihalyi
- Deep work principles by Cal Newport
- Open source community and contributors

## 📞 Support

- **Documentation**: Check our [docs](docs/) folder
- **Issues**: Create an issue on GitHub
- **Discussions**: Join our GitHub Discussions
- **Email**: support@flowsync.app

## 🗺️ Roadmap

### Phase 1: Foundation ✅
- [x] Core timer functionality
- [x] Basic flow detection
- [x] PWA implementation
- [x] Local data storage

### Phase 2: Intelligence (Current)
- [ ] Advanced ML pattern recognition
- [ ] Productivity DNA profiling
- [ ] Weekly insights generation
- [ ] Smart recommendations

### Phase 3: Integration
- [ ] Calendar integration
- [ ] Weather-based adjustments
- [ ] Team collaboration features
- [ ] Third-party app integrations

### Phase 4: Advanced Features
- [ ] Voice commands
- [ ] Biometric integration
- [ ] Advanced analytics dashboard
- [ ] Productivity coaching

---

**Built with ❤️ for developers, by developers**

FlowSync helps you achieve deep, focused work while respecting your natural productivity rhythms. Start your journey to better productivity today!
