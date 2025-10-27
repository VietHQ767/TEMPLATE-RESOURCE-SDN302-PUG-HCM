# Hướng Dẫn Tạo Model MongoDB Dành Cho Người Mới Bắt Đầu

## Giới Thiệu

Khi làm việc với MongoDB, bạn cần tạo các **Model** (mô hình) để định nghĩa cấu trúc dữ liệu. Model giống như một bản thiết kế cho dữ liệu của bạn, giúp MongoDB biết các document của bạn sẽ có những trường nào và kiểu dữ liệu gì.

---

## 1. Model Đơn Giản Nhất (Single-Level Model)

### Mô Tả
Model cơ bản nhất với các trường phẳng, không có lồng nhau. Giống như một bảng trong Excel với các cột thẳng hàng.

### Ví Dụ Thực Tế
Tạo model **User** để lưu thông tin người dùng:

```javascript
const mongoose = require("mongoose");

// Định nghĩa cấu trúc của User
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },      // Tên (bắt buộc)
  age: { type: Number, required: true },        // Tuổi (bắt buộc)
  email: { type: String, unique: true },        // Email (duy nhất)
  createdAt: { type: Date, default: Date.now }  // Ngày tạo (tự động)
});

// Tạo và xuất Model
module.exports = mongoose.model("User", userSchema);
```

### Giải Thích Từng Phần
- `mongoose.Schema`: Tạo cấu trúc dữ liệu
- `type`: Kiểu dữ liệu (String, Number, Date, Boolean...)
- `required: true`: Trường bắt buộc phải có
- `unique: true`: Giá trị không được trùng lặp
- `default: Date.now`: Giá trị mặc định là thời gian hiện tại

---

## 2. Model Có Nested Objects (Model Lồng Nghép)

### Mô Tả
Model có các đối tượng con bên trong. Giống như có một hộp nhỏ bên trong hộp lớn.

### Ví Dụ Thực Tế
Lưu thông tin người dùng kèm địa chỉ:

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  address: {                    // Đối tượng con chứa thông tin địa chỉ
    street: String,            // Đường
    city: String,              // Thành phố
    postalCode: String         // Mã bưu điện
  }
});

module.exports = mongoose.model("User", userSchema);
```

### Khi Nào Dùng?
- Khi thông tin con liên quan chặt chẽ với document chính
- Khi ít cần truy vấn riêng phần thông tin con
- Ví dụ: Địa chỉ, thông tin liên lạc, chi tiết sản phẩm

### Cách Sử Dụng
```javascript
// Lưu dữ liệu
const user = new User({
  name: "Nguyễn Văn A",
  address: {
    street: "123 Đường ABC",
    city: "Hà Nội",
    postalCode: "100000"
  }
});

// Truy cập dữ liệu
console.log(user.address.city); // In ra: "Hà Nội"
```

---

## 3. Mảng Các Subdocuments (Array of Subdocuments)

### Mô Tả
Model có một mảng chứa nhiều đối tượng con. Giống như một danh sách các hộp nhỏ trong hộp lớn.

### Ví Dụ Thực Tế
Lưu danh sách các cách liên hệ:

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  contacts: [                    // Mảng các đối tượng
    {
      type: { type: String, enum: ["phone", "email"] },  // Loại: điện thoại hoặc email
      value: String                                       // Giá trị
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
```

### Giải Thích
- `contacts: [...]`: Mảng các đối tượng contact
- `enum: ["phone", "email"]`: Chỉ cho phép 2 giá trị: "phone" hoặc "email"

### Cách Sử Dụng
```javascript
// Lưu dữ liệu với nhiều contacts
const user = new User({
  name: "Trần Thị B",
  contacts: [
    { type: "phone", value: "0123456789" },
    { type: "email", value: "user@example.com" },
    { type: "phone", value: "0987654321" }
  ]
});
```

---

## 4. Model Tham Chiếu (Referenced Models - Mối Quan Hệ Một-Nhiều)

### Mô Tả
Model này không lưu toàn bộ thông tin mà chỉ lưu **ID** của document khác. Khi cần, bạn sẽ "nạp" (populate) thông tin chi tiết.

### Ví Dụ Thực Tế
Tạo model **Post** tham chiếu đến **User**:

```javascript
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }  // ID của User
});

module.exports = mongoose.model("Post", postSchema);
```

### Giải Thích
- `ObjectId`: Kiểu dữ liệu cho ID của document khác
- `ref: "User"`: Tham chiếu đến model User
- Chỉ lưu ID, không lưu toàn bộ thông tin User

### So Sánh Embedded vs Referenced

