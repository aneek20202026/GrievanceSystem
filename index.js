//index.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { PythonShell } from "python-shell";
import connectDB from "./utils/db.js";
import userrouter from "./routes/user.route.js";
import grievancerouter from "./routes/grievance.route.js";
import airouter from "./routes/ai.route.js"
import http from "http";
import { Server } from "socket.io";



const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Create an HTTP server from the Express app
const server = http.createServer(app);

// Set up Socket.IO on the HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
// app.post("/demo", (req, res) => {
//   const options = {
//     args: [req.body.text || "anal hardcore"],
//     pythonOptions: ['-u']
//   };

//   PythonShell.run('abcdef-1.py', options)
//     .then(results => {
//       try {
//         res.json(JSON.parse(results[0]));
//       } catch (e) {
//         res.status(500).json({ error: "Invalid JSON response from Python" });
//       }
//     })
//     .catch(err => {
//       res.status(500).json({ error: err.message });
//     });
// });

// Server

const PORT = process.env.PORT || 3000;
// Make the Socket.IO instance available in your routes
app.set("io", io);

// Routes
app.use('/api/v1/users', userrouter);
app.use('/api/v1/grievances', grievancerouter);
app.use('/api/v1/airesponse',airouter)

server.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});