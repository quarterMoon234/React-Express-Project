// import dotenv from 'dotenv';
// dotenv.config();

// import express from "express";
// import path from 'path';                    
// import { fileURLToPath } from 'url'; 

// const app = express();
// const PORT = process.env.PORT || 3000;

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename); 

// app.use(express.static(path.join(__dirname, '../client/dist')));

// app.get(/.*/, (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
// });

// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // React 개발 서버에서 요청 가능하도록 허용
app.use(express.json()); // JSON 요청 처리

app.get("/api/hello", (req, res) => {
  res.json({ message: "안녕하세요! Express 서버에서 보낸 데이터입니다." });
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
