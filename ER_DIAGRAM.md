# Entity Relationship Diagram

## Database Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                            User                                │
├─────────────────────────────────────────────────────────────────┤
│ PK  id              String (UUID)                              │
│    fullName        String                                      │
│ UK  matricNumber    String                                      │
│ UK  email           String                                      │
│    passwordHash    String                                      │
│    isVerified      Boolean (default: false)                    │
│    verifyToken     String? (nullable)                           │
│    resetToken      String? (nullable)                           │
│    resetTokenExp   DateTime? (nullable)                         │
│    createdAt       DateTime (default: now())                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 1
                              │
                              │ N
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Assessment                               │
├─────────────────────────────────────────────────────────────────┤
│ PK  id                  String (UUID)                           │
│ FK  userId              String                                   │
│    answers             Json (raw answers)                       │
│    depressionScore     Int                                      │
│    anxietyScore        Int                                      │
│    stressScore         Int                                      │
│    depressionSeverity  String (enum)                            │
│    anxietySeverity     String (enum)                            │
│    stressSeverity      String (enum)                            │
│    createdAt           DateTime (default: now())                │
└─────────────────────────────────────────────────────────────────┘
```

## Relationships

- **User → Assessment**: One-to-Many
  - One User can have many Assessments
  - One Assessment belongs to exactly one User

## Field Details

### User Table
- `id`: Primary key, UUID auto-generated
- `fullName`: User's full name
- `matricNumber`: Unique matric number for FUTA students
- `email`: Unique email address for authentication
- `passwordHash`: Bcrypt hashed password
- `isVerified`: Email verification status
- `verifyToken`: Token for email verification
- `resetToken`: Token for password reset
- `resetTokenExp`: Expiration timestamp for reset token
- `createdAt`: Account creation timestamp

### Assessment Table
- `id`: Primary key, UUID auto-generated
- `userId`: Foreign key referencing User.id
- `answers`: JSON object containing raw question answers (questionId → score 0-3)
- `depressionScore`: Calculated depression score (0-42)
- `anxietyScore`: Calculated anxiety score (0-42)
- `stressScore`: Calculated stress score (0-42)
- `depressionSeverity`: Severity classification for depression
- `anxietySeverity`: Severity classification for anxiety
- `stressSeverity`: Severity classification for stress
- `createdAt`: Assessment completion timestamp

## Severity Enum Values

All severity fields use the following enum:
- `normal`
- `mild`
- `moderate`
- `severe`
- `extremely_severe`

## Indexes

- User.email (unique)
- User.matricNumber (unique)
- Assessment.userId (foreign key index)
