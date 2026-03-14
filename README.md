# 🏝️ Resort Reservation System

## Demo

![Demo](./demo.gif)

A professional full-stack web application for resort management, featuring a robust reservation engine with conflict prevention and an administrative dashboard.

**Built to demonstrate:** Advanced booking logic, relational data integrity, type-safe API design, and modern full-stack architecture.

---

## 🎯 Project Purpose

This project serves as a demonstration of production-grade full-stack development practices. It tackles real-world challenges in the hospitality domain:

- **Booking Conflict Prevention** – Server-side logic to prevent double-bookings
- **Data Integrity** – Cascading deletes and indexed foreign keys for scalable relational data
- **Type Safety** – End-to-end TypeScript with Prisma for compile-time guarantees
- **Admin UI Demo Mode** – Toggle-based conditional rendering for rapid prototyping

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Database** | PostgreSQL (Supabase-hosted) |
| **ORM** | Prisma |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | Radix UI (Slot), shadcn/ui, Lucide Icons |
| **Deployment** | Vercel-ready |

---

## 🚀 Key Technical Features

### 1. **Conflict-Free Booking Engine**

The reservation system prevents overlapping bookings at the application layer with database-validated constraints:

- **Overlap Detection**: Server-side logic checks if a new reservation conflicts with existing dates for a specific room
- **Date Validation**: Ensures check-out dates are strictly after check-in dates
- **Application-level Conflict Prevention**: Pre-creation checks prevent double-bookings

```typescript
// Actual implementation: Prevent overlapping reservations
const overlapping = await prisma.reservation.findFirst({
  where: {
    roomId,
    AND: [
      { checkIn: { lt: checkOutDate } },
      { checkOut: { gt: checkInDate } },
    ],
  },
});

if (overlapping) {
  return NextResponse.json(
    { error: "Room is already booked for selected dates" },
    { status: 409 }
  );
}
```

### 2. **Relational Data Integrity**

Built with a structured PostgreSQL schema to ensure referential integrity:

- **Cascading Deletes**: Configured `onDelete: Cascade` on the `Reservation` → `Room` relation, so deleting a room automatically removes all associated reservations
- **Optimized Queries**: `@@index` on `roomId` foreign key ensures fast lookups as the dataset scales
- **UUID Primary Keys**: Uses universally unique identifiers for distributed-system readiness

### 3. **Type-Safe API Architecture**

All API routes leverage Next.js 14 App Router with standardized response patterns:

- **HTTP Status Codes**: `400` for validation errors, `409` for booking conflicts, `201` for successful creation, `204` for deletions
- **Prisma Client Integration**: Full type safety from database schema to API responses
- **React Server Components**: Server-side rendering for optimized initial page loads

```typescript
// Example: Type-safe route handler
export async function POST(req: Request) {
  const body = await req.json();
  
  const reservation = await prisma.reservation.create({
    data: {
      roomId: body.roomId,
      guestName: body.guestName,
      checkIn: new Date(body.checkIn),
      checkOut: new Date(body.checkOut),
    },
  });
  
  return NextResponse.json(reservation, { status: 201 });
}
```

---

## 📂 Project Architecture

```
resort-reservation-system/
├── app/
│   ├── resorts/
│   │   ├── [id]/
│   │   │   ├── rooms/new/
│   │   │   │          └── page.tsx       # Add room form
│   │   │   └── page.tsx           # Resort detail view
│   │   └── page.tsx               # Resorts listing page
│   ├── admin/
│   │   ├── reservations/
│   │   │   └── page.tsx           # Reservation management (admin)
│   │   └── resorts/
│   │       ├── [id]/
│   │       │   └── rooms/new/
│   │       │              └── page.tsx   # Add room form (admin)
│   │       └── new/
│   │           └── page.tsx       # Create resort form (admin)
│   ├── api/
│   │   ├── reservations/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts      # PATCH, DELETE specific reservation
│   │   │   └── route.ts          # GET, POST, DELETE reservation
│   │   ├── resorts/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts      # GET, DELETE resort
│   │   │   └── route.ts          # POST create resort
│   │   └── rooms/
│   │       ├── [id]/
│   │       │   └── route.ts      # PUT, DELETE room
│   │       └── route.ts          # POST create room
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx                 # Root layout with navigation
│   └── page.tsx                   # Homepage/resort listing
├── components/
│   ├── ui/
│   │   └── button.tsx             # Reusable UI primitives
│   ├── AdminEditRoomPanel.tsx     # Room edit modal (admin)
│   ├── BookRoomForm.tsx           # Public booking form
│   ├── CancelReservationButton.tsx
│   ├── DeleteResortButton.tsx
│   ├── DeleteRoomButton.tsx
│   ├── EditReservationForm.tsx
│   ├── EditRoomForm.tsx
│   └── TopNav.tsx                 # Navigation bar
├── lib/
│   ├── prisma.ts                  # Prisma client instance
│   └── utils.ts                   # Utility functions (cn, etc.)
├── prisma/
│   ├── migrations/                # Migration history
│   └── schema.prisma              # Database schema
├── .env                           # Environment variables
├── .gitignore
├── components.json                # shadcn/ui config
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── prisma.config.ts
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🗄️ Database Schema

The application uses a normalized relational structure with three core entities:

```prisma
model Resort {
  id          String   @id @default(uuid())
  name        String
  location    String
  description String?
  createdAt   DateTime @default(now())
  
  rooms       Room[]
}

