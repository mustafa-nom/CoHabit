# CoHabit Database Setup

MySQL database schema for the CoHabit household management application.

## Features

- 🔐 **User Authentication** - User accounts with secure password storage
- 🏠 **Household Management** - Create households with unique invite codes
- 👥 **Member Management** - Users can join households and have roles
- ✅ **Task System** - Create tasks, assign to members, track completions
- 📊 **Task Tracking** - Task assignments and completion records

## Prerequisites

- MySQL 8.0+
- MySQL Workbench (recommended) or MySQL CLI

## Database Setup

### Step 1: Create Database

Open MySQL Workbench or MySQL CLI and run:

```sql
CREATE DATABASE IF NOT EXISTS cohabit_db;
USE cohabit_db;
```

### Step 2: Run Schema Script

**Option 1 - MySQL Workbench:**
1. File → Open SQL Script → Select `schema.sql`
2. Execute the script (⚡ Execute button)

**Option 2 - MySQL CLI:**
```bash
mysql -u YOUR_USERNAME -p cohabit_db < schema.sql
```

**Option 3 - From project root:**
```bash
cd database
mysql -u YOUR_USERNAME -p
```
Then in MySQL:
```sql
USE cohabit_db;
SOURCE schema.sql;
```

### Step 3: Verify Tables

Run this query to verify all tables were created:

```sql
SHOW TABLES;
```

You should see 8 core tables:
- `users` - User accounts
- `auth_log` - Authentication history
- `households` - Household groups
- `members` - User-household relationships
- `requests` - Household join requests
- `tasks` - Task definitions
- `task_assignments` - User-task assignments
- `task_completions` - Task completion records

Additional tables (schema includes but not yet implemented):
- `password_reset` - Password reset tokens (future)
- `verification_codes` - Email/phone verification (future)
- `user_stats` - User statistics (future)
- `notifications` - User notifications (future)

## Backend Configuration

The Spring Boot backend is already configured to connect to this database.

### Configuration File

**Location**: `backend/src/main/resources/application.properties`

```properties
# Database Connection
spring.datasource.url=jdbc:mysql://localhost:3306/cohabit_db
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

### Setup Instructions

1. **Copy the example configuration:**
   ```bash
   cd backend/src/main/resources
   cp application.properties.example application.properties
   ```

2. **Edit `application.properties`** and update:
   - `spring.datasource.username` - Your MySQL username
   - `spring.datasource.password` - Your MySQL password

3. **Start the backend:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

**⚠️ IMPORTANT**: Never commit `application.properties` to version control! It's already in `.gitignore`.

## Database Schema Overview

### Core Tables (Implemented)

**User Management:**
- **users** - User accounts with email, username, display name, password (BCrypt hashed)
- **auth_log** - Login/logout tracking for security auditing

**Household Management:**
- **households** - Household groups with name and unique 6-character invite code
- **members** - User-household relationships with roles (owner, admin, member)
- **requests** - Pending household join requests (pending, approved, rejected)

**Task System:**
- **tasks** - Task definitions with name, description, points, due dates
- **task_assignments** - Assigns tasks to specific household members
- **task_completions** - Records when tasks are completed by members

### Additional Tables (Schema Exists, Not Yet Implemented)

These tables exist in the schema but are not used in the current simplified version:
- **password_reset** - For password reset functionality (future feature)
- **verification_codes** - For email/phone verification (future feature)
- **user_stats** - For XP/leaderboard system (removed from scope)
- **notifications** - For user notifications (future feature)

## Important Database Constraints

### Unique Constraints
- `users.email` - Each email can only be used once
- `users.username` - Each username must be unique (if provided)
- `households.invite_code` - Unique 6-character code per household
- `(household_id, user_id)` in members - User can only join each household once
- `(task_id, assignee_user_id)` in task_assignments - User can only be assigned to a task once

### Foreign Key Cascades
- **Deleting a household** → Automatically deletes all members, tasks, requests, etc.
- **Deleting a user** → Automatically deletes their memberships, task assignments, etc.
- **Deleting a task** → Automatically deletes task assignments and completions

### Check Constraints
- **Task completions**: Verifier cannot be the same user as the completer
- **Tasks**: Either `due_date` or `recurrence_rule` should be set (for recurring tasks)

## Database Indexes

The schema includes indexes on:
- Foreign keys (`household_id`, `user_id`, `task_id`, etc.) for faster joins
- Status fields (`status`, `role`) for filtering queries
- Timestamps (`created_at`, `completed_at`) for sorting
- Unique constraints for data integrity

---

## Testing the Database

### Test Connection
```bash
mysql -u YOUR_USERNAME -p
```

Then in MySQL:
```sql
USE cohabit_db;
SHOW TABLES;
DESCRIBE users;
```

### Create Test User
```sql
INSERT INTO users (email, username, password_hash, display_name)
VALUES ('test@example.com', 'testuser', 'hashed_password_here', 'Test User');
```

**Note**: Don't insert users manually in production. Use the backend API's registration endpoint which properly hashes passwords with BCrypt.

---

## Troubleshooting

### "Database connection failed"
- Verify MySQL is running: `mysql -u root -p`
- Check credentials in `backend/src/main/resources/application.properties`
- Ensure database exists: `SHOW DATABASES;` should show `cohabit_db`

### "Table doesn't exist" errors
- Run the schema script again: `SOURCE schema.sql;`
- Check `spring.jpa.hibernate.ddl-auto=update` is in application.properties

### "Access denied for user"
- Verify MySQL username and password
- Grant permissions if needed:
  ```sql
  GRANT ALL PRIVILEGES ON cohabit_db.* TO 'YOUR_USERNAME'@'localhost';
  FLUSH PRIVILEGES;
  ```

---

## See Also

- [Main README](../README.md) - Project overview and quick start
- [Backend API](../backend/README.md) - API endpoints and documentation
- [Frontend Web](../frontend-web/README.md) - React web app setup

---

## Security Best Practices

🔒 **Production Database Security:**

1. **Never commit passwords** to version control (use `.env` files)
2. **Use strong passwords** for production databases (20+ random characters)
3. **Create dedicated database user** with limited permissions (not root)
4. **Enable SSL/TLS** for database connections in production
5. **Regular backups** - Set up automated database backups
6. **Limit network access** - Only allow backend server to access database

**Example: Create dedicated user**
```sql
CREATE USER 'cohabit_app'@'localhost' IDENTIFIED BY 'strong_random_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON cohabit_db.* TO 'cohabit_app'@'localhost';
FLUSH PRIVILEGES;
```

---

## License

Private - All Rights Reserved