**Embedded (Nhúng):**
```javascript
// Toàn bộ thông tin được lưu trong 1 document
{
  title: "Bài viết 1",
  author: {
    name: "Nguyễn Văn A",
    age: 25
  }
}
```

**Referenced (Tham chiếu):**
```javascript
// Chỉ lưu ID
{
  title: "Bài viết 1",
  author: ObjectId("507f1f77bcf86cd799439011")
}
```

### Khi Nào Dùng Referenced?
- Khi document con được dùng ở nhiều nơi
- Khi document con có thể thay đổi độc lập
- Khi muốn tránh lặp lại dữ liệu

### Cách Sử Dụng
```javascript
// Tạo một bài viết
const post = new Post({
  title: "Hello World",
  content: "Nội dung bài viết...",
  author: userId  // ID của user
});

// Lấy thông tin author khi query
const posts = await Post.find().populate('author');
console.log(posts[0].author.name); // In ra tên tác giả
```

---

## 5. Model Tự Tham Chiếu (Self-Referencing - Mối Quan Hệ Đệ Quy)

### Mô Tả
Model có thể tham chiếu đến chính nó. Rất hữu ích cho cấu trúc cây như danh mục, comment có reply...

### Ví Dụ Thực Tế
Tạo cấu trúc danh mục nhiều cấp:

```javascript
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }  // Tham chiếu chính nó
});

module.exports = mongoose.model("Category", categorySchema);
```

### Ví Dụ Cấu Trúc
```
Điện Thoại (Category 1)
  └─ iPhone (Category 2 - parent: Category 1)
      └─ iPhone 14 (Category 3 - parent: Category 2)
Máy Tính (Category 4)
  └─ Laptop (Category 5 - parent: Category 4)
```

### Cách Sử Dụng
```javascript
// Tạo danh mục cha
const electronics = new Category({ name: "Điện Tử" });
await electronics.save();

// Tạo danh mục con
const phones = new Category({ 
  name: "Điện Thoại",
  parentCategory: electronics._id  // Tham chiếu đến danh mục cha
});
await phones.save();
```

---

## 6. Mối Quan Hệ Nhiều-Nhiều (Many-to-Many)

### Mô Tả
Một document có thể liên kết với nhiều documents khác, và ngược lại.

### Ví Dụ Thực Tế
Một khóa học có nhiều học sinh, một học sinh có thể học nhiều khóa học:

```javascript
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: String,
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }]  // Mảng ID
});

module.exports = mongoose.model("Course", courseSchema);
```

### Lưu Ý
- Dùng mảng `[...]` để lưu nhiều ID
- Mỗi khóa học có một danh sách học sinh
- Một học sinh có thể xuất hiện trong nhiều khóa học

### Cách Sử Dụng
```javascript
// Tạo khóa học với danh sách học sinh
const course = new Course({
  title: "JavaScript Cơ Bản",
  students: [studentId1, studentId2, studentId3]  // Mảng ID học sinh
});

// Lấy thông tin học sinh
const courses = await Course.find().populate('students');
courses.forEach(course => {
  console.log(course.title);
  course.students.forEach(student => {
    console.log(`  - ${student.name}`);  // In tên học sinh
  });
});
```

---

## 7. Model Có Timestamp Tự Động

### Mô Tả
Model tự động thêm 2 trường:
- `createdAt`: Thời gian tạo document
- `updatedAt`: Thời gian cập nhật cuối cùng

### Ví Dụ Thực Tế
Tạo model Product với timestamp tự động:

```javascript
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: String,
    price: Number
  },
  { timestamps: true }  // Tự động thêm createdAt và updatedAt
);

module.exports = mongoose.model("Product", productSchema);
```

### Lợi Ích
- Không cần tự tạo trường thời gian
- MongoDB tự động cập nhật `updatedAt` khi bạn sửa document
- Tiện cho việc theo dõi lịch sử

### Dữ Liệu Mẫu
```javascript
{
  name: "Laptop Dell",
  price: 15000000,
  createdAt: "2024-01-15T10:30:00.000Z",  // Tự động tạo
  updatedAt: "2024-01-20T14:25:00.000Z"   // Tự động cập nhật
}
```

---

## 8. Discriminators (Một Collection Cho Nhiều Models)

### Mô Tả
Cho phép lưu nhiều loại documents khác nhau trong cùng một collection bằng cách dùng một trường phân biệt (`type`).

### Ví Dụ Thực Tế
Tạo Item, Book, và Furniture trong cùng collection `items`:

```javascript
const mongoose = require("mongoose");

// Cấu hình chung
const baseOptions = {
  discriminatorKey: "type",    // Trường phân biệt
  collection: "items"           // Tên collection
};

// Schema chung
const itemSchema = new mongoose.Schema(
  {
    name: String,
    price: Number
  },
  baseOptions
);

// Model gốc
const Item = mongoose.model("Item", itemSchema);

// Model Book (có thêm field author)
const Book = Item.discriminator(
  "Book",
  new mongoose.Schema({ author: String })
);

// Model Furniture (có thêm field material)
const Furniture = Item.discriminator(
  "Furniture",
  new mongoose.Schema({ material: String })
);

module.exports = { Item, Book, Furniture };
```

### Cách Hoạt Động
```javascript
// Tạo Book
const book = new Book({
  name: "JavaScript Guide",
  price: 200000,
  author: "John Doe"
});

// MongoDB sẽ tự thêm: { type: "Book", author: "John Doe", ... }

// Tạo Furniture
const furniture = new Furniture({
  name: "Chair",
  price: 500000,
  material: "Wood"
});

// MongoDB sẽ tự thêm: { type: "Furniture", material: "Wood", ... }
```

### Lợi Ích
- Tái sử dụng các trường chung
- Dễ query tất cả items hoặc chỉ một loại
- Linh hoạt khi cần thêm loại mới

---

## 9. Validation (Xác Thực Dữ Liệu)

### Mô Tả
Kiểm tra dữ liệu trước khi lưu vào database. Đảm bảo dữ liệu hợp lệ.

### Ví Dụ Thực Tế
Tạo model Reservation với validation cho ngày đặt:

```javascript
const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  customerName: String,
  reservationDate: { 
    type: Date, 
    required: true,  // Bắt buộc phải có
    validate: {
      validator: function(value) {
        // Kiểm tra ngày có trong khoảng 2024
        const startDate = new Date('2024-01-01');
        const endDate = new Date('2024-12-31');
        return value >= startDate && value <= endDate;
      },
      message: "Ngày đặt chỗ phải nằm trong khoảng từ ngày 1 tháng 1 năm 2024 đến ngày 31 tháng 12 năm 2024."
    }
  }
});

module.exports = mongoose.model("Reservation", reservationSchema);
```

### Các Loại Validation Phổ Biến

#### 1. Kiểm Tra Email
```javascript
email: {
  type: String,
  validate: {
    validator: function(v) {
      return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
    },
    message: "Email không hợp lệ"
  }
}
```

#### 2. Kiểm Tra Độ Dài
```javascript
password: {
  type: String,
  minlength: [8, "Mật khẩu phải có ít nhất 8 ký tự"],
  maxlength: [50, "Mật khẩu không được quá 50 ký tự"]
}
```

#### 3. Kiểm Tra Giá Trị
```javascript
age: {
  type: Number,
  min: [18, "Bạn phải ít nhất 18 tuổi"],
  max: [100, "Tuổi không được quá 100"]
}
```

#### 4. Kiểm Tra Enum
```javascript
status: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  message: "Trạng thái phải là pending, approved hoặc rejected"
}
```

### Cách Xử Lý Lỗi Validation
```javascript
try {
  const reservation = new Reservation({
    customerName: "Nguyễn Văn A",
    reservationDate: "2025-01-01"  // Ngày không hợp lệ
  });
  await reservation.save();
} catch (error) {
  console.error(error.message);  // In ra thông báo lỗi
}
```

---

## Tổng Kết

### Khi Nào Dùng Gì?

| Loại Model | Khi Nào Dùng | Ví Dụ |
|------------|--------------|-------|
| Single-Level | Dữ liệu phẳng, đơn giản | User, Product |
| Nested | Thông tin con ít thay đổi | Địa chỉ, Thông tin cá nhân |
| Array of Subdocuments | Có nhiều items nhỏ | Danh sách số điện thoại, Tags |
| Referenced | Quan hệ một-nhiều phức tạp | Post có Author, Comment có Post |
| Self-Referencing | Cấu trúc cây | Category, Comment có Reply |
| Many-to-Many | Quan hệ đa chiều | Course-Student, Product-Category |
| Timestamps | Cần theo dõi thời gian | Log, Audit |
| Discriminators | Nhiều loại trong 1 collection | E-commerce (Book, Furniture...) |
| Validation | Cần kiểm tra dữ liệu | Form đăng ký, đặt hàng |

### Quy Tắc Chung

1. **Embedded vs Referenced**: 
   - Nếu thông tin con thường xuyên dùng cùng bố → Embedded
   - Nếu thông tin con dùng nhiều nơi → Referenced

2. **Luôn dùng Validation**: 
   - Giúp dữ liệu luôn đúng format
   - Tránh lỗi runtime

3. **Dùng Timestamps**: 
   - Hữu ích cho debugging và audit
   - Không có nhược điểm

---

Chúc bạn làm việc vui vẻ với MongoDB! 🎉