model Room {
  id        String   @id @default(uuid())
  resortId  String
  name      String
  price     Int
  capacity  Int
  createdAt DateTime @default(now())
  
  resort       Resort        @relation(fields: [resortId], references: [id])
  reservations Reservation[]
}

model Reservation {
  id        String   @id @default(uuid())
  roomId    String
  guestName String
  checkIn   DateTime
  checkOut  DateTime
  createdAt DateTime @default(now())
  
  room      Room     @relation(fields: [roomId], references: [id], onDelete: Cascade)
  
  @@index([roomId])
}
```

**Design Decisions:**
- **UUIDs over auto-increment IDs**: Better for distributed systems and prevents enumeration attacks
- **Indexed foreign keys**: `@@index([roomId])` on reservations for O(log n) lookups
- **Cascade deletes**: Maintains referential integrity without orphaned records

---

## ✨ Features

### Public / User Features
- Browse resorts and view available rooms
- Check room availability for date ranges
- Create reservations with guest details
- View all reservations per room

### Admin Features (Demo Mode)
- Create and delete resorts
- Add rooms to resorts with pricing and capacity
- Edit room details (price, capacity)
- Delete rooms (cascades to reservations)
- Edit reservation details
- Cancel reservations
- View all system reservations

> **Note on Admin Access**: This project uses navigation-based admin routes (e.g., `/admin/reservations`, `/admin/resorts/new`) for demonstration purposes. Admin features are conditionally rendered using a local `isAdmin` flag within components for demo purposes. This design choice allows rapid testing and demonstration without implementing OAuth/JWT flows. In production, these routes would be protected with proper authentication middleware (e.g., NextAuth.js, Clerk, or Auth0) and role-based access control.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (local or cloud-hosted)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd resort-reservation-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/resort_db"
   ```

4. **Initialize the database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Seed the database** (optional)
   ```bash
   npx prisma db seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open the app**
   ```
   http://localhost:3000
   ```

---

## 🧩 API Routes

All API endpoints follow RESTful conventions:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/resorts` | List all resorts |
| `POST` | `/api/resorts` | Create a resort |
| `GET` | `/api/resorts/[id]` | Get resort details |
| `DELETE` | `/api/resorts/[id]` | Delete a resort |
| `POST` | `/api/rooms` | Create a room |
| `PUT` | `/api/rooms/[id]` | Update room details |
| `DELETE` | `/api/rooms/[id]` | Delete a room |
| `POST` | `/api/reservations` | Create a reservation |
| `GET` | `/api/reservations?roomId={id}` | Get reservations for a room |
| `DELETE` | `/api/reservations?id={id}` | Cancel a reservation |

**Response Standards:**
- Success: `200 OK`, `201 Created`, `204 No Content`
- Client Errors: `400 Bad Request`, `404 Not Found`, `409 Conflict`
- Server Errors: `500 Internal Server Error`

---

## 🎯 What This Project Demonstrates

This application showcases:

 **Full-stack TypeScript proficiency** – End-to-end type safety from database to UI  
 **Booking conflict logic** – Server-side overlap detection with date validation  
 **Database design expertise** – Normalized schema with cascading relationships and indexes  
 **Modern React patterns** – App Router with server and client components  
 **RESTful API design** – Proper HTTP methods, status codes, and error handling  
 **Production-ready structure** – Environment variables, migrations, and deployment-ready setup  

---

## 🔮 Future Enhancements

Potential improvements for a production deployment:

-  **Authentication**: Integrate NextAuth.js or Clerk for secure admin access
-  **Image Uploads**: Add room photos with Cloudinary or S3
-  **Search & Filtering**: Full-text search on resorts and date-based availability filters
-  **Payment Integration**: Stripe for handling deposits and booking payments
-  **Email Notifications**: Confirmation emails via Resend or SendGrid
-  **Calendar View**: Visual date picker showing room availability
-  **Multi-currency Support**: Dynamic pricing based on user locale
-  **Performance Monitoring**: Integrate Sentry or LogRocket for error tracking

---

##  Author

**Jack Jalandoni**  
[GitHub](https://github.com/itzjackj) • [LinkedIn](https://www.linkedin.com/in/jack-jalandoni/)

---

##  License

This project is open source and available under the [MIT License](LICENSE).