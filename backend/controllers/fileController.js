const multer = require('multer');
const path = require('path');

// 配置multer存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const fileController = {
  // 上传文件
  uploadFile: (req, res) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        console.error('文件上传失败:', err);
        return res.status(500).json({ code: 500, message: '文件上传失败' });
      }
      
      if (!req.file) {
        return res.status(400).json({ code: 400, message: '请选择文件' });
      }
      
      // 构建文件URL
      const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;
      
      res.status(200).json({
        code: 200,
        data: {
          url: fileUrl
        }
      });
    });
  }
};

module.exports = fileController;