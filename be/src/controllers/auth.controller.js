const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// 1. API Đăng ký tài khoản
const register = async (req, res) => {
    try {
        const { email, password, fullName, phoneNumber, role } = req.body;

        // Kiểm tra xem email hoặc số điện thoại đã tồn tại chưa
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { phoneNumber }]
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email hoặc Số điện thoại đã được sử dụng!" });
        }

        // Băm (Hash) mật khẩu với độ khó là 10
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Lưu vào Database
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                fullName,
                phoneNumber,
                // Nếu FE không gửi role, Prisma sẽ lấy default là CUSTOMER
                role: role || 'CUSTOMER' 
            }
        });

        // Xóa password khỏi kết quả trả về cho an toàn
        delete newUser.password;

        return res.status(201).json({
            message: "Đăng ký tài khoản thành công!",
            data: newUser
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi máy chủ cục bộ." });
    }
};

// 2. API Đăng nhập
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Tìm user theo email (Vì trong Schema bạn đã cấu hình email thay cho username)
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({ message: "Tài khoản không tồn tại!" });
        }

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Mật khẩu không chính xác!" });
        }

        // Tạo JWT Token chứa id và role của user
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return res.status(200).json({
            message: "Đăng nhập thành công!",
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi máy chủ cục bộ." });
    }
};

module.exports = { register, login };