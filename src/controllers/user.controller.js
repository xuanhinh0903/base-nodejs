const getAllUsers = (req, res) => {
    res.send('Danh sách người dùng');
};

const getUserById = (req, res) => {
    const userId = req.params.id;
    res.send(`Chi tiết người dùng có ID: ${userId}`);
};

// Tạo mới người dùng
const createUser = (req, res) => {
    res.send('Người dùng mới đã được tạo');
};

export {getAllUsers, getUserById, createUser}
