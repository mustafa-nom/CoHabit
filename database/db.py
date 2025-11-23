# Database Connection Module for Python
# Usage: from database.db import get_connection, query

import mysql.connector
from mysql.connector import pooling
import os
from dotenv import load_dotenv

load_dotenv()

# Database configuration
db_config = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', 3306)),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', 'w66ytLXy'),
    'database': os.getenv('DB_NAME', 'cohabit_db'),
    'charset': 'utf8mb4',
    'autocommit': True
}

# Create connection pool
pool = pooling.MySQLConnectionPool(
    pool_name="cohabit_pool",
    pool_size=int(os.getenv('DB_CONNECTION_LIMIT', 10)),
    **db_config
)

def get_connection():
    """Get a connection from the pool"""
    return pool.get_connection()

def test_connection():
    """Test database connection"""
    try:
        conn = get_connection()
        print('✅ Database connected successfully!')
        conn.close()
        return True
    except Exception as error:
        print(f'❌ Database connection failed: {error}')
        return False

def query(sql, params=None):
    """Execute a query and return results"""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        if params:
            cursor.execute(sql, params)
        else:
            cursor.execute(sql)
        results = cursor.fetchall()
        conn.commit()
        return results
    except Exception as error:
        conn.rollback()
        print(f'Database query error: {error}')
        raise error
    finally:
        cursor.close()
        conn.close()

