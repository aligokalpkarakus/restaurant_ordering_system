# Restaurant Ordering System

This project is a restaurant ordering system application consisting of frontend and backend components.

## Technologies Used

### Backend
- Python 3.8+
- FastAPI
- SQLAlchemy
- PostgreSQL
- Uvicorn
- Pydantic
- Python-dotenv
- psycopg2-binary
- Pytest (Test framework)

### Frontend
- React 18
- Node.js
- Material-UI (MUI)
- Tailwind CSS
- React Router DOM
- Axios
- Date-fns
- Emotion (styled-components)

## System Requirements

- Python 3.8 or higher
- Node.js 14.x or higher
- PostgreSQL 14.x or higher
- npm or yarn

## Installation Steps

### 1. PostgreSQL Installation

1. [Download PostgreSQL](https://www.postgresql.org/download/) and install
2. During installation:
   - Use default port (5432)
   - Use default username "postgres"
   - Set password as "postgres" (or set your own password)
3. After installation:
   - Open pgAdmin
   - Create a new database: "restaurant"
   - Left click on restaurant database, choose "Restore" option. Make the format "Plain". Then choose "restaurant.sql" file from filename section.

### 2. Project Files Preparation

1. Download project RAR files:
   - `files_group7_part1.rar`
   - `files_group7_part2.rar`

2. Extract RAR files to the same folder:
   - Extract both RAR files to the same folder
   - Files should be under the `temp_restaurant` folder

### 3. Backend Setup

1. Navigate to backend directory:
```bash
cd temp_restaurant/backend
```

2. Create and activate Python virtual environment (in the backend folder) (but you don't have to do this,  to run backend in the cmd without venv: uvicorn app.main:app --reload):
```bash
# For Windows
python -m venv venv
.\venv\Scripts\activate



# For Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. Install required Python packages (in the backend folder):
```bash
pip install -r requirements.txt
pip install psycopg2-binary
pip install email-validator
pip install pytest (if you want to run tests yourself, make sure the data exist if you'll work on existing data)
```

4. Check database connection settings:
- In `backend\database.py` file, ensure the following connection details are correct:
```python
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/restaurant"
```
- If you set a different password during PostgreSQL installation, replace "postgres" in the URL with your password

5. Run tests (optional) (in the backend folder):
```bash
pytest [test_name.py]
```

### 4. Frontend Setup

1. Navigate to frontend directory:
```bash
cd ../frontend
```

2. Install Node.js and npm:
   - [Download Node.js](https://nodejs.org/) (LTS version recommended)
   - npm will be installed automatically with Node.js

3. Install React and basic dependencies (in the frontend folder):
```bash
npm install
# or
yarn install
```

4. Install Material-UI and other frontend dependencies (in the frontend folder):
```bash
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install @mui/x-date-pickers
npm install date-fns
npm install react-router-dom
npm install axios
```

5. Install Tailwind CSS and development dependencies (in the frontend folder):
```bash
npm install -D tailwindcss postcss autoprefixer
```

6. Configure Tailwind CSS (in the frontend folder):
```bash
npx tailwindcss init -p
```

7. Edit `tailwind.config.js` file (in the frontend folder) (first search this file, if the below exist in there, you can skip this):
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

8. Add Tailwind directives to your CSS file (`src/index.css`) (in the frontend folder) (first search this file, if the below exist in there, you can skip this):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Running the Project

### Starting Backend

1. Make sure you're in the backend directory 
2. Ensure virtual environment is active (optional, you can run backend without venv)
3. Run the following command:
```bash
uvicorn app.main:app --reload
```

### Starting Frontend

1. Make sure you're in the frontend directory
2. Run the following command:
```bash
npm start
# or
yarn start
```

## Application Access

After starting the application, you can access it through the following URLs:

1. Login Page (for staff):
   - http://localhost:3000/login

2. Menu Pages (assume accessed via QR, implementation not done):
   - Table 1 Menu: http://localhost:3000/menu/table/1
   - Table 2 Menu: http://localhost:3000/menu/table/2
   - For other tables: http://localhost:3000/menu/[table_number] (6 tables available, can be increased from Table Management in admin panel)

3. Management Panel (requires login):
   - Admin Panel: http://localhost:3000/admin
   - Kitchen Panel: http://localhost:3000/kitchen
   - Waiter Panel: http://localhost:3000/waiter-panel

Please remember that to order, the waiter must first start a session at the table you are sitting at from the waiter screen (/waiter-panel, to access login with waiter account). 
Once the session is started, you can place your orders.


## Default User Credentials

The system includes the following users:

1. Admin User:
   - Email: admin@example.com
   - Password: admin123

2. Kitchen User:
   - Email: chef@example.com
   - Password: chef123

3. Waiter User:
   - Email: server1@example.com
   - Password: server1

4. Waiter User:
   - Email: server2@example.com
   - Password: server2

## Troubleshooting

1. Database Connection Error:
   - Ensure PostgreSQL service is running
   - Check database connection details
   - Verify PostgreSQL is running on port 5432
   - Check database username and password

	We had an error like wrong password, if you encounter this error 
	go to ..\PostgreSQL\14\data find pg_hba.conf and at the bottom you will
	see the line: # TYPE  DATABASE        USER            ADDRESS                 METHOD

	Make it like this (making methods "trust")(don't forget this is unreliable, just for your own computer and development environment):
	# TYPE  DATABASE        USER            ADDRESS                 METHOD

	# "local" is for Unix domain socket connections only
	local   all             all                                     trust
	# IPv4 local connections:
	host    all             all             127.0.0.1/32            trust
	# IPv6 local connections:
	host    all             all             ::1/128                 trust
	# Allow replication connections from localhost, by a user with the
	# replication privilege.
	local   replication     all                                     trust
	host    replication     all             127.0.0.1/32            trust
	host    replication     all             ::1/128                 trust

2. Backend Startup Error:
   - Ensure virtual environment is active
   - Verify all dependencies are installed
   - Try a different port if there's a port conflict

3. Frontend Startup Error:
   - Check Node.js version compatibility
   - Delete `node_modules` folder and run `npm install` again
   - Verify Tailwind CSS configuration
   - Check Material-UI dependencies installation

## Important Notes

- Frontend and backend must be running simultaneously
- Backend runs on port 8000 by default
- Frontend runs on port 3000 by default

## Contact

If you encounter any issues or need assistance, please contact us. 

