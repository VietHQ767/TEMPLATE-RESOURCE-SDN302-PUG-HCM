# Tài Liệu Hướng Dẫn Dự Án - PE SDN302

## 📋 Mục Lục
1. [Giới Thiệu](#giới-thiệu)
2. [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
3. [Thư Viện Sử Dụng](#thư-viện-sử-dụng)
4. [Cấu Trúc Thư Mục](#cấu-trúc-thư-mục)
5. [Cài Đặt và Chạy Dự Án](#cài-đặt-và-chạy-dự-án)
6. [Giải Thích Chi Tiết Từng File](#giải-thích-chi-tiết-từng-file)
7. [API Endpoints](#api-endpoints)
8. [Ví Dụ Sử Dụng](#ví-dụ-sử-dụng)

---

## 🎯 Giới Thiệu

**PE SDN302** là một dự án RESTful API sử dụng **Node.js + Express + MongoDB + Mongoose** để xây dựng hệ thống quản lý customers (khách hàng) với các tính năng:
- Đăng ký và đăng nhập
- Xác thực bằng JWT (JSON Web Token)
- Mã hóa mật khẩu bằng bcrypt
- Quản lý profile khách hàng
- Kết nối với MongoDB

### Công Nghệ Sử Dụng
- **Backend**: Node.js với Express.js
- **Database**: MongoDB với Mongoose ODM
- **Authentication**: JWT
- **Password Hashing**: bcrypt
- **Server**: Express HTTP Server

---

## 💻 Yêu Cầu Hệ Thống

- **Node.js**: Version 14.x trở lên
- **MongoDB**: Version 4.x trở lên
- **npm**: Đi kèm với Node.js
- **Editor**: VS Code (khuyến nghị)

---

## 📚 Thư Viện Sử Dụng

### 1. **express** (^4.21.1)
**Chức năng**: Framework web cho Node.js

**Vai trò trong project**:
- Tạo HTTP server
- Xử lý HTTP requests/responses
- Routing (định tuyến API)

**Ví dụ sử dụng**:
```javascript
const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.send("Hello World");
});
```

**Tại sao dùng Express?**
- Đơn giản, dễ học
- Nhiều middleware có sẵn
- Cộng đồng lớn
- Performant và ổn định

---

### 2. **mongoose** (^8.7.1)
**Chức năng**: ODM (Object Data Modeling) cho MongoDB

**Vai trò trong project**:
- Kết nối MongoDB
- Định nghĩa Schema cho collections
- Validation dữ liệu
- Query và thao tác database

**Ví dụ sử dụng**:
```javascript
const mongoose = require("mongoose");
// Kết nối
mongoose.connect("mongodb://localhost:27017/myapp");
// Tạo schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String
});
// Tạo model
const User = mongoose.model("User", userSchema);
```

**Tại sao dùng Mongoose?**
- Cung cấp Schema validation
- Hỗ trợ middleware
- Dễ truy vấn và populate
- Type-safe operations

---

### 3. **jsonwebtoken** (^9.0.2)
**Chức năng**: Tạo và xác thực JWT tokens

**Vai trò trong project**:
- Tạo token khi đăng nhập
- Xác thực token cho protected routes
- Stateless authentication

**Ví dụ sử dụng**:
```javascript
const jwt = require("jsonwebtoken");
// Tạo token
const token = jwt.sign({ userId: 123 }, "secret", { expiresIn: '1h' });
// Verify token
const decoded = jwt.verify(token, "secret");
```

**Tại sao dùng JWT?**
- Không cần lưu session trên server
- Dễ scale
- Secure và efficient
- Cross-domain authentication

---

### 4. **bcrypt** (^6.0.0)
**Chức năng**: Mã hóa mật khẩu một chiều

**Vai trò trong project**:
- Hash password khi đăng ký
- So sánh password khi đăng nhập

**Ví dụ sử dụng**:
```javascript
const bcrypt = require("bcrypt");
// Hash password
const hashed = await bcrypt.hash("password123", 10);
// So sánh password
const match = await bcrypt.compare("password123", hashed);
```

**Tại sao dùng bcrypt?**
- Mã hóa một chiều (không thể decrypt)
- Có salt tự động
- Slower algorithm (bảo mật tốt hơn)
- Industry standard

---

### 5. **dotenv** (^16.4.5)
**Chức năng**: Quản lý biến môi trường

**Vai trò trong project**:
- Lưu configs (MongoDB URI, JWT secret, PORT...)
- Bảo mật thông tin nhạy cảm
- Dễ thay đổi config theo môi trường

**Ví dụ sử dụng**:
```javascript
require("dotenv").config();
console.log(process.env.MONGO_URI); // Lấy từ file .env
```

**File `.env`**:
```env
MONGO_URI=mongodb://localhost:27017/mydb
JWT_SECRET=my_secret_key
PORT=3000
```

**Tại sao dùng dotenv?**
- Tách biệt config với code
- Bảo mật (không commit .env)
- Dễ deploy
- Quản lý nhiều môi trường

---

### 6. **body-parser** (^1.20.3)
**Chức năng**: Parse HTTP request body

**Vai trò trong project**:
- Parse JSON từ request body
- Parse URL-encoded data
- Extract data từ form-data

**Ví dụ sử dụng**:
```javascript
const express = require("express");
const app = express();
app.use(bodyParser.json()); // Parse JSON
app.post("/api/users", (req, res) => {
  console.log(req.body); // { name: "John", age: 30 }
});
```

**Tại sao dùng body-parser?**
- Express 4.x không tự parse body
- Hỗ trợ nhiều format
- Middleware pattern
- Secure parsing

---

### 7. **morgan** (^1.10.0)
**Chức năng**: HTTP request logger middleware

**Vai trò trong project**:
- Log HTTP requests
- Debug development
- Monitor API usage

**Ví dụ sử dụng**:
```javascript
const morgan = require("morgan");
app.use(morgan("dev")); // Log ở format dev
```

**Output**:
```
GET /api/customers 200 45.123 ms
POST /api/customers/login 200 123.456 ms
```

**Các format phổ biến**:
- `dev`: Colored output cho development
- `combined`: Apache combined log format
- `tiny`: Minimal output

---

### 8. **http-errors** (^2.0.0)
**Chức năng**: Tạo HTTP errors

**Vai trò trong project**:
- Tạo lỗi HTTP chuẩn
- Xử lý lỗi 400, 401, 403, 404, 500...

**Ví dụ sử dụng**:
```javascript
const httpErrors = require("http-errors");
app.use((req, res, next) => {
  next(httpErrors.NotFound("Route not found"));
});
```

**Tại sao dùng?**
- Tạo error messages chuẩn HTTP
- Dễ debug
- Consistent error handling
- Status code tự động

---

### 9. **nodemon** (^3.1.7)
**Chức năng**: Auto-restart server khi code thay đổi

**Vai trò trong project**:
- Development tool
- Tự động reload server
- Tiết kiệm thời gian development

**Cấu hình trong `package.json`**:
```json
{
  "scripts": {
    "start": "nodemon server"
  }
}
```

**Cách sử dụng**:
```bash
npm start  # Tự động reload khi save file
```

**Tại sao dùng nodemon?**
- Không cần restart manual
- Faster development cycle
- Watch file changes
- Popular trong cộng đồng Node.js

---

## 📁 Cấu Trúc Thư Mục

```
template-resource-sdn302/
│
├── 📁 config/                    # Cấu hình database
│   └── db.js                     # Kết nối MongoDB
│
├── 📁 middleware/                # Middleware functions
│   ├── auth.middleware.js        # Xác thực JWT token
│   └── jwt.js                    # Tạo JWT token
│
├── 📁 models/                    # MongoDB Models (Schemas)
│   ├── customers.model.js        # Model Customer
│   └── index.js                 # Export models
│
├── 📁 routes/                     # API Routes
│   └── api.route.js             # Định nghĩa endpoints
│
├── 📄 server.js                  # Entry point - Khởi tạo server
├── 📄 package.json               # Dependencies và scripts
├── 📄 .env                       # Biến môi trường (không commit)
├── 📄 README.md                  # Hướng dẫn cơ bản
│
├── 📄 MongoModel.md              # Tài liệu về MongoDB Models
├── 📄 MongoQueryDatabase.md      # Tài liệu về MongoDB Queries
└── 📄 ProjectDocumentation.md   # Tài liệu này
```

---

## 🔧 Cài Đặt và Chạy Dự Án

### Bước 1: Clone hoặc Download Project

```bash
# Clone từ GitHub (nếu có)
git clone <repository-url>

# Hoặc download ZIP và giải nén
```

### Bước 2: Cài Đặt Dependencies

```bash
# Mở terminal ở thư mục project
npm install
```

**Lệnh này sẽ cài đặt tất cả các thư viện trong `package.json`**

### Bước 3: Cấu Hình MongoDB

**Tạo file `.env` ở thư mục gốc:**

```env
# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/pe_sdn302

# JWT Secret Key (tạo một chuỗi random, bảo mật)
JWT_SECRET=my_super_secret_key_12345

# Server Configuration
HOST_NAME=localhost
PORT=3000
```

**Lưu ý**: `.env` file KHÔNG được commit lên Git!

### Bước 4: Khởi Động MongoDB

```bash
# Windows (nếu đã cài MongoDB)
mongod

# Hoặc sử dụng MongoDB Atlas (Cloud) - không cần cài đặt local
```

### Bước 5: Chạy Project

```bash
npm start
```

**Kết quả mong đợi**:
```
Server running at: http://localhost:3000
MongoDB connected successfully
```

### Bước 6: Test API

Mở browser hoặc Postman:
```
GET http://localhost:3000/
```

Kết quả:
```json
{
  "message": "Welcome to Restful API server"
}
```

---

## 📝 Giải Thích Chi Tiết Từng File

### 1. `server.js` - Entry Point

**Vai trò**: File chính khởi tạo và chạy server

**Code chính**:

```javascript
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const httpErrors = require("http-errors");
require("dotenv").config();

const connectDB = require("./config/db");
const ApiRouter = require("./routes/api.route");

const app = express();

// Middleware
app.use(bodyParser.json());      // Parse JSON
app.use(morgan("dev"));          // Log requests

// Routes
app.get("/", (req, res) => {
  res.send({ message: "Welcome to Restful API server" });
});

app.use("/api", ApiRouter);      // API routes

// Error handlers
app.use((req, res, next) => {
  next(httpErrors.BadRequest("Bad request"));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send({
    error: {
      status: err.status || 500,
      message: err.message
    }
  });
});

// Start server
const HOST_NAME = process.env.HOST_NAME;
const PORT = process.env.PORT;

app.listen(PORT, HOST_NAME, () => {
  console.log(`Server running at: http://${HOST_NAME}:${PORT}`);
  connectDB();  // Kết nối MongoDB
});
```

**Giải thích**:
- Import các dependencies
- Setup middleware (body-parser, morgan)
- Define routes
- Handle errors
- Start server và connect DB

---

### 2. `config/db.js` - Database Connection

**Vai trò**: Kết nối MongoDB

**Code**:

```javascript
const mongoose = require('mongoose');

const connectDb = async () => {
  console.log(process.env.MONGO_URI);
  try {
    await mongoose.connect(process.env.MONGO_URI)
      .then(() => console.log("MongoDB connected successfully"))
  } catch (err) {
    next(err);
    process.exit();
  }
}

module.exports = connectDb;
```

**Giải thích**:
- Lấy connection string từ `.env`
- Kết nối MongoDB
- Log success hoặc exit nếu lỗi

---

### 3. `models/customers.model.js` - Customer Model

**Vai trò**: Định nghĩa schema cho collection `customers`

**Code**:

```javascript
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Định nghĩa schema
const customerSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String },
  phone: { type: Number },
});

// Tạo model
const Customers = mongoose.model("Customers", customerSchema, "customers");

module.exports = Customers;
```

**Giải thích**:
- `name`: String, không bắt buộc
- `email`: String, bắt buộc, duy nhất
- `password`: String, bắt buộc (đã hash bằng bcrypt)
- `address`: String, không bắt buộc
- `phone`: Number, không bắt buộc

---

### 4. `models/index.js` - Model Index

**Vai trò**: Export tất cả models

**Code**:

```javascript
const mongoose = require("mongoose");
const Customers = require("./customers.model");

const db = {}
db.Customers = Customers

module.exports = db;
```

**Lợi ích**: Import models dễ dàng hơn
```javascript
const db = require("./models");
const customer = await db.Customers.findOne({ email });
```

---

### 5. `middleware/jwt.js` - JWT Token Generator

**Vai trò**: Tạo JWT token

**Code** (CẦN SỬA - Có vấn đề syntax):

```javascript
const jwt = require("jsonwebtoken");

// Tạo token
const generateAccessToken = (customers) => 
  jwt.sign(
    { id: customers._id },      // Payload
    process.env.JWT_SECRET,      // Secret key
    { expiresIn: '3d' }          // Hết hạn sau 3 ngày
  );

module.exports = { generateAccessToken };
```

**Giải thích**:
- Nhận vào customer ID
- Tạo token với payload chứa ID
- Token hết hạn sau 3 ngày
- Dùng để xác thực ở request tiếp theo

---

### 6. `middleware/auth.middleware.js` - JWT Verification

**Vai trò**: Xác thực token ở protected routes

**Code** (CẦN SỬA - Có vấn đề syntax):

```javascript
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Lấy token từ header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, customer) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    // Gắn thông tin customer vào request
    req.customer = customer;
    next();  // Cho phép request tiếp tục
  });
};

