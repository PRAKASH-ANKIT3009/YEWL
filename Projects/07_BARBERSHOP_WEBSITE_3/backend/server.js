require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const crypto = require("crypto");

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

// Cancel rather than permanently remove a booking, so reporting remains accurate.
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

        const result = await db.collection("bookings").updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: "Cancelled", updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        console.log("Booking deleted:", id);

        res.json({
            success: true,
            message: "Booking cancelled successfully"
        });

    } catch (error) {
        console.error("Delete booking error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete booking"
        });
    }
});

// Update appointment status from the admin dashboard.
app.patch("/api/admin/bookings/:id/status", authenticateAdmin, async (req, res) => {
    const allowedStatuses = ["Pending", "Confirmed", "Completed", "Cancelled"];
    const { id } = req.params;
    const { status } = req.body;

    if (!ObjectId.isValid(id) || !allowedStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid booking or status" });
    }

    try {
        const result = await db.collection("bookings").updateOne(
            { _id: new ObjectId(id) },
            { $set: { status, updatedAt: new Date() } }
        );
        if (!result.matchedCount) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }
        res.json({ success: true, message: "Booking status updated" });
    } catch (error) {
        console.error("Status update error:", error);
        res.status(500).json({ success: false, message: "Failed to update booking status" });
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
            date: date,
            status: { $ne: "Cancelled" }
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


// Customer self-service updates use a random token returned only at booking time.
app.patch("/api/bookings/:id", async (req, res) => {
    const { id } = req.params;
    const { manageToken, action, date, time } = req.body;
    if (!ObjectId.isValid(id) || !manageToken || !["cancel", "reschedule"].includes(action)) {
        return res.status(400).json({ success: false, message: "Invalid request" });
    }

    try {
        const booking = await db.collection("bookings").findOne({
            _id: new ObjectId(id), manageToken, status: { $nin: ["Cancelled", "Completed"] }
        });
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking cannot be managed" });
        }
        if (action === "cancel") {
            await db.collection("bookings").updateOne(
                { _id: booking._id }, { $set: { status: "Cancelled", updatedAt: new Date() } }
            );
            return res.json({ success: true, message: "Your appointment has been cancelled" });
        }
        if (!date || !time) {
            return res.status(400).json({ success: false, message: "Date and time are required" });
        }
        const conflict = await db.collection("bookings").findOne({
            _id: { $ne: booking._id }, barber: booking.barber, date, time, status: { $ne: "Cancelled" }
        });
        if (conflict) {
            return res.status(409).json({ success: false, message: "That time is no longer available" });
        }
        await db.collection("bookings").updateOne(
            { _id: booking._id }, { $set: { date, time, status: "Pending", updatedAt: new Date() } }
        );
        res.json({ success: true, message: "Your appointment has been rescheduled" });
    } catch (error) {
        console.error("Customer booking update error:", error);
        res.status(500).json({ success: false, message: "Failed to update booking" });
    }
});

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
            time: time,
            status: { $ne: "Cancelled" }
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
            status: "Pending",
            manageToken: crypto.randomBytes(24).toString("hex"),
            createdAt: new Date()
        };

        // Save booking to MongoDB
        const result = await db.collection("bookings").insertOne(booking);

        console.log("New Booking Saved:", result.insertedId);

        res.json({
            success: true,
            message: "Appointment booked successfully!",
            bookingId: result.insertedId,
            manageToken: booking.manageToken
        });

    } catch (error) {
        console.error("Booking error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to book appointment"
        });
    }
});


// ================= PROVIDER SIGNUP =================

app.post("/api/providers/signup", async (req, res) => {
    try {
        const {
            name,
            accountType,
            phone,
            password,
            area
        } = req.body;

        // Validate required fields
        if (!name || !accountType || !phone || !password || !area) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        // Validate account type
        if (!["individual", "shop"].includes(accountType)) {
            return res.status(400).json({
                success: false,
                message: "Account type must be individual or shop."
            });
        }

        // Check if phone already exists
        const existingProvider = await db.collection("providers").findOne({
            phone: phone
        });

        if (existingProvider) {
            return res.status(409).json({
                success: false,
                message: "An account with this phone number already exists."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create provider
        const provider = {
            name: name.trim(),
            accountType,
            phone: phone.trim(),
            password: hashedPassword,
            area: area.trim(),

            services: [],
            workingHours: {
                start: "09:00",
                end: "20:00"
            },

            createdAt: new Date()
        };

        const result = await db.collection("providers").insertOne(provider);

        res.status(201).json({
            success: true,
            message: "Provider account created successfully!",
            providerId: result.insertedId
        });

    } catch (error) {
        console.error("Provider signup error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create provider account."
        });
    }
});


// ================= PROVIDER LOGIN =================

app.post("/api/providers/login", async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Validate fields
        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                message: "Phone and password are required."
            });
        }

        // Find provider
        const provider = await db.collection("providers").findOne({
            phone: phone.trim()
        });

        if (!provider) {
            return res.status(401).json({
                success: false,
                message: "Invalid phone number or password."
            });
        }

        // Check password
        const passwordMatch = await bcrypt.compare(
            password,
            provider.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid phone number or password."
            });
        }

        // JWT secret
        const secretKey = process.env.JWT_SECRET;

        if (!secretKey) {
            return res.status(500).json({
                success: false,
                message: "JWT_SECRET is not configured."
            });
        }

        // Create provider token
        const token = jwt.sign(
            {
                providerId: provider._id.toString(),
                role: "provider",
                accountType: provider.accountType
            },
            secretKey,
            {
                expiresIn: "2h"
            }
        );

        res.json({
            success: true,
            message: "Provider login successful!",
            token,
            provider: {
                id: provider._id,
                name: provider.name,
                accountType: provider.accountType,
                phone: provider.phone,
                area: provider.area
            }
        });

    } catch (error) {
        console.error("Provider login error:", error);

        res.status(500).json({
            success: false,
            message: "Provider login failed."
        });
    }
});


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
