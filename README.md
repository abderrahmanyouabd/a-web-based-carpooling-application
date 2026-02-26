# A Web-Based Carpooling Solution for Sustainable Travel

## Bachelor's Thesis Project

This is a Bachelor's degree thesis project from the **University of Debrecen, Hungary**. The research and implementation demonstrate a comprehensive solution for sustainable commuting through intelligent ride-sharing.

Hopefully, reading through the codebase and documentation will help you understand the implementation details and design decisions made throughout this project.

---

## Project Overview

The Web-Based Carpooling Solution connects commuters for eco-friendly travel. Built with **React.js** and **Spring Boot**, it features real-time tracking, secure authentication, and optimized ride matching and decision making, using **PostgreSQL/MongoDB** and **WebSockets** for live updates.

### Key Features

- **Real-Time Ride Matching**: Intelligent algorithm for optimal ride pairing based on routes and preferences
- **Live GPS Tracking**: WebSocket-based location updates for drivers and passengers
- **Secure Authentication**: Full user authentication and authorization system
- **Payment Integration**: Stripe integration for seamless payment processing
- **Chat System**: Real-time communication between drivers and passengers
- **Trip Confirmation**: Smart confirmation flow with verification steps
- **User Profiles**: Comprehensive profile management with preferences and vehicle information
- **AI-Powered Assistance**: Chatbot component for user support

---

## Project Structure

```
├── backend/                                   # Spring Boot backend
│   └── CarPooling/
│       ├── docker-compose.yml                 # Local service orchestration
│       ├── mvnw
│       ├── mvnw.cmd
│       ├── pom.xml                            # Maven dependencies
│       └── src/
│           ├── main/
│           │   ├── java/com/chay/             # Java source code
│           │   └── resources/
│           │       ├── application.yml        # App configuration (placeholders)
│           │       └── static/                # Static assets
│           └── test/java/com/chay/            # Unit/integration tests
│
└── frontend/                                  # React frontend
    └── carpooling/
        ├── public/                            # Public assets
        │   ├── images/                        # Static images
        │   ├── index.html
        │   ├── manifest.json
        │   └── robots.txt
        ├── src/
        │   ├── CarPoolingPictures/            # UI assets
        │   ├── DrawingRoute/                  # Map routing logic
        │   │   ├── apiCall.js
        │   │   └── index.html
        │   ├── components/                    # React components
        │   │   ├── authentication/            # Sign in/up, recovery flows
        │   │   ├── booking/                   # Payment + confirmation
        │   │   ├── communication/             # Chat + notifications
        │   │   ├── gps_tracking/              # Live location tracking
        │   │   ├── profile_management/        # Profile + preferences
        │   │   ├── ride_creation/             # Multi-step ride creation
        │   │   └── rides/                     # Ride listing + reviews
        │   ├── App.js
        │   ├── WebSocketServer.js
        │   ├── index.css
        │   └── index.js
        ├── README.md
        ├── package.json
        └── tailwind.config.js
```

---

## Tech Stack

### Frontend
- **React.js** - UI framework
- **Tailwind CSS** - Styling
- **WebSocket** - Real-time communication
- **Leaflet/Mapbox** - Map integration

### Backend
- **Spring Boot** - Java framework
- **PostgreSQL** - Relational database
- **MongoDB** - NoSQL database (chat system)
- **Spring Security** - Authentication & authorization
- **Groq API** - AI/LLM integration

### Additional Services
- **Stripe** - Payment processing
- **OpenWeatherMap** - Weather data
- **OpenRouteService** - Route optimization
- **WebSockets** - Real-time updates

---

## Getting Started

### Frontend Setup
```bash
cd frontend/carpooling
npm install
npm start
```

### Backend Setup
```bash
cd backend/CarPooling
mvn clean install
mvn spring-boot:run
```

### Environment Configuration
1. Create `.env` file in `frontend/carpooling/` with your API keys
2. Create `application.yml` in `backend/CarPooling/src/main/resources/` with your configuration
3. See the respective `.gitignore` files for what should be filled in

---

## Important Notes

- **Sensitive Configuration**: API keys and database credentials are not included in the repository. Fill in the placeholder values in `application.yml` and `.env` files.
- **Database Setup**: Ensure PostgreSQL and MongoDB are running locally or configure remote connections
- **WebSocket Connection**: The frontend establishes WebSocket connections to the backend for real-time features

---

## Thesis Context

This project demonstrates:
- Full-stack web application development
- Microservices communication (REST + WebSockets)
- Real-time data synchronization
- Security best practices in authentication and data handling
- Scalable architecture for sustainable transportation

---

## Key Components

### Components Directory
The `src/components/` directory contains modular React components:
- **authentication/** - Sign up, sign in, password recovery
- **booking/** - Trip confirmation and payment processing
- **communication/** - Chat and notifications
- **gps_tracking/** - Real-time location tracking
- **profile_management/** - User profile and preferences
- **ride_creation/** - Multi-step ride creation form
- **rides/** - Ride listing, details, and reviews

### Backend Endpoints
Core API endpoints include:
- User authentication and management
- Ride CRUD operations
- Real-time location updates
- Payment processing
- Chat message handling
- Route optimization

---

## Security

- Database credentials and API keys are stored in local configuration files (not version controlled)
- User authentication via Spring Security
- HTTPS recommended for production deployment
- WebSocket secure connections (WSS) for live features

---

## Contact & Attribution

**Project Author**: Abderrahman Youabd & Hean Chhinling
**Institution**: University of Debrecen, Hungary
**Year**: 2024-2025  

---

## License

This project is submitted as a Bachelor's thesis and may be subject to institutional guidelines. Use for educational and research purposes.

---

**Happy exploring the codebase! We hope this implementation provides valuable insights into full-stack carpooling application development.** 