module.exports = { verifyToken };
```

**Giải thích**:
- Đọc token từ header `Authorization: Bearer <token>`
- Verify token với JWT_SECRET
- Nếu hợp lệ: attach customer info vào `req.customer`
- Nếu không hợp lệ: trả về 403

---

### 7. `routes/api.route.js` - API Routes

**Vai trò**: Định nghĩa các endpoints

**Code chính**:

```javascript
const express = require("express");
const db = require("../models");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../middleware/jwt");
const { verifyToken } = require("../middleware/auth.middleware");

const ApiRouter = express.Router();

// [POST] /api/customers/login
ApiRouter.post("/customers/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Tìm customer theo email
    const customer = await db.Customers.findOne({ email: email });
    
    if (!customer) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // So sánh password
    const isPasswordMatched = await bcrypt.compare(password, customer.password);
    if (!isPasswordMatched) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    
    // Tạo token
    const accessToken = generateAccessToken(customer);
    
    return res.status(200).json({ token: accessToken });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// [GET] /api/customers/profile
ApiRouter.get("/customers/profile", verifyToken, async (req, res, next) => {
  try {
    const customerId = req.customer.id;
    
    // Tìm customer theo ID
    const customer = await db.Customers.findById(customerId);
    if (!customer) {
      return res.status(400).json({ message: 'Customer not found' });
    }
    
    // Trả về profile (không có password)
    const customerProfile = {
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address
    };

    return res.status(200).json(customerProfile);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = ApiRouter;
```

**Giải thích**:
- **POST /api/customers/login**: Đăng nhập, trả về token
- **GET /api/customers/profile**: Lấy profile (yêu cầu token)

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### 1. Đăng Nhập

**Endpoint**: `POST /api/customers/login`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Success** (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Error** (400):
```json
{
  "message": "Invalid email or password"
}
```

### 2. Lấy Profile

**Endpoint**: `GET /api/customers/profile`

**Headers**:
```
Authorization: Bearer <token>
```

**Response Success** (200):
```json
{
  "_id": "65abc123...",
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "phone": 123456789,
  "address": "123 Đường ABC"
}
```

**Response Error - No Token** (401):
```json
{
  "message": "No token provided"
}
```

**Response Error - Invalid Token** (403):
```json
{
  "message": "Invalid token"
}
```

---

## 💡 Ví Dụ Sử Dụng

### Ví Dụ 1: Đăng Nhập

**Sử dụng curl**:
```bash
curl -X POST http://localhost:3000/api/customers/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Sử dụng Postman**:
1. Method: POST
2. URL: `http://localhost:3000/api/customers/login`
3. Body > raw > JSON:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
4. Click Send

**Kết quả**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Ví Dụ 2: Lấy Profile (Protected Route)

**Sử dụng curl**:
```bash
curl -X GET http://localhost:3000/api/customers/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Sử dụng Postman**:
1. Method: GET
2. URL: `http://localhost:3000/api/customers/profile`
3. Headers > Key: `Authorization` > Value: `Bearer <token>`
4. Click Send

**Kết quả**:
```json
{
  "_id": "65abc123...",
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "phone": 123456789,
  "address": "123 Đường ABC"
}
```

---

## ⚠️ Lưu Ý Quan Trọng

### 1. Vấn Đề Với Middleware

**File `middleware/auth.middleware.js` và `middleware/jwt.js` đang dùng ES6 syntax (`import/export`) trong khi project dùng CommonJS (`require/module.exports`).**

**Giải pháp**: Sửa lại như sau:

**`middleware/jwt.js`**:
```javascript
const jwt = require("jsonwebtoken");

const generateAccessToken = (customers) => 
  jwt.sign(
    { id: customers._id },
    process.env.JWT_SECRET,
    { expiresIn: '3d' }
  );

module.exports = { generateAccessToken };
```

**`middleware/auth.middleware.js`**:
```javascript
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, customer) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.customer = customer;
    next();
  });
};

module.exports = { verifyToken };
```

### 2. Chưa Có Chức Năng Đăng Ký

Project hiện tại chỉ có đăng nhập. Cần thêm endpoint đăng ký:

```javascript
// Thêm vào routes/api.route.js
ApiRouter.post("/customers/register", async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;
    
    // Check email đã tồn tại
    const existingCustomer = await db.Customers.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Tạo customer mới
    const customer = new db.Customers({
      name,
      email,
      password: hashedPassword,
      phone,
      address
    });
    
    await customer.save();
    
    return res.status(201).json({ message: 'Customer created successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});
```

### 3. Bảo Mật Production

**KHÔNG BAO GIỜ**:
- Commit file `.env` lên Git
- Hard-code passwords trong code
- Dùng JWT_SECRET yếu trong production

**NÊN LÀM**:
- Dùng `.gitignore` cho `.env`
- Tạo JWT_SECRET mạnh (random long string)
- Dùng HTTPS trong production
- Validate input từ user
- Rate limiting cho API

---

## 🎓 Tài Liệu Tham Khảo

1. **Express.js**: https://expressjs.com/
2. **Mongoose**: https://mongoosejs.com/
3. **JWT**: https://jwt.io/
4. **bcrypt**: https://www.npmjs.com/package/bcrypt
5. **MongoDB**: https://www.mongodb.com/docs/

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề, hãy đảm bảo:
1. MongoDB đang chạy
2. File `.env` đã tạo đúng
3. Dependencies đã cài đặt (`npm install`)
4. Port 3000 chưa bị sử dụng

**Happy Coding! 🚀**

