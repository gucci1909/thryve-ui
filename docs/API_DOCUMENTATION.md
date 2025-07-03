# Thryve API Documentation

## Base URL

```
Development: http://localhost:5000
Production: https://api.thryve.com
```

## Authentication

All protected endpoints require a valid JWT token. The token should be included in the request cookies automatically by the browser.

### Token Format

JWT tokens are automatically handled by the frontend and stored in HTTP-only cookies for security.

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message description",
  "status": 400,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## API Endpoints

### Authentication

#### POST /users/signup

Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "email": "john@example.com",
  "phoneCountryCode": "+1",
  "phoneNumber": "5551234567",
  "password": "securePassword123",
  "inviteCode": "COMPANY123"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "email": "john@example.com",
    "role": "user",
    "companyId": "507f1f77bcf86cd799439012"
  }
}
```

#### POST /users/login

Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "email": "john@example.com",
    "role": "user",
    "companyId": "507f1f77bcf86cd799439012"
  }
}
```

### User Management

#### GET /users/profile

Get current user profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "email": "john@example.com",
    "phoneNumber": "+15551234567",
    "role": "user",
    "companyId": "507f1f77bcf86cd799439012",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### PUT /users/profile

Update user profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "John Updated",
  "phoneNumber": "+15551234568"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John Updated",
    "email": "john@example.com",
    "phoneNumber": "+15551234568",
    "role": "user",
    "companyId": "507f1f77bcf86cd799439012",
    "updatedAt": "2024-01-15T11:30:00.000Z"
  }
}
```

#### POST /users/change-password

Change user password.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

**Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

### Company Management

#### POST /companies/verify-key

Verify company invite code.

**Request Body:**
```json
{
  "inviteCode": "COMPANY123"
}
```

**Response (200):**
```json
{
  "company": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Acme Corporation",
    "inviteCode": "COMPANY123",
    "adminId": "507f1f77bcf86cd799439013"
  }
}
```

#### GET /companies/profile

Get company profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "company": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Acme Corporation",
    "inviteCode": "COMPANY123",
    "adminId": "507f1f77bcf86cd799439013",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Leadership Assessment

#### POST /leadership-report/generate

Generate a new leadership assessment report.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "assessmentData": {
    "questions": [
      {
        "id": 1,
        "question": "How do you handle conflict in your team?",
        "answer": "I try to understand both sides and find a compromise",
        "category": "conflict-resolution"
      }
    ],
    "psychographicProfile": {
      "leadershipStyle": "democratic",
      "communicationPreference": "direct",
      "decisionMaking": "collaborative"
    }
  }
}
```

