# Hướng Dẫn Sử Dụng Lệnh MongoDB Dành Cho Người Mới Bắt Đầu

## Giới Thiệu

Document này sẽ hướng dẫn bạn cách thao tác dữ liệu trong MongoDB một cách chi tiết và dễ hiểu nhất. Mỗi lệnh đều có ví dụ cụ thể và giải thích rõ ràng.

---

## 1. Chèn Documents (Insert Documents)

### Lệnh: `insertOne`, `insertMany`

**Cách dùng**: Thêm document(s) mới vào collection.

### 1.1. insertOne - Chèn Một Document

```javascript
// Chèn một document
await User.insertOne({ 
  name: "Nguyễn Văn A", 
  age: 25, 
  city: "Hà Nội" 
});
```

**Kết quả**: Collection `users` có thêm 1 document.

**Phân tích**:
- `insertOne`: Lệnh chèn một document
- `{ name: "Nguyễn Văn A", ... }`: Dữ liệu cần chèn
- MongoDB tự động tạo `_id` nếu không có

### 1.2. insertMany - Chèn Nhiều Documents

```javascript
// Chèn nhiều documents cùng lúc
await User.insertMany([
  { name: "Trần Thị B", age: 30, city: "TP. Hồ Chí Minh" },
  { name: "Lê Văn C", age: 22, city: "Đà Nẵng" }
]);
```

**Kết quả**: Collection `users` có thêm 2 documents.

**Lợi ích**: Nhanh hơn chèn từng cái một.

### 1.3. Chèn Với _id Tự Định Nghĩa

```javascript
// Chèn với _id cố định
await Product.insertOne({ 
  _id: "PROD001",
  name: "Laptop Dell", 
  price: 15000000 
});

// Chèn nhiều với _id
await Product.insertMany([
  { _id: 1, name: "iPhone", price: 20000000 },
  { _id: 2, name: "Samsung", price: 18000000 }
]);
```

**Lưu ý**: Khi dùng `_id` tự định nghĩa, đảm bảo không trùng lặp!

---

## 2. Truy Vấn Documents (Query Documents)

### Lệnh: `find`, `findOne`

**Cách dùng**: Lấy document(s) từ collection theo điều kiện.

### 2.1. find - Tìm Nhiều Documents

#### Tìm Theo Giá Trị Đơn Giản

```javascript
// Tìm tất cả documents có tuổi là 25
const users = await User.find({ age: 25 });
```

**Kết quả**: Mảng các documents có `age = 25`.

#### Tìm Với Điều Kiện Phức Tạp

```javascript
// Tìm documents có tuổi > 20 VÀ thành phố là "Hà Nội"
const users = await User.find({ 
  age: { $gt: 20 }, 
  city: "Hà Nội" 
});
```

**Giải thích**: `$gt` = Greater Than (lớn hơn)

```javascript
// Tìm documents có tên là "Alice" HOẶC tuổi là 25
const users = await User.find({
  $or: [
    { name: "Alice" }, 
    { age: 25 }
  ]
});
```

#### Chỉ Lấy Một Số Trường Cụ Thể

```javascript
// Chỉ lấy trường name và age
const users = await User.find(
  {}, 
  { name: 1, age: 1, _id: 0 }  // 1 = lấy, 0 = không lấy
);
```

**Kết quả**: Mỗi document chỉ có `name` và `age`, không có `_id`.

#### Sắp Xếp Kết Quả

```javascript
// Sắp xếp theo tuổi từ cao xuống thấp
const users = await User.find().sort({ age: -1 });
```

**Giải thích**:
- `1` = tăng dần (A-Z, 0-9)
- `-1` = giảm dần (Z-A, 9-0)

#### Tìm Trong Mảng

```javascript
// Tìm documents có tuổi là 25 HOẶC 30
const users = await User.find({ 
  age: { $in: [25, 30] } 
});
```

**So sánh**:
- `$in`: Có trong danh sách
- `$nin`: Không có trong danh sách

#### Giới Hạn Số Lượng

