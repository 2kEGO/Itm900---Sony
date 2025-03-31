# ITM900 Project

## Getting Started

### 1. Clone the Repository
```sh
git clone <repository-url>
```

### 2. Navigate to the Project Directory
```sh
cd Itm900---Sony
```

### 3. Install Dependencies
```sh
npm install
cd frontend
npm install
```

### 4. Set Up Environment Variables
Create a .env file in the root directory.
Add the following environment variables:
```sh
PORT=5002  
JWT_SECRET=<your-jwt-secret>
AWS_ACCESS_KEY=<your-aws-access-key>
AWS_SECRET_KEY=<your-aws-secret-key>
AWS_REGION=<your-aws-region>
S3_BUCKET=<your-aws-bucket-name>

DB_HOST=<your-pgadmin4-host-name>
DB_PORT=<your-pgadmin4-port>
DB_USER=<your-pgadmin4-user-name>
DB_PASSWORD=<your-pgadmin4-database-password>
DB_NAME=<your-pgadmin4-database-name>  
```

### 5. Run the Application
```sh
cd Itm900---Sony
node server.js
cd frontend
npm run dev
```
### 6. Access the Application
Open your browser and go to:
http://localhost:5002/login