**Response (200):**
```json
{
  "report": {
    "id": "507f1f77bcf86cd799439014",
    "userId": "507f1f77bcf86cd799439011",
    "companyId": "507f1f77bcf86cd799439012",
    "scores": {
      "leadership": 85,
      "communication": 78,
      "decisionMaking": 92,
      "teamManagement": 88,
      "overall": 85.75
    },
    "insights": [
      "You excel in collaborative decision-making",
      "Consider improving direct communication in high-pressure situations"
    ],
    "recommendations": [
      "Practice assertive communication techniques",
      "Develop conflict resolution strategies"
    ],
    "generatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### GET /leadership-report/history

Get user's leadership assessment history.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response (200):**
```json
{
  "reports": [
    {
      "id": "507f1f77bcf86cd799439014",
      "scores": {
        "overall": 85.75
      },
      "generatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

### Learning Plans

#### POST /learning-plan/generate

Generate a personalized learning plan.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "assessmentId": "507f1f77bcf86cd799439014",
  "preferences": {
    "learningStyle": "visual",
    "timeCommitment": "medium",
    "focusAreas": ["communication", "leadership"]
  }
}
```

**Response (200):**
```json
{
  "plan": {
    "id": "507f1f77bcf86cd799439015",
    "userId": "507f1f77bcf86cd799439011",
    "companyId": "507f1f77bcf86cd799439012",
    "modules": [
      {
        "id": 1,
        "title": "Effective Communication",
        "description": "Learn to communicate clearly and assertively",
        "duration": "2 weeks",
        "resources": [
          {
            "type": "video",
            "title": "Communication Fundamentals",
            "url": "https://example.com/video1"
          },
          {
            "type": "article",
            "title": "Assertive Communication Techniques",
            "url": "https://example.com/article1"
          }
        ],
        "activities": [
          {
            "type": "practice",
            "title": "Role-play scenarios",
            "description": "Practice communication in various situations"
          }
        ]
      }
    ],
    "timeline": "8 weeks",
    "estimatedHours": 24,
    "generatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### GET /learning-plan/current

Get user's current learning plan.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "plan": {
    "id": "507f1f77bcf86cd799439015",
    "modules": [
      {
        "id": 1,
        "title": "Effective Communication",
        "progress": 75,
        "completed": false,
        "currentModule": true
      }
    ],
    "overallProgress": 45,
    "estimatedCompletion": "2024-03-15T10:30:00.000Z"
  }
}
```

#### PUT /learning-plan/progress

Update learning plan progress.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "moduleId": 1,
  "progress": 100,
  "completed": true
}
```

**Response (200):**
```json
{
  "message": "Progress updated successfully",
  "overallProgress": 50
}
```

### Team Management

#### POST /invite-team/send-invitation

Send invitation to team members.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "emails": ["team1@example.com", "team2@example.com"],
  "role": "user",
  "message": "Join our team on Thryve!"
}
```

**Response (200):**
```json
{
  "message": "Invitations sent successfully",
  "invitedCount": 2,
  "failedEmails": []
}
```

#### GET /invite-team/pending

Get pending team invitations.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "invitations": [
    {
      "id": "507f1f77bcf86cd799439016",
      "email": "team1@example.com",
      "role": "user",
      "status": "pending",
      "invitedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Chat & AI Features

#### POST /chat-box/send-message

Send message to AI chat assistant.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "message": "How can I improve my leadership skills?",
  "context": "leadership-development"
}
```

**Response (200):**
```json
{
  "response": "Here are some key strategies to improve your leadership skills...",
  "suggestions": [
    "Take a leadership assessment",
    "Create a learning plan",
    "Practice active listening"
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### GET /chat-box/history

Get chat conversation history.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Messages per page (default: 20)

**Response (200):**
```json
{
  "messages": [
    {
      "id": "507f1f77bcf86cd799439017",
      "type": "user",
      "content": "How can I improve my leadership skills?",
      "timestamp": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439018",
      "type": "assistant",
      "content": "Here are some key strategies...",
      "timestamp": "2024-01-15T10:31:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 2,
    "pages": 1
  }
}
```

### Admin & Management

#### GET /admin-manager/dashboard

Get admin dashboard data.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "stats": {
    "totalUsers": 150,
    "activeUsers": 120,
    "totalCompanies": 25,
    "assessmentsCompleted": 89,
    "learningPlansActive": 67
  },
  "recentActivity": [
    {
      "id": "507f1f77bcf86cd799439019",
      "type": "user_registration",
      "user": "John Doe",
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### GET /admin-manager/companies

Get all companies (founder admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by company name

**Response (200):**
```json
{
  "companies": [
    {
      "id": "507f1f77bcf86cd799439012",
      "name": "Acme Corporation",
      "inviteCode": "COMPANY123",
      "userCount": 15,
      "adminName": "Jane Smith",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### POST /admin-manager/invite-company

Invite a new company (founder admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "companyName": "New Company Inc",
  "adminEmail": "admin@newcompany.com",
  "adminName": "Admin User"
}
```

**Response (200):**
```json
{
  "message": "Company invitation sent successfully",
  "inviteCode": "NEWCOMP456",
  "company": {
    "id": "507f1f77bcf86cd799439020",
    "name": "New Company Inc",
    "inviteCode": "NEWCOMP456"
  }
}
```

### Health & Monitoring

#### GET /health

Check API health status.

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "email": "connected",
    "fileStorage": "connected"
  }
}
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute per IP
- **General endpoints**: 100 requests per minute per user
- **File upload endpoints**: 10 requests per minute per user

## Webhooks

### Available Webhooks

#### User Registration Webhook

**URL:** `POST /webhooks/user-registered`

**Payload:**
```json
{
  "event": "user.registered",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "companyId": "507f1f77bcf86cd799439012",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Assessment Completed Webhook

**URL:** `POST /webhooks/assessment-completed`

**Payload:**
```json
{
  "event": "assessment.completed",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "assessmentId": "507f1f77bcf86cd799439014",
    "scores": {
      "overall": 85.75
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

## SDKs & Libraries

### JavaScript/TypeScript SDK

```javascript
import { ThryveAPI } from '@thryve/sdk';

const api = new ThryveAPI({
  baseURL: 'https://api.thryve.com',
  token: 'your-jwt-token'
});

// Generate leadership assessment
const report = await api.leadership.generateAssessment(assessmentData);

// Get learning plan
const plan = await api.learning.getCurrentPlan();
```

### React Hook

```javascript
import { useThryveAPI } from '@thryve/react-hooks';

function MyComponent() {
  const { user, login, logout, generateAssessment } = useThryveAPI();
  
  const handleAssessment = async () => {
    const report = await generateAssessment(assessmentData);
    console.log(report);
  };
  
  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
      <button onClick={handleAssessment}>Start Assessment</button>
    </div>
  );
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

## Support

For API support and questions:

- **Documentation**: https://docs.thryve.com/api
- **Support Email**: api-support@thryve.com
- **Developer Portal**: https://developers.thryve.com
- **Status Page**: https://status.thryve.com 