```javascript
// Lấy 5 documents đầu tiên có tuổi là 25
const users = await User.find({ age: 25 }).limit(5);
```

### 2.2. findOne - Tìm Một Document

```javascript
// Tìm một document có tên là "Alice"
const user = await User.findOne({ name: "Alice" });
```

**Khác biệt với `find`**:
- `find`: Trả về mảng (có thể nhiều)
- `findOne`: Trả về 1 document (hoặc null)

### 2.3. findById - Tìm Theo ID

```javascript
// Tìm document theo _id
const user = await User.findById("60d5ec49b9a8f914c4e8a6b1");
```

**Tiện lợi**: Không cần bao trong `{ _id: "..." }`.

### 2.4. findOneAndUpdate - Tìm Và Cập Nhật

```javascript
// Tìm và cập nhật, trả về document cũ
const oldUser = await User.findOneAndUpdate(
  { name: "Alice" },
  { $set: { age: 31 } },
  { returnDocument: "before" }
);
```

**Các tùy chọn**:
- `returnDocument: "before"`: Trả về document trước khi update
- `returnDocument: "after"`: Trả về document sau khi update

### 2.5. findOneAndDelete - Tìm Và Xóa

```javascript
// Tìm và xóa, trả về document đã xóa
const deletedUser = await User.findOneAndDelete({ name: "Alice" });
```

### 2.6. findOneAndReplace - Tìm Và Thay Thế

```javascript
// Tìm và thay thế toàn bộ document
const newUser = await User.findOneAndReplace(
  { name: "Alice" },
  { 
    name: "Alice", 
    age: 32, 
    city: "San Francisco"  // Hoàn toàn thay thế
  },
  { returnDocument: "after" }
);
```

**Lưu ý**: `replaceOne` thay thế toàn bộ document, không giữ lại các trường cũ.

---

## 3. Cập Nhật Documents (Update Documents)

### Lệnh: `updateOne`, `updateMany`

**Cách dùng**: Sửa đổi document(s) đã có.

### 3.1. updateOne - Cập Nhật Một Document

```javascript
// Cập nhật tuổi của John
await User.updateOne(
  { name: "John" }, 
  { $set: { age: 26 } }
);
```

**Kết quả**: Document đầu tiên có `name = "John"` được cập nhật.

### 3.2. updateMany - Cập Nhật Nhiều Documents

```javascript
// Cập nhật thành phố của tất cả người từ "Chicago" sang "San Francisco"
await User.updateMany(
  { city: "Chicago" },
  { $set: { city: "San Francisco" } }
);
```

### 3.3. replaceOne - Thay Thế Toàn Bộ

```javascript
// Thay thế toàn bộ document
await User.replaceOne(
  { name: "John" },
  { 
    name: "John", 
    age: 27, 
    city: "Miami"  // Các trường cũ khác sẽ bị mất!
  }
);
```

**Cảnh báo**: Các trường không có trong document mới sẽ bị xóa!

### 3.4. findOneAndUpdate Với Trả Về Document

```javascript
// Tìm, cập nhật và trả về document đã cập nhật
const updatedUser = await User.findOneAndUpdate(
  { name: "Alice" },
  { $set: { age: 30 } },
  { new: true }  // true = trả về document mới, false = document cũ
);
```

### 3.5. findByIdAndUpdate

```javascript
// Cập nhật theo ID và trả về document mới
const updated = await User.findByIdAndUpdate(
  "60d5ec49b9a8f914c4e8a6b1",
  { $set: { city: "Los Angeles" } },
  { new: true }
);
```

### Các Toán Tử Update Quan Trọng

```javascript
// $set: Thiết lập giá trị
await User.updateOne(
  { name: "John" },
  { $set: { age: 26, city: "New York" } }
);

// $unset: Xóa trường
await User.updateOne(
  { name: "John" },
  { $unset: { city: "" } }  // Xóa trường city
);

// $inc: Tăng thêm
await User.updateOne(
  { name: "John" },
  { $inc: { age: 1 } }  // Tăng age lên 1
);

// $push: Thêm vào mảng
await User.updateOne(
  { name: "John" },
  { $push: { hobbies: "reading" } }
);

// $pull: Xóa khỏi mảng
await User.updateOne(
  { name: "John" },
  { $pull: { hobbies: "reading" } }
);
```

