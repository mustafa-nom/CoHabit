#!/usr/bin/env python3
# Test database connection
# Run with: python database/test-connection.py

from db import test_connection, query

def test():
    print('Testing database connection...\n')
    
    if test_connection():
        print('\n✅ Connection successful! Testing a query...\n')
        
        try:
            # Test query - get all table names
            tables = query('SHOW TABLES')
            print('📊 Tables in database:')
            for index, table in enumerate(tables, 1):
                table_name = list(table.values())[0]
                print(f'   {index}. {table_name}')
            
            print(f'\n✅ Found {len(tables)} tables. Database is ready to use!')
        except Exception as error:
            print(f'❌ Query test failed: {error}')

if __name__ == '__main__':
    test()

