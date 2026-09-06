require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();

const PORT = process.env.PORT || 5000;

const client = new MongoClient(process.env.MONGODB_URI);

let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db("barbershop");
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
    }
}

connectDB();

// Middleware (Added Netlify URL for CORS)
app.use(cors({
    origin: [
        "http://127.0.0.1:5500",
        "https://yewl.onrender.com",
        "https://yewl-barbershop.netlify.app"
    ]
}));

app.use(express.json());


// Test route
app.get("/", (req, res) => {
    res.send("Barbershop backend is running!");
});

// Get all bookings for admin
app.get(
    "/api/admin/bookings",
    authenticateAdmin,
     async (req, res) => {
    try {
        const bookings = await db
            .collection("bookings")
            .find({})
            .sort({ date: 1, time: 1 })
            .toArray();

        res.json({
            success: true,
            bookings
        });

    } catch (error) {
        console.error("Error fetching bookings:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch bookings"
        });
    }
});

// Delete booking
app.delete("/api/admin/bookings/:id", authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Check valid MongoDB ID
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID"
            });
        }

        const result = await db.collection("bookings").deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        console.log("Booking deleted:", id);

        res.json({
            success: true,
            message: "Booking deleted successfully"
        });

    } catch (error) {
        console.error("Delete booking error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete booking"
        });
    }
});

// Get booked time slots
app.get("/api/bookings", async (req, res) => {
    try {
        const { barber, date } = req.query;

        if (!barber || !date) {
            return res.status(400).json({
                success: false,
                message: "Barber and date are required"
            });
        }

        const bookings = await db.collection("bookings").find({
            barber: barber,
            date: date
        }).toArray();

        const bookedTimes = bookings.map(booking => booking.time);

        res.json({
            success: true,
            bookedTimes
        });

    } catch (error) {
        console.error("Error fetching bookings:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch available times"
        });
    }
});

// Admin Login (Updated with direct working credentials)
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Default Username: admin, Password: admin123
    // Aap Render Environment Variables se bhi override kar sakte hain
    const validUsername = process.env.ADMIN_USERNAME || "admin";
    const validPassword = process.env.ADMIN_PASSWORD || "admin123";

    let passwordMatch = false;

    // Check if process.env.ADMIN_PASSWORD_HASH exists, else fallback to plain text comparison
    if (process.env.ADMIN_PASSWORD_HASH) {
      passwordMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    } else {
      passwordMatch = (password === validPassword);
    }

    if (username !== validUsername || !passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }

    const secretKey = process.env.JWT_SECRET || "mysecretjwtkey123";

    const token = jwt.sign(
      {
        username: username,
        role: "admin"
      },
      secretKey,
      {
        expiresIn: "2h"
      }
    );

    res.json({
      success: true,
      token: token
    });

  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
});


// Admin authentication middleware
function authenticateAdmin(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Admin login required"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const secretKey = process.env.JWT_SECRET || "mysecretjwtkey123";

        const decoded = jwt.verify(
            token,
            secretKey
        );

        if (decoded.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        req.admin = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired login"
        });
    }
}


// Booking route
app.post("/api/bookings", async (req, res) => {
    try {
        const {
            service,
            barber,
            date,
            time,
            customerName,
            phone
        } = req.body;

        // Check if this barber is already booked
        const existingBooking = await db.collection("bookings").findOne({
            barber: barber,
            date: date,
            time: time
        });

        // If slot is already booked
        if (existingBooking) {
            return res.status(409).json({
                success: false,
                message: "This barber is already booked for this date and time."
            });
        }

        // Validate required fields
        if (!service || !barber || !date || !time || !customerName || !phone) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        // Create new booking
        const booking = {
            service,
            barber,
            date,
            time,
            customerName,
            phone,
            createdAt: new Date()
        };

        // Save booking to MongoDB
        const result = await db.collection("bookings").insertOne(booking);

        console.log("New Booking Saved:", result.insertedId);

        res.json({
            success: true,
            message: "Appointment booked successfully!",
            bookingId: result.insertedId
        });

    } catch (error) {
        console.error("Booking error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to book appointment"
        });
    }
});


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});