---

## 4. Xóa Documents (Delete Documents)

### Lệnh: `deleteOne`, `deleteMany`

**Cách dùng**: Xóa document(s) khỏi collection.

### 4.1. deleteOne - Xóa Một Document

```javascript
// Xóa document đầu tiên có tên là "Alice"
await User.deleteOne({ name: "Alice" });
```

**Lưu ý**: Chỉ xóa document đầu tiên tìm được!

### 4.2. deleteMany - Xóa Nhiều Documents

```javascript
// Xóa tất cả documents có tuổi < 25
await User.deleteMany({ age: { $lt: 25 } });
```

```javascript
// Xóa toàn bộ documents trong collection (cẩn thận!)
await User.deleteMany({});
```

### 4.3. Xóa Theo ID

```javascript
// Xóa document có _id cụ thể
await User.deleteOne({ 
  _id: ObjectId("60d5ec49b9a8f914c4e8a6b1") 
});
```

### 4.4. Xóa Với Điều Kiện OR

```javascript
// Xóa documents có name là "Bob" HOẶC age > 30
await User.deleteMany({ 
  $or: [
    { name: "Bob" }, 
    { age: { $gt: 30 } }
  ] 
});
```

---

## 5. Đếm Documents (Counting Documents)

### Lệnh: `countDocuments`

**Cách dùng**: Đếm số lượng documents thỏa mãn điều kiện.

### Ví Dụ

```javascript
// Đếm tất cả documents có thành phố là "Hà Nội"
const count = await User.countDocuments({ city: "Hà Nội" });
console.log(`Có ${count} người ở Hà Nội`);
```

### Đếm Tất Cả Documents

```javascript
// Đếm tất cả documents
const total = await User.countDocuments({});
console.log(`Tổng có ${total} user`);
```

### Kết Hợp Với Điều Kiện Phức Tạp

```javascript
// Đếm documents có tuổi từ 18 đến 30
const count = await User.countDocuments({
  age: { $gte: 18, $lte: 30 }
});
```

---

## 6. Sắp Xếp Kết Quả (Sorting Results)

### Lệnh: `sort`

**Cách dùng**: Sắp xếp documents theo một hoặc nhiều trường.

### 6.1. Sắp Xếp Đơn Giản

```javascript
// Sắp xếp tăng dần theo tuổi (từ nhỏ đến lớn)
const users = await User.find().sort({ age: 1 });
```

```javascript
// Sắp xếp giảm dần theo tuổi (từ lớn đến nhỏ)
const users = await User.find().sort({ age: -1 });
```

### 6.2. Sắp Xếp Nhiều Trường

```javascript
// Sắp xếp tăng dần theo tuổi, nếu trùng thì giảm dần theo tên
const users = await User.find().sort({ 
  age: 1,    // Tuổi tăng dần
  name: -1   // Tên giảm dần
});
```

### 6.3. Sắp Xếp Và Giới Hạn

```javascript
// Lấy 5 người có tuổi cao nhất
const oldestUsers = await User.find()
  .sort({ age: -1 })
  .limit(5);
```

### 6.4. Sắp Xếp Với Projection

```javascript
// Sắp xếp theo tên và chỉ lấy các trường name và age
const users = await User.find(
  {}, 
  { name: 1, age: 1, _id: 0 }
).sort({ name: 1 });
```

### 6.5. Sắp Xếp Trong Nested Object

```javascript
// Sắp xếp theo trường nested
const users = await User.find().sort({ 
  "profile.details.age": 1  // age trong profile.details
});
```

---

## 7. Giới Hạn và Bỏ Qua Kết Quả (Limiting and Skipping)

### Lệnh: `limit`, `skip`

**Cách dùng**: 
- `limit`: Giới hạn số document trả về
- `skip`: Bỏ qua một số document đầu tiên

### 7.1. limit - Giới Hạn Số Lượng

