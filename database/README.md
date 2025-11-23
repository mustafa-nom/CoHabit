# Database Setup Instructions

## MySQL Workbench Connection

### Step 1: Create Database
1. Open MySQL Workbench
2. Connect to your MySQL server (localhost or remote)
3. Create a new database:
   ```sql
   CREATE DATABASE IF NOT EXISTS cohabit_db;
   USE cohabit_db;
   ```

### Step 2: Run Schema Script
1. Open the `schema.sql` file in MySQL Workbench
2. Execute the entire script (File → Open SQL Script → Select schema.sql → Execute)
3. Or copy and paste the contents into a new query tab and execute

### Step 3: Verify Tables
Run this query to verify all tables were created:
```sql
SHOW TABLES;
```
You should see 12 tables:
- users
- auth_log
- password_reset
- verification_codes
- households
- members
- requests
- tasks
- task_assignments
- task_completions
- user_stats
- notifications

## Connection Configuration

### For Application Connection
Use these connection parameters:

**Host:** localhost (or your MySQL server address)
**Port:** 3306 (default MySQL port)
**Database:** cohabit_db
**Username:** root (or your MySQL username)
**Password:** w66ytLXy

### Example Connection Strings

**Node.js (mysql2):**
```javascript
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'w66ytLXy',
  database: 'cohabit_db'
});
```

**Python (pymysql/mysql-connector):**
```python
import mysql.connector

config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'w66ytLXy',
    'database': 'cohabit_db'
}

connection = mysql.connector.connect(**config)
```

**Java (JDBC):**
```java
String url = "jdbc:mysql://localhost:3306/cohabit_db";
String username = "root";
String password = "w66ytLXy";
```

## Database Schema Overview

### Core Tables
- **users**: User accounts and profiles
- **households**: Shared living spaces
- **members**: User-household relationships with roles

### Task Management
- **tasks**: Task definitions
- **task_assignments**: User-task assignments
- **task_completions**: Task completion records with verification

### Authentication & Security
- **auth_log**: Login/logout tracking
- **password_reset**: Password reset tokens
- **verification_codes**: Email/phone verification codes

### Additional Features
- **requests**: Household join requests
- **user_stats**: User performance statistics per household
- **notifications**: User notifications

## Important Constraints

1. **Unique Constraints:**
   - `users.email` must be unique
   - `households.invite_code` must be unique
   - `(household_id, user_id)` in members must be unique
   - `(task_id, assignee_user_id)` in task_assignments must be unique
   - `(user_id, household_id)` in user_stats must be unique

2. **Foreign Key Cascades:**
   - Deleting a household cascades to members, tasks, requests, etc.
   - Deleting a user cascades to their memberships, assignments, etc.
   - Task deletions cascade to assignments and completions

3. **Check Constraints:**
   - Tasks: Either `due_date` or `recurrence_rule` should be set
   - Task completions: Verifier cannot be the same as completer

## Indexes

The schema includes indexes on:
- Frequently queried foreign keys
- Status fields for filtering
- Timestamps for sorting
- Unique constraints

## Next Steps

1. Test the connection from your application
2. Create a `.env` file with database credentials (don't commit passwords!)
3. Set up your ORM or database connection layer
4. Create seed data for development/testing

## Security Notes

⚠️ **Important:** The password `w66ytLXy` is hardcoded in this README for convenience, but:
- Never commit passwords to version control
- Use environment variables for production
- Create a dedicated database user with limited permissions
- Use strong passwords in production

