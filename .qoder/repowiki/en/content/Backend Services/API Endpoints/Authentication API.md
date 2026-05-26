# Authentication API

<cite>
**Referenced Files in This Document**
- [server.js](file://backend/server.js)
- [use-auth.ts](file://hooks/use-auth.ts)
- [page.tsx](file://app/login/page.tsx)
- [page.tsx](file://app/pricing/page.tsx)
- [premium-products.ts](file://lib/premium-products.ts)
- [premium-upgrade-banner.tsx](file://components/premium-upgrade-banner.tsx)
- [layout.tsx](file://app/layout.tsx)
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

## Introduction
This document provides API documentation for user authentication and premium upgrade endpoints within a Next.js application. It explains the simulated premium upgrade flow, the fake database implementation, authentication integration with the frontend login system, user session management, and premium status verification. It also covers the simulated payment process, user registration patterns, and authentication state management across the application.

## Project Structure
The authentication and premium upgrade system spans both the frontend React application and a backend Express server:
- Frontend: Next.js pages for login and pricing, React hooks for authentication state, and UI components for premium upgrades.
- Backend: Express server exposing endpoints for task management, AI-powered features (premium), and the premium upgrade endpoint.

```mermaid
graph TB
subgraph "Frontend (Next.js)"
Login["Login Page<br/>app/login/page.tsx"]
Pricing["Pricing Page<br/>app/pricing/page.tsx"]
AuthHook["Auth Hook<br/>hooks/use-auth.ts"]
Banner["Premium Banner<br/>components/premium-upgrade-banner.tsx"]
Layout["Root Layout<br/>app/layout.tsx"]
end
subgraph "Backend (Express)"
Server["Express Server<br/>backend/server.js"]
CheckPremium["Middleware: checkPremium"]
Upgrade["POST /upgrade"]
Tasks["POST /tasks"]
AddTask["POST /add-task"]
CompleteTask["POST /complete-task"]
AISuggest["POST /ai-suggest"]
Upload["POST /upload"]
end
Login --> AuthHook
Pricing --> AuthHook
Banner --> AuthHook
AuthHook --> Pricing
AuthHook --> Login
Pricing --> Upgrade
Login --> Tasks
Login --> AddTask
Login --> CompleteTask
Login --> AISuggest
Login --> Upload
Login --> CheckPremium
Pricing --> CheckPremium
Upgrade --> Server
Tasks --> Server
AddTask --> Server
CompleteTask --> Server
AISuggest --> Server
Upload --> Server
CheckPremium --> Server
```

**Diagram sources**
- [server.js:46-52](file://backend/server.js#L46-L52)
- [server.js:140-147](file://backend/server.js#L140-L147)
- [page.tsx:270-312](file://app/login/page.tsx#L270-L312)
- [page.tsx:18-34](file://app/pricing/page.tsx#L18-L34)
- [use-auth.ts:28-58](file://hooks/use-auth.ts#L28-L58)

**Section sources**
- [server.js:1-155](file://backend/server.js#L1-L155)
- [page.tsx:1-668](file://app/login/page.tsx#L1-L668)
- [page.tsx:1-176](file://app/pricing/page.tsx#L1-L176)
- [use-auth.ts:1-167](file://hooks/use-auth.ts#L1-L167)
- [layout.tsx:1-48](file://app/layout.tsx#L1-L48)

## Core Components
- Backend Express server with:
  - Fake in-memory database for users and tasks.
  - Middleware to enforce premium plan access for premium features.
  - Endpoints for task management and AI-powered features requiring premium access.
  - Simulated premium upgrade endpoint.
- Frontend authentication hook managing user state in localStorage and providing actions to update premium status, avatar, and job class.
- Login and pricing pages orchestrating user registration, authentication, and premium upgrade flows.

Key responsibilities:
- Authentication state management and persistence.
- Premium upgrade simulation and avatar assignment.
- Premium feature gating via middleware.
- UI integration for premium banners and upgrade prompts.

**Section sources**
- [server.js:35-41](file://backend/server.js#L35-L41)
- [server.js:46-52](file://backend/server.js#L46-L52)
- [server.js:140-147](file://backend/server.js#L140-L147)
- [use-auth.ts:28-109](file://hooks/use-auth.ts#L28-L109)
- [page.tsx:18-34](file://app/pricing/page.tsx#L18-L34)

## Architecture Overview
The system integrates frontend authentication with backend premium enforcement:
- Frontend login page collects credentials and creates/validates user sessions in localStorage.
- Pricing page triggers premium upgrade, updating local state and redirecting to the dashboard.
- Premium features (AI suggestions and image upload) are gated by the checkPremium middleware, which validates the user's plan against the fake database.

```mermaid
sequenceDiagram
participant Client as "Client Browser"
participant Login as "Login Page<br/>app/login/page.tsx"
participant Auth as "Auth Hook<br/>hooks/use-auth.ts"
participant Pricing as "Pricing Page<br/>app/pricing/page.tsx"
participant Server as "Express Server<br/>backend/server.js"
Client->>Login : Submit credentials
Login->>Auth : login(username, password, gender, isPremium, jobClass)
Auth-->>Login : Store user in localStorage and state
Login-->>Client : Redirect to dashboard
Client->>Pricing : Select premium plan
Pricing->>Auth : updatePremiumStatus(true, tier)
Auth-->>Pricing : Update localStorage and state
Pricing-->>Client : Toast success and redirect
Client->>Server : Request premium feature (e.g., /ai-suggest)
Server->>Server : checkPremium middleware
Server-->>Client : 403 if not premium, otherwise feature response
```

**Diagram sources**
- [page.tsx:270-312](file://app/login/page.tsx#L270-L312)
- [use-auth.ts:60-88](file://hooks/use-auth.ts#L60-L88)
- [page.tsx:18-34](file://app/pricing/page.tsx#L18-L34)
- [server.js:46-52](file://backend/server.js#L46-L52)
- [server.js:91-106](file://backend/server.js#L91-L106)

## Detailed Component Analysis

### Backend: Premium Upgrade Endpoint
The /upgrade endpoint simulates upgrading a user to the premium plan by updating the fake database record.

- Endpoint: POST /upgrade
- Request body: { userId: number }
- Behavior:
  - Validates presence of userId.
  - Finds user in the fake database.
  - Sets user.plan to "premium".
  - Returns success message.
- Notes:
  - No external payment processing is performed; this is a simulation for demonstration.

```mermaid
sequenceDiagram
participant Client as "Client"
participant Server as "Express Server"
participant DB as "Fake Database"
Client->>Server : POST /upgrade {userId}
Server->>DB : Find user by id
DB-->>Server : User object or undefined
Server->>DB : Set user.plan = "premium"
Server-->>Client : JSON { message : "Upgraded to Premium" }
```

**Diagram sources**
- [server.js:140-147](file://backend/server.js#L140-L147)
- [server.js:35-41](file://backend/server.js#L35-L41)

**Section sources**
- [server.js:140-147](file://backend/server.js#L140-L147)

### Backend: Premium Middleware
The checkPremium middleware enforces premium access for premium features.

- Function: checkPremium(req, res, next)
- Validation:
  - Finds user by req.body.userId.
  - Rejects if user does not exist or plan is not "premium".
- Response:
  - Returns 403 with message "Upgrade to Premium" when validation fails.
  - Calls next() to proceed when valid.

```mermaid
flowchart TD
Start(["Request Received"]) --> Extract["Extract userId from request body"]
Extract --> FindUser["Find user in fake database"]
FindUser --> Exists{"User exists?"}
Exists --> |No| Deny["Return 403: Upgrade to Premium"]
Exists --> |Yes| CheckPlan["Check user.plan equals 'premium'"]
CheckPlan --> IsPremium{"Is premium?"}
IsPremium --> |No| Deny
IsPremium --> |Yes| Allow["Call next() to proceed"]
```

**Diagram sources**
- [server.js:46-52](file://backend/server.js#L46-L52)
- [server.js:35-41](file://backend/server.js#L35-L41)

**Section sources**
- [server.js:46-52](file://backend/server.js#L46-L52)

### Backend: Premium Features (AI Suggestion and Image Upload)
Premium features are protected by the checkPremium middleware:
- POST /ai-suggest: Requires premium plan; responds with AI-generated suggestions.
- POST /upload: Requires premium plan; accepts a single file and responds with AI feedback.

```mermaid
sequenceDiagram
participant Client as "Client"
participant Server as "Express Server"
participant Middleware as "checkPremium"
participant OpenAI as "OpenAI API"
Client->>Server : POST /ai-suggest {userId, progress}
Server->>Middleware : Validate premium
Middleware-->>Server : next() if premium
Server->>OpenAI : Generate suggestion
OpenAI-->>Server : Suggestion response
Server-->>Client : JSON { suggestion }
Client->>Server : POST /upload {userId, file}
Server->>Middleware : Validate premium
Middleware-->>Server : next() if premium
Server->>OpenAI : Analyze image
OpenAI-->>Server : Feedback response
Server-->>Client : JSON { feedback }
```

**Diagram sources**
- [server.js:91-106](file://backend/server.js#L91-L106)
- [server.js:111-135](file://backend/server.js#L111-L135)
- [server.js:46-52](file://backend/server.js#L46-L52)

**Section sources**
- [server.js:91-106](file://backend/server.js#L91-L106)
- [server.js:111-135](file://backend/server.js#L111-L135)

### Frontend: Authentication Hook (use-auth)
The use-auth hook manages user state and authentication-related actions:
- State:
  - user: User object persisted in localStorage.
  - isLoading: Loading state during hydration.
- Actions:
  - login(username, password, gender, isPremium, jobClass): Creates a new user and stores in localStorage.
  - validateLogin(username, password): Validates credentials against stored password.
  - updatePremiumStatus(isPremium, tier): Updates premium status and avatar URL in localStorage.
  - updateCosmetic(cosmetic): Updates selected cosmetic.
  - updateAvatarUrl(url): Updates avatar URL.
  - updateJobClass(jobClass): Updates job class.
  - logout(): Clears user from localStorage and state.
- Avatar logic:
  - Ensures premium users have a premium avatar URL based on tier.
  - Ensures non-premium users have a default avatar based on gender.

```mermaid
classDiagram
class User {
+string username
+("male"|"female") gender
+boolean isPremium
+string selectedCosmetic
+string avatarUrl
+("shadow"|"knight"|"berserker") jobClass
+("starter"|"elite"|"sovereign") premiumTier
+number createdAt
}
class AuthHook {
+User user
+boolean isLoading
+login(username, password, gender, isPremium, jobClass) boolean
+validateLogin(username, password) boolean
+updatePremiumStatus(isPremium, tier) void
+updateCosmetic(cosmetic) void
+updateAvatarUrl(url) void
+updateJobClass(jobClass) void
+logout() void
+boolean isLoggedIn
}
AuthHook --> User : "manages"
```

**Diagram sources**
- [use-auth.ts:4-13](file://hooks/use-auth.ts#L4-L13)
- [use-auth.ts:28-167](file://hooks/use-auth.ts#L28-L167)

**Section sources**
- [use-auth.ts:28-167](file://hooks/use-auth.ts#L28-L167)

### Frontend: Login Page
The login page handles user registration and authentication:
- Collects username, password, gender, job class, and optional premium selection.
- On submit:
  - Validates inputs.
  - For new users: calls login to create and persist user.
  - For existing users: validates credentials and logs in.
  - Redirects to the dashboard upon successful login.

```mermaid
flowchart TD
Start(["Login Form Submit"]) --> Validate["Validate username and password"]
Validate --> Valid{"Inputs valid?"}
Valid --> |No| Error["Show error message"]
Valid --> |Yes| NewUser{"New user?"}
NewUser --> |Yes| CreateUser["Call login() to create user"]
CreateUser --> SuccessCreate["Redirect to dashboard"]
NewUser --> |No| ValidateCreds["Call validateLogin()"]
ValidateCreds --> ValidCreds{"Credentials valid?"}
ValidCreds --> |No| Error
ValidCreds --> |Yes| LoginUser["Call login() to set session"]
LoginUser --> SuccessLogin["Redirect to dashboard"]
```

**Diagram sources**
- [page.tsx:270-312](file://app/login/page.tsx#L270-L312)
- [use-auth.ts:60-88](file://hooks/use-auth.ts#L60-L88)
- [use-auth.ts:149-152](file://hooks/use-auth.ts#L149-L152)

**Section sources**
- [page.tsx:270-312](file://app/login/page.tsx#L270-L312)
- [use-auth.ts:60-88](file://hooks/use-auth.ts#L60-L88)
- [use-auth.ts:149-152](file://hooks/use-auth.ts#L149-L152)

### Frontend: Pricing Page and Premium Upgrade
The pricing page allows users to select a premium tier and trigger an upgrade:
- If not logged in, redirects to the login page.
- Calls updatePremiumStatus(true, tier) to update local state and avatar.
- Shows success toast and redirects to the dashboard.

```mermaid
sequenceDiagram
participant Client as "Client"
participant Pricing as "Pricing Page"
participant Auth as "Auth Hook"
Client->>Pricing : Click "Upgrade Now"
Pricing->>Auth : updatePremiumStatus(true, tier)
Auth-->>Pricing : Update localStorage and state
Pricing-->>Client : Show success toast and redirect
```

**Diagram sources**
- [page.tsx:18-34](file://app/pricing/page.tsx#L18-L34)
- [use-auth.ts:90-109](file://hooks/use-auth.ts#L90-L109)

**Section sources**
- [page.tsx:18-34](file://app/pricing/page.tsx#L18-L34)
- [use-auth.ts:90-109](file://hooks/use-auth.ts#L90-L109)

### Frontend: Premium Upgrade Banner
The premium upgrade banner is shown only to non-premium users and links to the pricing page.

```mermaid
flowchart TD
Load(["Render Premium Banner"]) --> CheckPremium{"user.isPremium?"}
CheckPremium --> |Yes| Hide["Do not render banner"]
CheckPremium --> |No| Show["Render banner with upgrade CTA"]
```

**Diagram sources**
- [premium-upgrade-banner.tsx:7-12](file://components/premium-upgrade-banner.tsx#L7-L12)

**Section sources**
- [premium-upgrade-banner.tsx:7-12](file://components/premium-upgrade-banner.tsx#L7-L12)

### Frontend: Root Layout and Notifications
The root layout configures global UI elements:
- Adds Toaster for notifications.
- Sets site metadata and theme.

**Section sources**
- [layout.tsx:33-47](file://app/layout.tsx#L33-L47)

## Dependency Analysis
- Frontend dependencies:
  - use-auth hook depends on localStorage for persistence and provides UI actions.
  - Login and pricing pages depend on use-auth for authentication and premium state updates.
  - Premium banner depends on use-auth for visibility logic.
- Backend dependencies:
  - checkPremium middleware depends on the fake database users array.
  - Premium endpoints depend on checkPremium middleware.
  - Non-premium endpoints operate independently of premium checks.

```mermaid
graph TB
AuthHook["hooks/use-auth.ts"] --> Login["app/login/page.tsx"]
AuthHook --> Pricing["app/pricing/page.tsx"]
AuthHook --> Banner["components/premium-upgrade-banner.tsx"]
Pricing --> Server["backend/server.js"]
Login --> Server
Server --> CheckPremium["checkPremium middleware"]
CheckPremium --> Users["Fake Database users"]
```

**Diagram sources**
- [use-auth.ts:28-167](file://hooks/use-auth.ts#L28-L167)
- [page.tsx:224-312](file://app/login/page.tsx#L224-L312)
- [page.tsx:14-34](file://app/pricing/page.tsx#L14-L34)
- [server.js:46-52](file://backend/server.js#L46-L52)
- [server.js:35-41](file://backend/server.js#L35-L41)

**Section sources**
- [use-auth.ts:28-167](file://hooks/use-auth.ts#L28-L167)
- [page.tsx:224-312](file://app/login/page.tsx#L224-L312)
- [page.tsx:14-34](file://app/pricing/page.tsx#L14-L34)
- [server.js:46-52](file://backend/server.js#L46-L52)
- [server.js:35-41](file://backend/server.js#L35-L41)

## Performance Considerations
- Local storage usage: Authentication and premium state are stored in localStorage. While convenient, frequent writes can impact performance on low-end devices. Batch updates where possible.
- Middleware overhead: checkPremium performs a simple array lookup by ID. For larger datasets, consider indexing or caching strategies.
- Simulated endpoints: Premium features rely on external AI APIs. Network latency and rate limits should be considered; implement retries and graceful fallbacks.
- UI rendering: 3D avatar previews and animations can be computationally expensive. Optimize geometry and materials, and consider lazy loading.

## Troubleshooting Guide
Common issues and resolutions:
- Upgrade endpoint returns 403:
  - Ensure the user exists in the fake database and has plan set to "premium".
  - Verify the request includes a valid userId.
- Premium features inaccessible:
  - Confirm the checkPremium middleware is applied to the endpoint.
  - Ensure the user's plan is "premium" in the fake database.
- Login failures:
  - Verify username and password are non-empty.
  - Confirm validateLogin matches stored password.
- Avatar not updating:
  - Ensure updatePremiumStatus is called with the correct tier.
  - Confirm localStorage updates and state rehydration occur after changes.

**Section sources**
- [server.js:46-52](file://backend/server.js#L46-L52)
- [server.js:140-147](file://backend/server.js#L140-L147)
- [use-auth.ts:90-109](file://hooks/use-auth.ts#L90-L109)
- [page.tsx:270-312](file://app/login/page.tsx#L270-L312)

## Conclusion
The authentication and premium upgrade system combines a frontend React hook for state management with a backend Express server implementing a fake database and premium-gated features. The /upgrade endpoint simulates a premium purchase by updating user plan state, while the checkPremium middleware ensures premium features remain restricted to premium users. The frontend login and pricing pages integrate seamlessly with the backend through straightforward API interactions, providing a cohesive user experience for authentication and premium access.