```javascript
// Chỉ lấy 5 documents đầu tiên
const users = await User.find().limit(5);
```

**Giải thích**: Chỉ lấy 5 documents đầu tiên, bỏ qua các document còn lại.

### 7.2. skip - Bỏ Qua Documents

```javascript
// Bỏ qua 3 documents đầu tiên, lấy 5 documents tiếp theo
const users = await User.find().skip(3).limit(5);
```

**Ứng dụng**: Làm phân trang (pagination)!

### Ví Dụ Phân Trang

```javascript
const page = 2;           // Trang thứ 2
const pageSize = 10;      // Mỗi trang 10 items
const skip = (page - 1) * pageSize;

const users = await User.find()
  .skip(skip)
  .limit(pageSize);
```

### 7.3. Lấy Document Đầu Tiên

```javascript
// Lấy 1 document đầu tiên thỏa mãn điều kiện
const user = await User.find({ age: { $gt: 25 } }).limit(1);
```

### 7.4. Cursor Pagination

```javascript
// Lấy documents từ _id cụ thể trở đi (hiệu quả hơn skip)
const lastId = ObjectId("60f72f7c23b1b231d89abcde");
const users = await User.find({ 
  _id: { $gt: lastId } 
}).limit(10);
```

**Tại sao tốt hơn skip?**:
- Skip phải "nhảy" qua nhiều documents (chậm nếu có nhiều data)
- Cursor chỉ tìm từ vị trí _id, nhanh hơn nhiều

---

## 8. Populate (Điền Dữ Liệu)

### Lệnh: `populate`

**Cách dùng**: Kết hợp dữ liệu từ các collection khác thông qua `_id`.

### 8.1. Populate Đơn Giản

```javascript
// Lấy posts và populate thông tin author
const posts = await Post.find().populate('author');
```

**Trước populate**:
```javascript
{
  title: "Bài viết hay",
  author: ObjectId("60d5ec49b9a8f914c4e8a6b1")
}
```

**Sau populate**:
```javascript
{
  title: "Bài viết hay",
  author: {
    _id: ObjectId("60d5ec49b9a8f914c4e8a6b1"),
    name: "Nguyễn Văn A",
    email: "user@example.com"
  }
}
```

### 8.2. Chỉ Lấy Một Số Trường

```javascript
// Chỉ lấy name và email của author
const posts = await Post.find().populate('author', 'name email');
```

### 8.3. Populate Với Điều Kiện

```javascript
// Chỉ populate những author có status là 'active'
const posts = await Post.find().populate({
  path: 'author',
  match: { status: 'active' }
});
```

### 8.4. Populate Nhiều Trường

```javascript
// Populate cả author và comments
const posts = await Post.find()
  .populate('author')
  .populate('comments');
```

### 8.5. Populate Lồng Nghép (Nested)

```javascript
// Populate author, và trong author lại populate profile
const posts = await Post.find().populate({
  path: 'author',
  populate: { path: 'profile' }
});
```

### 8.6. Populate Với Giới Hạn

```javascript
// Populate comments nhưng chỉ lấy 5 comments đầu tiên
const posts = await Post.find().populate({
  path: 'comments',
  options: { limit: 5 }
});
```

---

## 9. Tổng Hợp Dữ Liệu (Aggregation)

### Lệnh: `aggregate`

**Cách dùng**: Thực hiện các thao tác phức tạp trên documents.

### 9.1. $match - Lọc Documents

```javascript
// Lọc những người có tuổi trên 25
const adults = await User.aggregate([
  { $match: { age: { $gt: 25 } } }
]);
```

**Giống với**: `User.find({ age: { $gt: 25 } })`

### 9.2. $group - Nhóm Documents

```javascript
// Nhóm theo thành phố và tính tổng doanh thu
const result = await Sale.aggregate([
  { 
    $group: { 
      _id: "$city",           // Nhóm theo city
      totalSales: { $sum: "$amount" }  // Tính tổng
    } 
  }
]);
```

**Kết quả**:
```javascript
[
  { _id: "Hà Nội", totalSales: 5000000 },
  { _id: "TP.HCM", totalSales: 8000000 }
]
```

