# Data Import Guide

This guide explains how to import data into your MySQL database using the provided scripts.

## Available Import Scripts

### 1. Import All Data
```bash
npm run import-all-data
```
This script imports data for all tables:
- Schools
- Communities  
- Bank Information
- Social Links
- Volunteers

### 2. Import Schools Only
```bash
npm run import-schools
```
This script imports only school data.

## Prerequisites

1. **MySQL Database**: Make sure your MySQL server is running
2. **Database Setup**: The database and tables must exist first
3. **Environment Variables**: Configure your database connection in `.env` file

## Database Setup

Before running import scripts, ensure the database tables exist by:

1. Start your application:
```bash
npm start
```
or
```bash
npm run dev
```

This will automatically create all the necessary tables through Sequelize.

## Environment Configuration

Create a `.env` file in the backend directory with your database credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=yedire_frewoch
DB_PORT=3306
```

## Data Sources

The import scripts use data from the following SQL files in `backend/imports/`:
- `schools_rows.sql` - School data
- `communities_rows.sql` - Community data  
- `bank_info_rows.sql` - Bank information
- `social_links_rows.sql` - Social media links
- `volunteers_rows.sql` - Volunteer data

## Troubleshooting

### Common Issues

1. **"Table does not exist" error**: Run the application first to create tables
2. **Connection errors**: Check your MySQL server and `.env` configuration
3. **Duplicate entry errors**: The scripts use `INSERT IGNORE` to skip duplicates

### Testing Database Connection

You can test your MySQL connection with:
```bash
npm run test-mysql
```

## Data Structure

The import scripts convert PostgreSQL format to MySQL format and handle:
- Timestamp conversion
- Boolean value conversion (`true`/`false` to `1`/`0`)
- Null value handling
- Duplicate entry prevention

## Manual Import

If you prefer to import data manually, you can:
1. Use MySQL Workbench or phpMyAdmin
2. Run the SQL files directly (note: they are in PostgreSQL format)
3. Use the `mysql` command line client

## Notes

- The scripts preserve existing data and only insert new records
- All imports are idempotent (safe to run multiple times)
- Data is validated against the Sequelize model definitions
