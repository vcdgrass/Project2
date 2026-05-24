const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Lấy token từ header "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Không tìm thấy token xác thực!" });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Gắn thông tin giải mã được vào request để các Controller phía sau sử dụng
        req.user = decoded; 
        
        next(); // Cho phép đi tiếp vào Controller
    } catch (error) {
        return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }
};

module.exports = { verifyToken };