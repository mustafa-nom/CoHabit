# MySQL Workbench Setup Guide

## Step-by-Step Instructions

### Step 1: Connect to MySQL Server
1. Open **MySQL Workbench**
2. Click on your local connection (or create a new one if needed)
3. Enter your password: `w66ytLXy`
4. Click **OK** to connect

### Step 2: Create the Database
1. In MySQL Workbench, click **File** → **Open SQL Script**
2. Navigate to: `database/setup.sql`
3. Click **Open**
4. Click the **Execute** button (⚡ lightning bolt icon) or press `Ctrl+Shift+Enter`
5. This will create the `cohabit_db` database

### Step 3: Create All Tables
1. Click **File** → **Open SQL Script**
2. Navigate to: `database/schema.sql`
3. Click **Open**
4. **Important:** Make sure you're using the `cohabit_db` database:
   - Look at the bottom of the query editor
   - If it doesn't say `cohabit_db`, add this line at the top of the script:
     ```sql
     USE cohabit_db;
     ```
5. Click **Execute** (⚡) or press `Ctrl+Shift+Enter`
6. Wait for the script to complete (should take a few seconds)

### Step 4: Verify Tables Were Created
Run this query in a new query tab:
```sql
USE cohabit_db;
SHOW TABLES;
```

You should see 12 tables listed:
- auth_log
- members
- notifications
- password_reset
- requests
- task_assignments
- task_completions
- tasks
- user_stats
- users
- verification_codes
- households

### Step 5: Check Table Structure (Optional)
To see the structure of a specific table:
```sql
DESCRIBE users;
-- or
SHOW CREATE TABLE users;
```

## Troubleshooting

### Error: "Unknown database 'cohabit_db'"
**Solution:** Run `setup.sql` first to create the database.

### Error: "Table already exists"
**Solution:** The tables already exist. Either:
- Drop them first (the schema.sql includes DROP statements at the top)
- Or skip this step if you've already created them

### Error: "CHECK constraint is not supported"
**Solution:** You're using MySQL < 8.0.16. The CHECK constraints are commented out in the schema, so this shouldn't be an issue. If you see this error, make sure the CHECK constraint lines are commented (they should be by default).

### Error: "Access denied"
**Solution:** 
- Verify your MySQL password is correct: `w66ytLXy`
- Make sure your MySQL user has CREATE DATABASE and CREATE TABLE permissions
- Try running as root user

### Connection Issues
If you can't connect to MySQL:
1. Make sure MySQL Server is running
2. Check your connection settings (host: localhost, port: 3306)
3. Verify your MySQL root password

## Quick Test Query

After setup, try this query to verify everything works:
```sql
USE cohabit_db;

-- Check table count
SELECT COUNT(*) AS table_count 
FROM information_schema.tables 
WHERE table_schema = 'cohabit_db';

-- Should return 12

-- Check users table structure
DESCRIBE users;

-- Check foreign keys
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'cohabit_db'
AND REFERENCED_TABLE_NAME IS NOT NULL;
```

## Next Steps

1. **Create a database user** (recommended for security):
   ```sql
   CREATE USER 'cohabit_user'@'localhost' IDENTIFIED BY 'your_secure_password';
   GRANT ALL PRIVILEGES ON cohabit_db.* TO 'cohabit_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. **Set up your application connection** using the connection details in `database/README.md`

3. **Create seed data** for development/testing (optional)

## Connection String for Your Application

```
Host: localhost
Port: 3306
Database: cohabit_db
Username: root (or your custom user)
Password: w66ytLXy
```

