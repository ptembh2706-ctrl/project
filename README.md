# 🌍 E-Tour Management System

## 📖 Overview
The **E-Tour Management System** is a comprehensive web application designed to facilitate tourism operations. It serves both **Customers** (who can browse tours, book packages, and manage their invoices) and **Administrators** (who manage the catalog, pricing, and bookings).

The system features a **modern, responsive frontend** built with React and a **robust backend** powered by Spring Boot, ensuring a seamless and secure user experience.

---

## 🛠️ Technology Stack

### **Frontend**
-   **Framework**: React.js (Vite)
-   **Styling**: Tailwind CSS + Vanilla CSS (Glassmorphism design)
-   **State Management**: React Hooks (`useState`, `useEffect`, `useContext`)
-   **Routing**: React Router DOM v6
-   **HTTP Client**: Axios

### **Backend**
-   **Framework**: Spring Boot 3.x
-   **Language**: Java 17+
-   **Database**: MySQL (Hibernate/JPA)
-   **Security**: Spring Security + JWT (JSON Web Tokens)
-   **Authentication**: OAuth2 (Google Login) & Standard Auth
-   **Build Tool**: Maven

### **Third-Party Integrations**
-   **PDF Generation**: OpenPDF (for Invoices)
-   **Email Service**: JavaMailSender (SMTP) & SendGrid
-   **Payment Gateway**: Razorpay Integration

---

## ✨ Key Features

### 👤 **Customer Module**
-   **Authentication**: Registration, Login, Google OAuth2, Password Reset (Email).
-   **Browse Tours**: Search by Category, View Itineraries, Check Departure Dates.
-   **Booking**: Book tours for multiple passengers.
-   **Payments**: Secure payment processing via Razorpay.
-   **Invoices**: Auto-generated PDF invoices sent via Email.
-   **Profile**: View booking history and personal details.

### 🛡️ **Admin Module**
-   **Dashboard**: Overview of business metrics.
-   **Category Management**: Add, Edit, Delete Tour Categories.
-   **Tour Management**: Manage Tour Packages, Departures, and Costs.
-   **Itinerary Management**: Define day-wise schedules for tours.
-   **Customer Management**: View and Manage Customer data (including Bulk Upload).
-   **Reports**: Export data to Excel/PDF.

---

## 🚀 Setup & Installation

### **1. Prerequisites**
-   **Java Development Kit (JDK)**: Version 17 or higher.
-   **Node.js**: Version 18 or higher.
-   **MySQL**: Version 8.0+.
-   **Maven**: For backend dependency management.

### **2. Database Setup**
1.  Create a MySQL database named `etour_db` (or as configured).
2.  The application uses `spring.jpa.hibernate.ddl-auto=update`, so tables will be created automatically on the first run.

### **3. Backend Setup**
1.  Navigate to the project root directory:
    ```bash
    cd d:\CDAC\project\prjejject
    ```
2.  Configure `src/main/resources/application-local.properties` with your credentials:
    -   Database URL/User/Pass
    -   JWT Secret
    -   Email (SMTP/SendGrid) Keys
    -   Razorpay Keys
3.  Run the application:
    ```bash
    mvn spring-boot:run
    ```
    The backend will start on **http://localhost:8080**.

### **4. Frontend Setup**
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend will be accessible at **http://localhost:5173**.

---

## 🔌 API Endpoints
(Partial list of key endpoints. View `Swagger/OpenAPI` docs if configured for full list)

| Module | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | POST | `/api/auth/login` | Authenticate user & get Token |
| **Auth** | POST | `/api/auth/register` | Register new customer |
| **Tours** | GET | `/api/tours` | Get all tours |
| **Tours** | GET | `/api/tours/{id}` | Get tour details |
| **Booking** | POST | `/api/bookings` | Create a new booking |
| **Destinations**| GET | `/api/destinations` | Get destination list |
| **Actuator** | GET | `/actuator/health` | System health status |

---

## 📂 Project Structure

```
E-Tour/
├── src/main/java/com/etour/app/   # Backend Source
│   ├── controller/                # REST Controllers
│   ├── service/                   # Business Logic
│   ├── repository/                # JPA Repositories
│   ├── entity/                    # Database Models
│   ├── dto/                       # Data Transfer Objects
│   ├── config/                    # Security & App Config
│   └── email/                     # Email Service Logic
├── frontend/                      # React Frontend
│   ├── src/
│   │   ├── components/            # Reusable UI Components
│   │   ├── pages/                 # Full Page Views
│   │   ├── api/                   # Axios API Clients
│   │   └── context/               # React Context (Auth/Lang)
└── pom.xml                        # Maven Dependencies
```

---

## 🔒 Security
-   **JWT Tokens**: Used for stateless authentication.
-   **BCrypt**: Passwords are hashed before storage.
-   **CORS**: Configured to allow frontend communication.
-   **Endpoint Protection**: Admin routes are restricted by Role.

---

**Developed by E-Tour Team**
