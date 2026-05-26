# Backend Server API

<cite>
**Referenced Files in This Document**
- [server.js](file://backend/server.js)
- [package.json](file://backend/package.json)
- [route.ts](file://app/api/ai-suggest/route.ts)
- [route.ts](file://app/api/classify-task/route.ts)
- [route.ts](file://app/api/upload/route.ts)
- [route.ts](file://app/api/verify-task/route.ts)
- [package.json](file://package.json)
- [premium-products.ts](file://lib/premium-products.ts)
- [premium-cosmetics.ts](file://lib/premium-cosmetics.ts)
- [use-auth.ts](file://hooks/use-auth.ts)
- [use-game-state.ts](file://hooks/use-game-state.ts)
- [game-constants.ts](file://lib/game-constants.ts)
- [page.tsx](file://app/pricing/page.tsx)
- [premium-upgrade-banner.tsx](file://components/premium-upgrade-banner.tsx)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)
10. [Appendices](#appendices)

## Introduction
This document provides comprehensive API documentation for the Express.js backend server and the integrated Next.js API routes. It covers server configuration, middleware setup, endpoint definitions for premium features, and integration patterns with the frontend application. It also explains the simulated payment flow for upgrading to premium, user data management, and operational considerations such as environment configuration, CORS, and production deployment.

## Project Structure
The project is a monorepo-like structure with a dedicated backend server under the backend directory and Next.js API routes under app/api. Premium-related frontend assets and logic reside in lib, hooks, and components.

```mermaid
graph TB
subgraph "Backend Server"
BE_Server["Express Server<br/>backend/server.js"]
BE_Pkg["Dependencies<br/>backend/package.json"]
end
subgraph "Next.js Frontend"
FE_NextPkg["Next.js Dependencies<br/>package.json"]
FE_AI_Suggest["AI Suggest Route<br/>app/api/ai-suggest/route.ts"]
FE_Classify["Classify Task Route<br/>app/api/classify-task/route.ts"]
FE_Upload["Upload Route<br/>app/api/upload/route.ts"]
FE_Verify["Verify Task Route<br/>app/api/verify-task/route.ts"]
FE_Pricing["Pricing Page<br/>app/pricing/page.tsx"]
FE_Banner["Premium Banner<br/>components/premium-upgrade-banner.tsx"]
FE_Auth["Auth Hook<br/>hooks/use-auth.ts"]
FE_Game["Game State Hook<br/>hooks/use-game-state.ts"]
FE_PremiumProducts["Premium Products<br/>lib/premium-products.ts"]
FE_PremiumCosmetics["Premium Cosmetics<br/>lib/premium-cosmetics.ts"]
end
BE_Server --> BE_Pkg
FE_NextPkg --> FE_AI_Suggest
FE_NextPkg --> FE_Classify
FE_NextPkg --> FE_Upload
FE_NextPkg --> FE_Verify
FE_Pricing --> FE_Auth
FE_Banner --> FE_Auth
FE_Auth --> FE_Game
FE_Pricing --> FE_PremiumProducts
FE_Pricing --> FE_PremiumCosmetics
```

**Diagram sources**
- [server.js](file://backend/server.js)
- [package.json](file://backend/package.json)
- [route.ts](file://app/api/ai-suggest/route.ts)
- [route.ts](file://app/api/classify-task/route.ts)
- [route.ts](file://app/api/upload/route.ts)
- [route.ts](file://app/api/verify-task/route.ts)
- [package.json](file://package.json)
- [page.tsx](file://app/pricing/page.tsx)
- [premium-upgrade-banner.tsx](file://components/premium-upgrade-banner.tsx)
- [use-auth.ts](file://hooks/use-auth.ts)
- [use-game-state.ts](file://hooks/use-game-state.ts)
- [premium-products.ts](file://lib/premium-products.ts)
- [premium-cosmetics.ts](file://lib/premium-cosmetics.ts)

**Section sources**
- [server.js](file://backend/server.js)
- [package.json](file://backend/package.json)
- [route.ts](file://app/api/ai-suggest/route.ts)
- [route.ts](file://app/api/classify-task/route.ts)
- [route.ts](file://app/api/upload/route.ts)
- [route.ts](file://app/api/verify-task/route.ts)
- [package.json](file://package.json)
- [page.tsx](file://app/pricing/page.tsx)
- [premium-upgrade-banner.tsx](file://components/premium-upgrade-banner.tsx)
- [use-auth.ts](file://hooks/use-auth.ts)
- [use-game-state.ts](file://hooks/use-game-state.ts)
- [premium-products.ts](file://lib/premium-products.ts)
- [premium-cosmetics.ts](file://lib/premium-cosmetics.ts)

## Core Components
- Express server with CORS enabled globally and JSON body parsing.
- File upload pipeline using Multer with disk storage and timestamped filenames.
- In-memory “database” for users and tasks used for demonstration.
- Middleware to enforce premium-only access for advanced features.
- Premium upgrade endpoint simulating payment and plan change.
- Next.js API routes for AI-powered features (task suggestions, classification, image analysis, verification).

Key endpoints:
- POST /tasks: Retrieve pending tasks for a user.
- POST /add-task: Add a new task for a user.
- POST /complete-task: Mark a task as completed.
- POST /ai-suggest: Premium endpoint to get AI-generated task suggestions.
- POST /upload: Premium endpoint to upload an image and receive AI feedback.
- POST /upgrade: Simulate upgrading a user to premium.

**Section sources**
- [server.js](file://backend/server.js)
- [route.ts](file://app/api/ai-suggest/route.ts)
- [route.ts](file://app/api/classify-task/route.ts)
- [route.ts](file://app/api/upload/route.ts)
- [route.ts](file://app/api/verify-task/route.ts)

## Architecture Overview
The backend server exposes REST endpoints for task management and premium features. Premium features are gated by a middleware that checks the user’s plan. Next.js API routes provide complementary AI-driven functionality and integrate with the frontend’s authentication and game state.

```mermaid
graph TB
Client["Frontend App<br/>Next.js"]
Auth["Auth Hook<br/>hooks/use-auth.ts"]
Pricing["Pricing Page<br/>app/pricing/page.tsx"]
Premium["Premium Upgrade Banner<br/>components/premium-upgrade-banner.tsx"]
Server["Express Server<br/>backend/server.js"]
OpenAI["OpenAI SDK"]
Storage["Disk Storage<br/>uploads/"]
InMemDB["In-Memory DB<br/>users/tasks"]
Client --> Pricing
Client --> Premium
Client --> Auth
Pricing --> Server
Premium --> Server
Auth --> Server
Server --> InMemDB
Server --> OpenAI
Server --> Storage
```

**Diagram sources**
- [server.js](file://backend/server.js)
- [use-auth.ts](file://hooks/use-auth.ts)
- [page.tsx](file://app/pricing/page.tsx)
- [premium-upgrade-banner.tsx](file://components/premium-upgrade-banner.tsx)

## Detailed Component Analysis

### Express Server Configuration and Middleware
- Environment configuration: Loads environment variables from the repository root.
- CORS: Enabled globally for development convenience.
- Body parsing: JSON body parser configured.
- File uploads: Multer configured with disk storage and timestamped filenames.
- In-memory database: Users and tasks arrays for demonstration.
- Premium middleware: Validates user plan before accessing premium endpoints.

```mermaid
flowchart TD
Start(["Server Startup"]) --> Env["Load .env from repo root"]
Env --> CORS["Enable CORS"]
CORS --> JSON["Enable JSON Body Parser"]
JSON --> Multer["Configure Multer Disk Storage"]
Multer --> DB["Initialize In-Memory DB"]
DB --> Routes["Define Routes"]
Routes --> Listen["Listen on Port 3000"]
Listen --> End(["Ready"])
```

**Diagram sources**
- [server.js](file://backend/server.js)

**Section sources**
- [server.js](file://backend/server.js)

### Premium Middleware
The middleware enforces premium-only access by checking the user’s plan against the in-memory database.

```mermaid
flowchart TD
Req["Incoming Request"] --> FindUser["Find User by ID"]
FindUser --> IsPremium{"Plan is Premium?"}
IsPremium --> |Yes| Next["Proceed to Endpoint"]
IsPremium --> |No| Deny["Return 403 Forbidden"]
```

**Diagram sources**
- [server.js](file://backend/server.js)

**Section sources**
- [server.js](file://backend/server.js)

### Task Management Endpoints
- POST /tasks: Filters tasks by user ID and completion status.
- POST /add-task: Creates a new task with auto-incremented ID.
- POST /complete-task: Marks a task as completed.

```mermaid
sequenceDiagram
participant Client as "Client"
participant Server as "Express Server"
participant DB as "In-Memory DB"
Client->>Server : POST /tasks {userId}
Server->>DB : Filter tasks by userId and completed=false
DB-->>Server : Pending tasks
Server-->>Client : JSON tasks
Client->>Server : POST /add-task {userId,title}
Server->>DB : Push new task
DB-->>Server : New task
Server-->>Client : JSON task
Client->>Server : POST /complete-task {taskId}
Server->>DB : Set completed=true
DB-->>Server : OK
Server-->>Client : {message : "Task completed"}
```

**Diagram sources**
- [server.js](file://backend/server.js)

**Section sources**
- [server.js](file://backend/server.js)

### Premium Endpoints

#### POST /ai-suggest
- Purpose: AI-generated task suggestions for premium users.
- Behavior: Requires premium plan; otherwise returns 403.
- Integrates with OpenAI chat completions.

```mermaid
sequenceDiagram
participant Client as "Client"
participant Server as "Express Server"
participant Middleware as "Premium Middleware"
participant OpenAI as "OpenAI API"
Client->>Server : POST /ai-suggest {userId,progress}
Server->>Middleware : checkPremium()
Middleware-->>Server : Allow if premium
Server->>OpenAI : chat.completions.create(...)
OpenAI-->>Server : Suggestion
Server-->>Client : {suggestion}
```

**Diagram sources**
- [server.js](file://backend/server.js)

**Section sources**
- [server.js](file://backend/server.js)

#### POST /upload
- Purpose: Upload an image and receive AI feedback for premium users.
- Behavior: Requires premium plan; otherwise returns 403.
- Stores uploaded files to uploads/ and generates feedback via OpenAI.

```mermaid
sequenceDiagram
participant Client as "Client"
participant Server as "Express Server"
participant Middleware as "Premium Middleware"
participant Multer as "Multer"
participant OpenAI as "OpenAI API"
Client->>Server : POST /upload {file}
Server->>Middleware : checkPremium()
Middleware-->>Server : Allow if premium
Server->>Multer : Save file to uploads/
Multer-->>Server : File path
Server->>OpenAI : chat.completions.create(image analysis)
OpenAI-->>Server : Feedback
Server-->>Client : {feedback}
```

**Diagram sources**
- [server.js](file://backend/server.js)

**Section sources**
- [server.js](file://backend/server.js)

#### POST /upgrade
- Purpose: Simulate upgrading a user to premium.
- Behavior: Updates user plan in memory; returns success message.

```mermaid
sequenceDiagram
participant Client as "Client"
participant Server as "Express Server"
participant DB as "In-Memory DB"
Client->>Server : POST /upgrade {userId}
Server->>DB : Find user by ID
DB-->>Server : User
Server->>DB : Set plan=premium
DB-->>Server : OK
Server-->>Client : {message : "Upgraded to Premium"}
```

**Diagram sources**
- [server.js](file://backend/server.js)

**Section sources**
- [server.js](file://backend/server.js)

### Next.js API Routes Integration
The frontend integrates with Next.js API routes for AI features. These routes mirror backend capabilities but run within the Next.js runtime and can leverage environment variables similarly.

- AI Suggest: Returns mock suggestions if API key is missing or placeholder; otherwise queries OpenAI.
- Classify Task: Determines task type (written/physical/none) using OpenAI.
- Upload: Converts file to base64 and sends to OpenAI for feedback.
- Verify Task: Evaluates proof image and returns XP multiplier and feedback.

```mermaid
sequenceDiagram
participant FE as "Frontend"
participant NextAPI as "Next.js API"
participant OpenAI as "OpenAI API"
FE->>NextAPI : POST /api/ai-suggest {progress}
NextAPI->>OpenAI : chat.completions.create(...)
OpenAI-->>NextAPI : Suggestion
NextAPI-->>FE : {suggestion}
FE->>NextAPI : POST /api/classify-task {title,description}
NextAPI->>OpenAI : chat.completions.create(...)
OpenAI-->>NextAPI : Type
NextAPI-->>FE : {type}
FE->>NextAPI : POST /api/upload {file}
NextAPI-->>FE : {feedback}
FE->>NextAPI : POST /api/verify-task {title,description,imageBase64,mimeType}
NextAPI->>OpenAI : chat.completions.create(JSON response)
OpenAI-->>NextAPI : {xpMultiplier,feedback}
NextAPI-->>FE : {xpMultiplier,feedback}
```

**Diagram sources**
- [route.ts](file://app/api/ai-suggest/route.ts)
- [route.ts](file://app/api/classify-task/route.ts)
- [route.ts](file://app/api/upload/route.ts)
- [route.ts](file://app/api/verify-task/route.ts)

**Section sources**
- [route.ts](file://app/api/ai-suggest/route.ts)
- [route.ts](file://app/api/classify-task/route.ts)
- [route.ts](file://app/api/upload/route.ts)
- [route.ts](file://app/api/verify-task/route.ts)

### Premium Features and User Data Management
- Premium products and tiers are defined in a typed model and rendered on the pricing page.
- Premium cosmetics are categorized and filtered for free vs. premium.
- Authentication hook manages user state, premium status, avatar URLs, and local persistence.
- Game state hook tracks tasks, XP, levels, streaks, and achievements locally.

```mermaid
classDiagram
class PremiumProduct {
+string id
+string name
+string description
+number priceInCents
+string priceDisplay
+string[] features
+boolean popular
+string tier
+string avatarUrl
}
class Cosmetic {
+string id
+string name
+string description
+string color
+string borderColor
+string glowColor
+boolean isPremium
+string frameStyle
}
class User {
+string username
+string gender
+boolean isPremium
+string selectedCosmetic
+string avatarUrl
+string jobClass
+string premiumTier
+number createdAt
}
PremiumProduct <.. PremiumProducts : "collection"
Cosmetic <.. PremiumCosmetics : "collection"
User <.. AuthHook : "managed by"
```

**Diagram sources**
- [premium-products.ts](file://lib/premium-products.ts)
- [premium-cosmetics.ts](file://lib/premium-cosmetics.ts)
- [use-auth.ts](file://hooks/use-auth.ts)

**Section sources**
- [premium-products.ts](file://lib/premium-products.ts)
- [premium-cosmetics.ts](file://lib/premium-cosmetics.ts)
- [use-auth.ts](file://hooks/use-auth.ts)
- [use-game-state.ts](file://hooks/use-game-state.ts)
- [game-constants.ts](file://lib/game-constants.ts)

### Pricing Page and Premium Upgrade Flow
- Pricing page renders premium tiers and features, previews 3D avatars, and triggers premium upgrades.
- On upgrade, the auth hook updates premium status and avatar URL, then navigates to the dashboard.

```mermaid
sequenceDiagram
participant User as "User"
participant Pricing as "Pricing Page"
participant Auth as "Auth Hook"
participant Local as "localStorage"
User->>Pricing : Click "Upgrade Now"
Pricing->>Auth : updatePremiumStatus(true, tier)
Auth->>Local : Persist updated user
Auth-->>Pricing : Success
Pricing-->>User : Toast + Redirect
```

**Diagram sources**
- [page.tsx](file://app/pricing/page.tsx)
- [use-auth.ts](file://hooks/use-auth.ts)

**Section sources**
- [page.tsx](file://app/pricing/page.tsx)
- [use-auth.ts](file://hooks/use-auth.ts)

## Dependency Analysis
- Backend dependencies include Express, CORS, Multer, dotenv, and OpenAI SDK.
- Frontend dependencies include Next.js, OpenAI SDK, analytics, and UI libraries.
- Premium data models and hooks are shared across the frontend.

```mermaid
graph LR
BE["backend/server.js"] --> Express["express"]
BE --> CORS["cors"]
BE --> Multer["multer"]
BE --> Dotenv["dotenv"]
BE --> OpenAI["openai"]
FE_Next["Next.js Runtime"] --> OpenAI
FE_Next --> UI["UI Libraries"]
FE_Next --> Analytics["@vercel/analytics"]
```

**Diagram sources**
- [package.json](file://backend/package.json)
- [package.json](file://package.json)

**Section sources**
- [package.json](file://backend/package.json)
- [package.json](file://package.json)

## Performance Considerations
- In-memory storage: Suitable for demos; consider migrating to a persistent database for production.
- File uploads: Ensure appropriate disk quotas and cleanup policies for uploads/.
- OpenAI calls: Implement retry logic, rate limiting, and caching for repeated prompts.
- Middleware overhead: Keep middleware lightweight; avoid heavy synchronous operations.
- Frontend caching: Use SWR or React Query for API responses to reduce redundant requests.

## Troubleshooting Guide
Common issues and resolutions:
- Missing environment variables: Ensure OPENAI_API_KEY is set in the backend .env and NEXT_PUBLIC environment variables are configured for frontend routes.
- CORS errors: Verify that the frontend origin is allowed; adjust CORS settings accordingly.
- Multer upload failures: Confirm uploads/ directory exists and is writable; validate file size limits.
- Premium endpoint 403: Ensure the user plan is set to premium in the in-memory database.
- Next.js API route errors: Check for proper JSON parsing and OpenAI API key configuration.

**Section sources**
- [server.js](file://backend/server.js)
- [route.ts](file://app/api/ai-suggest/route.ts)
- [route.ts](file://app/api/classify-task/route.ts)
- [route.ts](file://app/api/upload/route.ts)
- [route.ts](file://app/api/verify-task/route.ts)

## Conclusion
The backend server provides essential task management and premium AI features, while Next.js API routes complement frontend capabilities. Premium gating, user data management, and local persistence enable a cohesive user experience. For production, replace in-memory storage, secure environment variables, and implement robust monitoring and error handling.

## Appendices

### API Reference

- POST /tasks
  - Description: Retrieve pending tasks for a user.
  - Request body: { userId: number }
  - Response: Array of tasks.

- POST /add-task
  - Description: Add a new task for a user.
  - Request body: { userId: number, title: string }
  - Response: New task object.

- POST /complete-task
  - Description: Mark a task as completed.
  - Request body: { taskId: number }
  - Response: { message: string }

- POST /ai-suggest
  - Description: Premium endpoint to get AI task suggestions.
  - Request body: { userId: number, progress: any }
  - Response: { suggestion: string }
  - Security: Requires premium plan.

- POST /upload
  - Description: Premium endpoint to upload an image and receive AI feedback.
  - Request body: Form data with file field.
  - Response: { feedback: string }
  - Security: Requires premium plan.

- POST /upgrade
  - Description: Simulate upgrading a user to premium.
  - Request body: { userId: number }
  - Response: { message: string }

### Frontend Integration Examples
- Pricing page upgrade flow updates premium status and avatar URL via the auth hook.
- Premium banner conditionally renders for non-premium users and navigates to pricing.
- Game state hook persists tasks and XP locally; premium features unlock additional cosmetic tiers.

**Section sources**
- [page.tsx](file://app/pricing/page.tsx)
- [premium-upgrade-banner.tsx](file://components/premium-upgrade-banner.tsx)
- [use-auth.ts](file://hooks/use-auth.ts)
- [use-game-state.ts](file://hooks/use-game-state.ts)