### 9.3. $project - Chỉ Lấy Một Số Trường

```javascript
// Chỉ lấy tên và tuổi+5
const result = await User.aggregate([
  { 
    $project: { 
      name: 1, 
      agePlusFive: { $add: ["$age", 5] }  // age + 5
    } 
  }
]);
```

**Các phép toán**:
- `$add`: Cộng
- `$subtract`: Trừ
- `$multiply`: Nhân
- `$divide`: Chia

### 9.4. $sort - Sắp Xếp

```javascript
// Sắp xếp theo tuổi giảm dần
const result = await User.aggregate([
  { $sort: { age: -1 } }
]);
```

### 9.5. $skip và $limit

```javascript
// Bỏ qua 5 documents đầu, lấy 10 documents tiếp
const result = await User.aggregate([
  { $skip: 5 },
  { $limit: 10 }
]);
```

### 9.6. $lookup - Join Collections

```javascript
// Join orders với customers
const orders = await Order.aggregate([
  { 
    $lookup: {
      from: "customers",           // Collection cần join
      localField: "customerId",    // Trường trong orders
      foreignField: "_id",         // Trường trong customers
      as: "customerInfo"           // Tên kết quả
    }
  }
]);
```

**Kết quả**: Mỗi order có thêm `customerInfo` chứa thông tin customer.

### 9.7. $unwind - Tách Mảng

```javascript
// Tách mỗi phần tử của mảng tags thành 1 document riêng
const result = await Post.aggregate([
  { $unwind: "$tags" }
]);
```

**Trước unwind**:
```javascript
{ title: "Post 1", tags: ["JS", "MongoDB"] }
```

**Sau unwind**:
```javascript
[
  { title: "Post 1", tags: "JS" },
  { title: "Post 1", tags: "MongoDB" }
]
```

### 9.8. $addFields - Thêm Trường Mới

```javascript
// Thêm trường totalCost = quantity * price
const products = await Sale.aggregate([
  { 
    $addFields: { 
      totalCost: { 
        $multiply: ["$quantity", "$price"] 
      } 
    } 
  }
]);
```

### 9.9. $count - Đếm Documents

```javascript
// Đếm số người có tuổi > 18
const result = await User.aggregate([
  { $match: { age: { $gt: 18 } } },
  { $count: "adultCount" }
]);
```

**Kết quả**:
```javascript
[{ adultCount: 150 }]
```

### 9.10. $facet - Tính Nhiều Chỉ Số Cùng Lúc

```javascript
// Tính tổng tuổi và tuổi trung bình cùng lúc
const result = await User.aggregate([
  {
    $facet: {
      totalAge: [{ 
        $group: { 
          _id: null, 
          total: { $sum: "$age" } 
        } 
      }],
      averageAge: [{ 
        $group: { 
          _id: null, 
          avg: { $avg: "$age" } 
        } 
      }]
    }
  }
]);
```

**Kết quả**:
```javascript
[{
  totalAge: [{ total: 5000 }],
  averageAge: [{ avg: 30 }]
}]
```

---

## 10. Các Toán Tử So Sánh (Comparison Operators)

### Bảng Toán Tử

| Toán tử | Ý nghĩa | Tiếng Anh |
|---------|---------|-----------|
| `$gt` | Lớn hơn | Greater Than |
| `$lt` | Nhỏ hơn | Less Than |
| `$gte` | Lớn hơn hoặc bằng | Greater Than or Equal |
| `$lte` | Nhỏ hơn hoặc bằng | Less Than or Equal |
| `$ne` | Không bằng | Not Equal |
| `$in` | Có trong danh sách | In Array |
| `$nin` | Không có trong danh sách | Not In Array |

### Ví Dụ Sử Dụng

```javascript
// Tìm documents có tuổi > 30
await User.find({ age: { $gt: 30 } });

// Tìm documents có tuổi < 25
await User.find({ age: { $lt: 25 } });

// Tìm documents có tuổi >= 20
await User.find({ age: { $gte: 20 } });

// Tìm documents có tuổi <= 40
await User.find({ age: { $lte: 40 } });

// Tìm documents có city != "Chicago"
await User.find({ city: { $ne: "Chicago" } });

// Tìm documents có age là 25 HOẶC 30
await User.find({ age: { $in: [25, 30] } });

// Tìm documents có city KHÔNG PHẢI "New York" hoặc "San Francisco"
await User.find({ 
  city: { $nin: ["New York", "San Francisco"] } 
});
```

### Ví Dụ Kết Hợp Nhiều Toán Tử

```javascript
// Tìm users có tuổi từ 18 đến 30
await User.find({ 
  age: { $gte: 18, $lte: 30 } 
});

// Tìm users có tuổi > 25 VÀ city không phải "Chicago"
await User.find({ 
  age: { $gt: 25 },
  city: { $ne: "Chicago" }
});
```

---

## 11. Tổng Kết Và Best Practices

### Tổng Kết

| Thao tác | Lệnh Chính | Ví Dụ |
|----------|-----------|-------|
| Chèn | `insertOne`, `insertMany` | Thêm user, sản phẩm |
| Tìm | `find`, `findOne` | Lấy danh sách, chi tiết |
| Cập nhật | `updateOne`, `updateMany` | Sửa thông tin |
| Xóa | `deleteOne`, `deleteMany` | Xóa user, sản phẩm |
| Đếm | `countDocuments` | Đếm số lượng |
| Sắp xếp | `sort` | Sắp xếp theo tiêu chí |
| Giới hạn | `limit`, `skip` | Phân trang |
| Populate | `populate` | Join dữ liệu |
| Tổng hợp | `aggregate` | Thống kê, phân tích |

### Best Practices

#### 1. Luôn Dùng Index
```javascript
// Tạo index cho các trường thường query
await User.createIndex({ email: 1 });
await User.createIndex({ age: 1, city: 1 });
```

#### 2. Sử Dụng Projection Khi Không Cần Tất Cả Trường
```javascript
// ❌ Không tốt - Lấy tất cả trường
const users = await User.find({ age: 25 });

// ✅ Tốt - Chỉ lấy trường cần
const users = await User.find({ age: 25 }, { name: 1, email: 1, _id: 0 });
```

#### 3. Dùng Cursor Pagination Thay Vì Skip
```javascript
// ❌ Không tốt - Chậm với nhiều data
const users = await User.find().skip(10000).limit(10);

// ✅ Tốt - Nhanh hơn nhiều
const users = await User.find({ _id: { $gt: lastId } }).limit(10);
```

#### 4. Sử Dụng Aggregation Cho Các Truy Vấn Phức Tạp
```javascript
// Thay vì query nhiều lần, dùng aggregate
const results = await Order.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$userId", total: { $sum: "$amount" } } },
  { $sort: { total: -1 } },
  { $limit: 10 }
]);
```

#### 5. Validate Dữ Liệu Trước Khi Insert
```javascript
// Luôn validate trước khi lưu
try {
  const user = new User({ name: "John", age: 25 });
  await user.save();
} catch (error) {
  console.error("Validation error:", error.message);
}
```

### Lỗi Thường Gặp Và Cách Khắc Phục

#### 1. Quên await
```javascript
// ❌ Sai
const users = User.find({ age: 25 });

// ✅ Đúng
const users = await User.find({ age: 25 });
```

#### 2. Nhầm giữa find và findOne
```javascript
// ❌ Sai - find trả về mảng
const user = await User.find({ name: "John" });
console.log(user.name);  // undefined!

// ✅ Đúng - findOne trả về document
const user = await User.findOne({ name: "John" });
console.log(user.name);  // "John"
```

#### 3. Populate không hoạt động
```javascript
// ❌ Sai - Chưa định nghĩa ref trong schema
const posts = await Post.find().populate('author');

// ✅ Đúng - Đã định nghĩa ref
const postSchema = new Schema({
  author: { type: ObjectId, ref: "User" }
});
```

---

Chúc bạn sử dụng MongoDB hiệu quả! 🚀
