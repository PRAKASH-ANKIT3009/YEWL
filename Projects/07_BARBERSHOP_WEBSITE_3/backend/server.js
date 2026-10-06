require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { v2: cloudinary } = require("cloudinary");
const multer = require("multer");

const app = express();

const PORT = process.env.PORT || 5000;

const client = new MongoClient(process.env.MONGODB_URI);

let db;

// ===============================
// CLOUDINARY CONFIGURATION
// ===============================

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// ===============================
// EMAIL CONFIGURATION
// ===============================

const mailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Store uploaded image temporarily in memory
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

async function connectDB() {
    try {

        await client.connect();

        db = client.db("barbershop");

        // Password reset tokens automatically expire
        await db.collection("passwordResets").createIndex(
            { expiresAt: 1 },
            { expireAfterSeconds: 0 }
        );

        console.log("MongoDB connected successfully!");

    } catch (error) {

        console.error(
            "MongoDB connection failed:",
            error
        );

    }
}

connectDB();

// ===============================
// CORS CONFIGURATION
// ===============================

const allowedOrigins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://noorslot-booking-platform.netlify.app"
];

app.use(cors({
    origin: function (origin, callback) {

        // Allow requests without origin
        // such as Postman/server-to-server requests
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(
            new Error("Not allowed by CORS")
        );
    },

    methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS"
    ],

    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ],

    credentials: false
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


// ===============================
// PROVIDER IMAGE UPLOAD
// ===============================

app.post(
    "/api/providers/upload-image",
    authenticateProvider,
    upload.single("image"),
    async (req, res) => {

        try {

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "No image selected"
                });
            }

            if (!req.file.mimetype.startsWith("image/")) {
                return res.status(400).json({
                    success: false,
                    message: "Only image files are allowed"
                });
            }

            const result = await new Promise((resolve, reject) => {

                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "yewl/providers",
                        resource_type: "image"
                    },
                    (error, result) => {

                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }

                    }
                );

                stream.end(req.file.buffer);

            });

            console.log(
                "Provider image uploaded:",
                result.secure_url
            );

            res.json({
                success: true,
                message: "Image uploaded successfully",
                imageUrl: result.secure_url
            });

        } catch (error) {

            console.error(
                "Cloudinary upload error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Image upload failed"
            });

        }

    }
);


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

// ===============================
// BOOKING ROUTE
// ===============================

app.post("/api/bookings", async (req, res) => {

    try {

        const {
            providerId,
            serviceId,
            service,
            barber,
            date,
            time,
            customerName,
            phone
        } = req.body;

        // ===============================
        // OPTIONAL CUSTOMER AUTHENTICATION
        // ===============================

        let loggedInCustomerId = null;

        const authHeader =
            req.headers.authorization;

        if (
            authHeader &&
            authHeader.startsWith("Bearer ")
        ) {

            const token =
                authHeader.split(" ")[1];

            try {

                const secretKey =
                    process.env.JWT_SECRET;

                if (!secretKey) {

                    return res.status(500).json({
                        success: false,
                        message:
                            "JWT_SECRET is not configured."
                    });

                }

                const decoded =
                    jwt.verify(
                        token,
                        secretKey
                    );

                if (
                    decoded.role !== "customer" ||
                    !decoded.customerId ||
                    !ObjectId.isValid(
                        decoded.customerId
                    )
                ) {

                    return res.status(403).json({
                        success: false,
                        message:
                            "Invalid customer account."
                    });

                }

                loggedInCustomerId =
                    new ObjectId(
                        decoded.customerId
                    );

            } catch (error) {

                return res.status(401).json({
                    success: false,
                    message:
                        "Customer login has expired. Please login again."
                });

            }

        }


        // Validate required fields

        if (
            !service ||
            !date ||
            !time ||
            !customerName ||
            !phone
        ) {

            return res.status(400).json({
                success: false,
                message: "All required fields are missing."
            });

        }


        // ===============================
        // NEW PROVIDER BOOKING
        // ===============================

        if (providerId && serviceId) {

            if (!ObjectId.isValid(providerId)) {

                return res.status(400).json({
                    success: false,
                    message: "Invalid provider ID."
                });

            }


            if (!ObjectId.isValid(serviceId)) {

                return res.status(400).json({
                    success: false,
                    message: "Invalid service ID."
                });

            }


            const providerObjectId =
                new ObjectId(providerId);

            const serviceObjectId =
                new ObjectId(serviceId);


            // Check provider exists

            const provider =
                await db.collection("providers").findOne({
                    _id: providerObjectId
                });


            if (!provider) {

                return res.status(404).json({
                    success: false,
                    message: "Provider not found."
                });

            }


            // Check service belongs to this provider

            const selectedService =
                await db.collection("services").findOne({
                    _id: serviceObjectId,
                    providerId: providerObjectId,
                    isActive: true
                });


            if (!selectedService) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Service not found for this provider."
                });

            }


            // Check if provider is already booked

            const existingBooking =
                await db.collection("bookings").findOne({

                    providerId: providerObjectId,

                    date: date,

                    time: time,

                    status: {
                        $ne: "Cancelled"
                    }

                });


            if (existingBooking) {

                return res.status(409).json({
                    success: false,
                    message:
                        "This provider is already booked for this date and time."
                });

            }

            // Generate customer booking/receiving code
            const receivingCode =
                "BK-" +
                crypto.randomBytes(3).toString("hex").toUpperCase();


            // Create new booking

            const booking = {

                providerId: providerObjectId,

                serviceId: serviceObjectId,

                service: selectedService.name,

                barber: provider.name,

                date: date,

                time: time,

                customerName: customerName.trim(),

                phone: phone.trim(),

                customerId: loggedInCustomerId,

                receivingCode: receivingCode,

                status: "Pending",

                manageToken:
                    crypto.randomBytes(24).toString("hex"),

                createdAt: new Date()

            };


            const result =
                await db.collection("bookings")
                    .insertOne(booking);


            console.log(
                "New Provider Booking Saved:",
                result.insertedId
            );
            

            return res.json({

                success: true,

                message: "Appointment booked successfully!",

                bookingId: result.insertedId,

                manageToken: booking.manageToken,

                receivingCode: booking.receivingCode

            });

        }


        // ===============================
        // OLD BOOKING SYSTEM
        // ===============================

        if (!barber) {

            return res.status(400).json({
                success: false,
                message: "Barber is required."
            });

        }


        const existingBooking =
            await db.collection("bookings").findOne({

                barber: barber,

                date: date,

                time: time,

                status: {
                    $ne: "Cancelled"
                }

            });


        if (existingBooking) {

            return res.status(409).json({
                success: false,
                message:
                    "This barber is already booked for this date and time."
            });

        }


        const booking = {

            service,

            barber,

            date,

            time,

            customerName,

            phone,

            customerId:       
                loggedInCustomerId,

            status: "Pending",

            manageToken:
                crypto.randomBytes(24).toString("hex"),

            createdAt:
                new Date()

        };


        const result =
            await db.collection("bookings")
                .insertOne(booking);


        console.log(
            "New Booking Saved:",
            result.insertedId
        );


        res.json({

            success: true,

            message:
                "Appointment booked successfully!",

            bookingId:
                result.insertedId,

            manageToken:
                booking.manageToken

        });


    } catch (error) {

        console.error(
            "Booking error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to book appointment"

        });

    }

});


// =====================================
// GET AVAILABLE SLOTS
// =====================================

app.get("/api/providers/:providerId/available-slots", async (req, res) => {
    try {
        const { providerId } = req.params;
        const { date, serviceId } = req.query;

        // Validate inputs
        if (
            !ObjectId.isValid(providerId) ||
            !ObjectId.isValid(serviceId) ||
            !date
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid provider, service and date are required."
            });
        }

        // Validate date format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({
                success: false,
                message: "Date must be in YYYY-MM-DD format."
            });
        }

        const providerObjectId = new ObjectId(providerId);
        const serviceObjectId = new ObjectId(serviceId);

        // Find provider
        const provider = await db.collection("providers").findOne({
            _id: providerObjectId
        });

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: "Provider not found."
            });
        }

        // Find active service
        const selectedService = await db.collection("services").findOne({
            _id: serviceObjectId,
            providerId: providerObjectId,
            isActive: true
        });

        if (!selectedService) {
            return res.status(404).json({
                success: false,
                message: "Service not found."
            });
        }

        // Provider working hours
        const workingHours = provider.workingHours || {};

        const startTime = workingHours.start || "09:00";
        const endTime = workingHours.end || "20:00";

        // Service duration (minutes)
        const duration = Number(selectedService.duration || 30);

        if (
            !Number.isFinite(duration) ||
            duration <= 0 ||
            duration > 480
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid service duration."
            });
        }

        function toMinutes(time) {
            const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time);

            if (!match) return null;

            return Number(match[1]) * 60 + Number(match[2]);
        }

        const startMinutes = toMinutes(startTime);
        const endMinutes = toMinutes(endTime);

        if (
            startMinutes === null ||
            endMinutes === null ||
            endMinutes <= startMinutes
        ) {
            return res.status(400).json({
                success: false,
                message: "Provider working hours are invalid."
            });
        }

        // Get existing non-cancelled bookings
        const existingBookings = await db.collection("bookings").find({
            providerId: providerObjectId,
            date: date,
            status: { $ne: "Cancelled" }
        }).toArray();

        const bookedTimes = new Set(
            existingBookings.map(booking => booking.time)
        );

        // Generate slots
        const slots = [];

        for (
            let minutes = startMinutes;
            minutes + duration <= endMinutes;
            minutes += duration
        ) {
            const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
            const mins = String(minutes % 60).padStart(2, "0");
            const time = `${hours}:${mins}`;

            slots.push({
                time,
                available: !bookedTimes.has(time)
            });
        }

        res.json({
            success: true,
            date,
            providerId,
            serviceId,
            slots
        });

    } catch (error) {
        console.error("Available slots error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load available slots."
        });
    }
});


// ============== FIND BOOKING BY CODE ================= 
app.get("/api/bookings/by-code", async (req, res) => {
  try {
    const { code, phone } = req.query;

    if (!code || !phone) {
      return res.status(400).json({
        success: false,
        message: "Booking code and phone number are required."
      });
    }

    const booking = await db.collection("bookings").findOne({
      receivingCode: code.trim().toUpperCase(),
      phone: phone.trim()
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found. Please check your booking code and phone number."
      });
    }

    res.json({
      success: true,
      booking: {
        receivingCode: booking.receivingCode,
        service: booking.service,
        barber: booking.barber,
        date: booking.date,
        time: booking.time,
        customerName: booking.customerName,
        phone: booking.phone,
        status: booking.status
      }
    });

  } catch (error) {
    console.error("Find booking error:", error);

    res.status(500).json({
      success: false,
      message: "Server error."
    });
  }
});

// ================= CUSTOMER SIGNUP =================

app.post("/api/customers/signup", async (req, res) => {

    try {

        const {
            name,
            phone,
            email,
            password
        } = req.body;


        // ===============================
        // VALIDATION
        // ===============================

        if (
            !name ||
            !phone ||
            !email ||
            !password
        ) {

            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });

        }


        const cleanName =
            name.trim();

        const cleanPhone =
            phone.trim();

        const cleanEmail =
            email.trim().toLowerCase();


        // ===============================
        // NAME VALIDATION
        // ===============================

        if (cleanName.length < 2) {

            return res.status(400).json({
                success: false,
                message: "Name must be at least 2 characters."
            });

        }


        // ===============================
        // PHONE VALIDATION
        // ===============================

        if (!/^[0-9]{10}$/.test(cleanPhone)) {

            return res.status(400).json({
                success: false,
                message: "Please enter a valid 10-digit phone number."
            });

        }


        // ===============================
        // EMAIL VALIDATION
        // ===============================

        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                cleanEmail
            )
        ) {

            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });

        }


        // ===============================
        // PASSWORD VALIDATION
        // ===============================

        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters."
            });

        }


        // ===============================
        // CHECK EXISTING CUSTOMER
        // ===============================

        const existingCustomer =
            await db.collection("customers").findOne({
                $or: [
                    {
                        phone: cleanPhone
                    },
                    {
                        email: cleanEmail
                    }
                ]
            });


        if (existingCustomer) {

            if (
                existingCustomer.phone ===
                cleanPhone
            ) {

                return res.status(409).json({
                    success: false,
                    message:
                        "An account with this phone number already exists."
                });

            }


            if (
                existingCustomer.email ===
                cleanEmail
            ) {

                return res.status(409).json({
                    success: false,
                    message:
                        "An account with this email already exists."
                });

            }

        }


        // ===============================
        // HASH PASSWORD
        // ===============================

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // ===============================
        // CREATE CUSTOMER
        // ===============================

        const customer = {

            name:
                cleanName,

            phone:
                cleanPhone,

            email:
                cleanEmail,

            password:
                hashedPassword,

            createdAt:
                new Date()

        };


        const result =
            await db.collection("customers")
                .insertOne(customer);


        // ===============================
        // RESPONSE
        // ===============================

        res.status(201).json({

            success: true,

            message:
                "Customer account created successfully!",

            customerId:
                result.insertedId

        });


    } catch (error) {

        console.error(
            "Customer signup error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to create customer account."

        });

    }

});

// ================= CUSTOMER LOGIN =================

app.post("/api/customers/login", async (req, res) => {
    try {
        const {
            phone,
            password
        } = req.body;

        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                message: "Phone number and password are required."
            });
        }

        const cleanPhone = phone.trim();

        const customer =
            await db.collection("customers").findOne({
                phone: cleanPhone
            });

        if (!customer) {
            return res.status(401).json({
                success: false,
                message: "Invalid phone number or password."
            });
        }

        const passwordMatch =
            await bcrypt.compare(
                password,
                customer.password
            );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid phone number or password."
            });
        }

        const token =
            jwt.sign(
                {
                    customerId:
                        customer._id.toString(),

                    role: "customer"
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "7d"
                }
            );

        res.json({
            success: true,
            message: "Login successful!",

            token: token,

            customer: {
                id: customer._id,
                name: customer.name,
                phone: customer.phone,
                email: customer.email
            }
        });

    } catch (error) {

        console.error(
            "Customer login error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to login."
        });
    }
});

// ================= CUSTOMER AUTHENTICATION =================

function authenticateCustomer(req, res, next) {

    const authHeader =
        req.headers.authorization;

    if (
        !authHeader ||
        !authHeader.startsWith("Bearer ")
    ) {
        return res.status(401).json({
            success: false,
            message: "Customer login required."
        });
    }

    const token =
        authHeader.split(" ")[1];

    try {

        const secretKey =
            process.env.JWT_SECRET;

        if (!secretKey) {
            return res.status(500).json({
                success: false,
                message: "JWT_SECRET is not configured."
            });
        }

        const decoded =
            jwt.verify(
                token,
                secretKey
            );

        if (decoded.role !== "customer") {
            return res.status(403).json({
                success: false,
                message: "Customer access only."
            });
        }

        req.customer =
            decoded;

        next();

    } catch (error) {

        console.error(
            "Customer authentication error:",
            error
        );

        return res.status(401).json({
            success: false,
            message: "Invalid or expired customer login."
        });
    }
}


// ================= CUSTOMER BOOKINGS =================

app.get(
    "/api/customers/bookings",
    authenticateCustomer,
    async (req, res) => {

        try {

            const customerId =
                new ObjectId(
                    req.customer.customerId
                );

            const bookings =
                await db
                    .collection("bookings")
                    .find({
                        customerId: customerId
                    })
                    .sort({
                        createdAt: -1
                    })
                    .toArray();

            res.json({

                success: true,

                bookings: bookings.map(
                    function (booking) {

                        return {

                            id:
                                booking._id,

                            receivingCode:
                                booking.receivingCode ||
                                "",

                            service:
                                booking.service ||
                                "",

                            provider:
                                booking.barber ||
                                booking.providerName ||
                                "",

                            date:
                                booking.date ||
                                "",

                            time:
                                booking.time ||
                                "",

                            status:
                                booking.status ||
                                "Pending",

                            createdAt:
                                booking.createdAt ||
                                null
                        };

                    }
                )

            });

        } catch (error) {

            console.error(
                "Customer bookings error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Failed to load customer bookings."

            });

        }

    }
);


// ================= PROVIDER SIGNUP =================

app.post("/api/providers/signup", async (req, res) => {

    try {

        const {
            name,
            accountType,
            phone,
            email,
            password,
            area
        } = req.body;


        // ========================================
        // CLEAN INPUT VALUES
        // ========================================

        const cleanName = name?.trim();
        const cleanPhone = phone?.trim();
        const cleanEmail = email?.trim().toLowerCase();
        const cleanArea = area?.trim();


        // ========================================
        // VALIDATE REQUIRED FIELDS
        // ========================================

        if (
            !cleanName ||
            !accountType ||
            !cleanPhone ||
            !cleanEmail ||
            !password ||
            !cleanArea
        ) {

            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });

        }


        // ========================================
        // VALIDATE NAME
        // ========================================

        if (cleanName.length < 2) {

            return res.status(400).json({
                success: false,
                message: "Name must be at least 2 characters."
            });

        }


        // ========================================
        // VALIDATE ACCOUNT TYPE
        // ========================================

        if (
            !["individual", "shop"].includes(accountType)
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Account type must be individual or shop."
            });

        }


        // ========================================
        // VALIDATE PHONE
        // ========================================

        if (!/^[0-9]{10}$/.test(cleanPhone)) {

            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid 10-digit phone number."
            });

        }


        // ========================================
        // VALIDATE EMAIL
        // ========================================

        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(cleanEmail)
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid email address."
            });

        }


        // ========================================
        // VALIDATE PASSWORD
        // ========================================

        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters."
            });

        }


        // ========================================
        // CHECK PHONE / EMAIL ALREADY EXISTS
        // ========================================

        const existingProvider =
            await db.collection("providers").findOne({

                $or: [

                    {
                        phone: cleanPhone
                    },

                    {
                        email: cleanEmail
                    }

                ]

            });


        if (existingProvider) {

            if (
                existingProvider.phone === cleanPhone
            ) {

                return res.status(409).json({
                    success: false,
                    message:
                        "An account with this phone number already exists."
                });

            }


            if (
                existingProvider.email === cleanEmail
            ) {

                return res.status(409).json({
                    success: false,
                    message:
                        "An account with this email already exists."
                });

            }

        }


        // ========================================
        // HASH PASSWORD
        // ========================================

        const hashedPassword =
            await bcrypt.hash(password, 10);


        // ========================================
        // CREATE PROVIDER
        // ========================================

        const provider = {

            name: cleanName,

            accountType,

            phone: cleanPhone,

            email: cleanEmail,

            password: hashedPassword,

            area: cleanArea,


            services: [],


            workingHours: {

                start: "09:00",

                end: "20:00"

            },


            createdAt: new Date()

        };


        // ========================================
        // SAVE PROVIDER
        // ========================================

        const result =
            await db
                .collection("providers")
                .insertOne(provider);


        // ========================================
        // SUCCESS RESPONSE
        // ========================================

        res.status(201).json({

            success: true,

            message:
                "Provider account created successfully!",

            providerId:
                result.insertedId

        });


    } catch (error) {

        console.error(
            "Provider signup error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to create provider account."

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


// ========================================
// FORGOT PASSWORD
// ========================================

app.post("/api/auth/forgot-password", async (req, res) => {

    try {

        const {
            email,
            accountType
        } = req.body;


        // --------------------------------
        // VALIDATION
        // --------------------------------

        if (!email || !accountType) {

            return res.status(400).json({
                success: false,
                message: "Email and account type are required."
            });

        }


        if (!["customer", "provider"].includes(accountType)) {

            return res.status(400).json({
                success: false,
                message: "Invalid account type."
            });

        }


        const cleanEmail =
            email.trim().toLowerCase();


        // --------------------------------
        // SELECT COLLECTION
        // --------------------------------

        const collectionName =
            accountType === "customer"
                ? "customers"
                : "providers";


        const collection =
            db.collection(collectionName);


        // --------------------------------
        // FIND USER
        // --------------------------------

        const user =
            await collection.findOne({
                email: cleanEmail
            });


        // --------------------------------
        // GENERIC RESPONSE
        // --------------------------------
        // Don't reveal whether email exists

        if (!user) {

            return res.json({
                success: true,
                message:
                    "If an account exists with this email, a password reset link has been sent."
            });

        }


        // --------------------------------
        // GENERATE RESET TOKEN
        // --------------------------------

        const rawToken =
            crypto
                .randomBytes(32)
                .toString("hex");


        const tokenHash =
            crypto
                .createHash("sha256")
                .update(rawToken)
                .digest("hex");


        // 15 minutes expiry

        const expiresAt =
            new Date(
                Date.now() +
                15 * 60 * 1000
            );


        // --------------------------------
        // DELETE OLD TOKENS
        // --------------------------------

        await db
            .collection("passwordResets")
            .deleteMany({
                userId: user._id,
                accountType: accountType
            });


        // --------------------------------
        // SAVE RESET TOKEN
        // --------------------------------

        await db
            .collection("passwordResets")
            .insertOne({

                userId: user._id,

                accountType:
                    accountType,

                email:
                    cleanEmail,

                tokenHash:
                    tokenHash,

                expiresAt:
                    expiresAt,

                usedAt:
                    null,

                createdAt:
                    new Date()

            });


        // --------------------------------
        // RESET LINK
        // --------------------------------

        const frontendUrl = process.env.FRONTEND_URL;

        if (!frontendUrl) {
            console.error("FRONTEND_URL is not configured.");

            return res.status(500).json({
                success: false,
                message: "Password reset service is not configured."
            });
        }

        const resetLink =
            `${frontendUrl}/reset-password.html?token=${rawToken}&type=$         {accountType}`;


        // --------------------------------
        // EMAIL
        // --------------------------------

        await mailTransporter.sendMail({

            from: `"NOORSLOT" <${process.env.SMTP_USER}>`,

            to: cleanEmail,

            subject:
                "NOORSLOT - Reset Your Password",

            html: `

                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 30px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                ">

                    <h2 style="text-align:center;">
                        NOORSLOT
                    </h2>

                    <h3>
                        Password Reset Request
                    </h3>

                    <p>
                        We received a request to reset
                        your NOORSLOT password.
                    </p>

                    <p>
                        Click the button below to
                        create a new password.
                    </p>

                    <div style="text-align:center; margin:30px 0;">

                        <a
                            href="${resetLink}"
                            style="
                                background:#111;
                                color:white;
                                padding:12px 25px;
                                text-decoration:none;
                                border-radius:6px;
                                display:inline-block;
                            "
                        >
                            Reset Password
                        </a>

                    </div>

                    <p>
                        This link will expire in
                        <strong>15 minutes</strong>.
                    </p>

                    <p>
                        If you did not request this,
                        you can safely ignore this email.
                    </p>

                    <hr>

                    <p style="font-size:12px;color:#777;">
                        © NOORSLOT
                    </p>

                </div>

            `

        });


        // --------------------------------
        // RESPONSE
        // --------------------------------

        res.json({

            success: true,

            message:
                "If an account exists with this email, a password reset link has been sent."

        });


    } catch (error) {

        console.error(
            "Forgot password error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to process password reset request."

        });

    }

});


// ========================================
// RESET PASSWORD
// ========================================

app.post("/api/auth/reset-password", async (req, res) => {

    try {

        const {
            token,
            accountType,
            newPassword
        } = req.body;


        // --------------------------------
        // VALIDATION
        // --------------------------------

        if (
            !token ||
            !accountType ||
            !newPassword
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Token, account type and new password are required."
            });

        }


        if (
            !["customer", "provider"]
                .includes(accountType)
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid account type."
            });

        }


        if (newPassword.length < 6) {

            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters."
            });

        }


        // --------------------------------
        // HASH TOKEN
        // --------------------------------

        const tokenHash =
            crypto
                .createHash("sha256")
                .update(token)
                .digest("hex");


        // --------------------------------
        // FIND RESET TOKEN
        // --------------------------------

        const resetRecord =
            await db
                .collection("passwordResets")
                .findOne({

                    tokenHash:
                        tokenHash,

                    accountType:
                        accountType,

                    usedAt:
                        null,

                    expiresAt: {
                        $gt: new Date()
                    }

                });


        if (!resetRecord) {

            return res.status(400).json({

                success: false,

                message:
                    "This password reset link is invalid or expired."

            });

        }


        // --------------------------------
        // SELECT COLLECTION
        // --------------------------------

        const collectionName =
            accountType === "customer"
                ? "customers"
                : "providers";


        const collection =
            db.collection(collectionName);


        // --------------------------------
        // HASH NEW PASSWORD
        // --------------------------------

        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                10
            );


        // --------------------------------
        // UPDATE PASSWORD
        // --------------------------------

        const updateResult =
            await collection.updateOne(

                {
                    _id:
                        resetRecord.userId
                },

                {
                    $set: {

                        password:
                            hashedPassword,

                        passwordUpdatedAt:
                            new Date()

                    }

                }

            );


        if (
            updateResult.matchedCount === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Account not found."

            });

        }


        // --------------------------------
        // MARK TOKEN USED
        // --------------------------------

        await db
            .collection("passwordResets")
            .updateOne(

                {
                    _id:
                        resetRecord._id
                },

                {
                    $set: {

                        usedAt:
                            new Date()

                    }

                }

            );


        // --------------------------------
        // RESPONSE
        // --------------------------------

        res.json({

            success: true,

            message:
                "Password reset successfully. You can now login with your new password."

        });


    } catch (error) {

        console.error(
            "Reset password error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to reset password."

        });

    }

});


// ================= PROVIDER AUTHENTICATION =================

function authenticateProvider(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Provider login required."
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const secretKey = process.env.JWT_SECRET;

        if (!secretKey) {
            return res.status(500).json({
                success: false,
                message: "JWT_SECRET is not configured."
            });
        }

        const decoded = jwt.verify(token, secretKey);

        if (decoded.role !== "provider") {
            return res.status(403).json({
                success: false,
                message: "Provider access only."
            });
        }

        req.provider = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired provider login."
        });
    }
}


// ================= PROVIDER SERVICES =================

// Add a new service
app.post("/api/providers/services", authenticateProvider, async (req, res) => {
    try {
        const {
            name,
            price,
            duration
        } = req.body;

        // Validate required fields
        if (!name || price === undefined || !duration) {
            return res.status(400).json({
                success: false,
                message: "Service name, price and duration are required."
            });
        }

        // Validate price
        if (Number(price) < 0) {
            return res.status(400).json({
                success: false,
                message: "Price cannot be negative."
            });
        }

        // Validate duration
        if (Number(duration) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Duration must be greater than 0."
            });
        }

        const service = {
            providerId: new ObjectId(req.provider.providerId),
            name: name.trim(),
            price: Number(price),
            duration: Number(duration),
            isActive: true,
            createdAt: new Date()
        };

        const result = await db.collection("services").insertOne(service);

        res.status(201).json({
            success: true,
            message: "Service added successfully!",
            service: {
                id: result.insertedId,
                name: service.name,
                price: service.price,
                duration: service.duration,
                isActive: service.isActive
            }
        });

    } catch (error) {
        console.error("Add service error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to add service."
        });
    }
});


// Get logged-in provider's services
app.get("/api/providers/services", authenticateProvider, async (req, res) => {
    try {
        const services = await db.collection("services")
            .find({
                providerId: new ObjectId(req.provider.providerId)
            })
            .sort({ createdAt: -1 })
            .toArray();

        res.json({
            success: true,
            services
        });

    } catch (error) {
        console.error("Get services error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch services."
        });
    }
});


// Delete provider's own service
app.delete("/api/providers/services/:id", authenticateProvider, async (req, res) => {
    try {

        const serviceId = req.params.id;

        if (!ObjectId.isValid(serviceId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid service ID."
            });
        }

        const result = await db.collection("services").deleteOne({
            _id: new ObjectId(serviceId),
            providerId: new ObjectId(req.provider.providerId)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Service not found or you do not have permission to delete it."
            });
        }

        res.json({
            success: true,
            message: "Service deleted successfully!"
        });

    } catch (error) {

        console.error("Delete service error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete service."
        });

    }
});


// ===============================
// EDIT SERVICE
// ===============================

app.patch("/api/providers/services/:id", authenticateProvider, async (req, res) => {
    try {

        const serviceId = req.params.id;

        const {
            name,
            price,
            duration
        } = req.body;

        if (!ObjectId.isValid(serviceId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid service ID."
            });
        }

        if (!name || price === undefined || !duration) {
            return res.status(400).json({
                success: false,
                message: "Service name, price and duration are required."
            });
        }

        if (Number(price) < 0) {
            return res.status(400).json({
                success: false,
                message: "Price cannot be negative."
            });
        }

        if (Number(duration) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Duration must be greater than 0."
            });
        }

        const result = await db.collection("services").updateOne(
            {
                _id: new ObjectId(serviceId),
                providerId: new ObjectId(req.provider.providerId)
            },
            {
                $set: {
                    name: name.trim(),
                    price: Number(price),
                    duration: Number(duration),
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Service not found or you do not have permission to edit it."
            });
        }

        res.json({
            success: true,
            message: "Service updated successfully!"
        });

    } catch (error) {

        console.error("Edit service error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update service."
        });

    }
});

// ===============================
// PROVIDER PROFILE
// ===============================

// Get logged-in provider profile
app.get(
    "/api/providers/profile",
    authenticateProvider,
    async (req, res) => {

        try {

            const provider =
                await db.collection("providers").findOne(
                    {
                        _id: new ObjectId(
                            req.provider.providerId
                        )
                    },
                    {
                        projection: {
                            password: 0
                        }
                    }
                );

            if (!provider) {
                return res.status(404).json({
                    success: false,
                    message: "Provider not found."
                });
            }

            res.json({
                success: true,
                provider
            });

        } catch (error) {

            console.error(
                "Get provider profile error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Failed to fetch provider profile."
            });
        }
    }
);


// Update provider profile
app.patch(
    "/api/providers/profile",
    authenticateProvider,
    async (req, res) => {

        try {

            const {
                name,
                category,
                area,
                latitude,
                longitude,
                profileImage,
                businessImages
            } = req.body;


            // Validate GPS coordinates
            if (latitude !== undefined || longitude !== undefined) {

                const lat = Number(latitude);
                const lng = Number(longitude);

                if (
                    !Number.isFinite(lat) ||
                    !Number.isFinite(lng) ||
                    lat < -90 ||
                    lat > 90 ||
                    lng < -180 ||
                    lng > 180
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid location coordinates."
                    });
                }
            }


            // Allowed categories
            const allowedCategories = [
                "barber",
                "beauty",
                "makeup"
            ];


            if (
                category &&
                !allowedCategories.includes(category)
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Invalid category."
                });

            }


            const updateData = {
                updatedAt: new Date()
            };

            if (latitude !== undefined && longitude !== undefined) {

                updateData.latitude = Number(latitude);
                updateData.longitude = Number(longitude);

            }


            if (name && name.trim()) {
                updateData.name = name.trim();
            }


            if (category) {
                updateData.category = category;
            }


            if (area && area.trim()) {
                updateData.area = area.trim();
            }


            if (profileImage) {
                updateData.profileImage = profileImage;
            }


            if (Array.isArray(businessImages)) {
                updateData.businessImages =
                    businessImages;
            }


            await db.collection("providers").updateOne(
                {
                    _id: new ObjectId(
                        req.provider.providerId
                    )
                },
                {
                    $set: updateData
                }
            );


            res.json({
                success: true,
                message: "Profile updated successfully!"
            });


        } catch (error) {

            console.error(
                "Update provider profile error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Failed to update provider profile."
            });
        }
    }
);


// ===============================
// PROVIDER WORKING HOURS
// ===============================

app.get(
    "/api/providers/working-hours",
    authenticateProvider,
    async (req, res) => {

        try {

            const provider =
                await db.collection("providers").findOne(
                    {
                        _id: new ObjectId(
                            req.provider.providerId
                        )
                    },
                    {
                        projection: {
                            workingHours: 1
                        }
                    }
                );

            if (!provider) {

                return res.status(404).json({
                    success: false,
                    message: "Provider not found."
                });

            }


            // Default weekly schedule

            const defaultHours = {

                monday: {
                    isOpen: true,
                    start: "09:00",
                    end: "20:00"
                },

                tuesday: {
                    isOpen: true,
                    start: "09:00",
                    end: "20:00"
                },

                wednesday: {
                    isOpen: true,
                    start: "09:00",
                    end: "20:00"
                },

                thursday: {
                    isOpen: true,
                    start: "09:00",
                    end: "20:00"
                },

                friday: {
                    isOpen: true,
                    start: "09:00",
                    end: "20:00"
                },

                saturday: {
                    isOpen: true,
                    start: "09:00",
                    end: "20:00"
                },

                sunday: {
                    isOpen: false,
                    start: "09:00",
                    end: "20:00"
                }

            };


            // Check whether weekly schedule
            // already exists

            const savedHours =
                provider.workingHours;


            const isWeeklySchedule =
                savedHours &&
                savedHours.monday &&
                savedHours.tuesday &&
                savedHours.wednesday &&
                savedHours.thursday &&
                savedHours.friday &&
                savedHours.saturday &&
                savedHours.sunday;


            const workingHours =
                isWeeklySchedule
                    ? savedHours
                    : defaultHours;


            res.json({
                success: true,
                workingHours: workingHours
            });


        } catch (error) {

            console.error(
                "Get working hours error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to fetch working hours."
            });

        }

    }
);


// Save / update working hours
app.put("/api/providers/working-hours", authenticateProvider, async (req, res) => {
    try {

        const { workingHours } = req.body;

        if (!workingHours) {
            return res.status(400).json({
                success: false,
                message: "Working hours are required."
            });
        }

        const days = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday"
        ];

        for (const day of days) {

            if (!workingHours[day]) {
                return res.status(400).json({
                    success: false,
                    message: `${day} schedule is required.`
                });
            }

            const schedule = workingHours[day];

            if (typeof schedule.isOpen !== "boolean") {
                return res.status(400).json({
                    success: false,
                    message: `Invalid opening status for ${day}.`
                });
            }

            // Time validation only when the provider is open
            if (schedule.isOpen) {

                if (!schedule.start || !schedule.end) {
                    return res.status(400).json({
                        success: false,
                        message: `Opening and closing time are required for ${day}.`
                    });
                }

                if (schedule.start >= schedule.end) {
                    return res.status(400).json({
                        success: false,
                        message: `Closing time must be later than opening time for ${day}.`
                    });
                }
            }
        }

        await db.collection("providers").updateOne(
            {
                _id: new ObjectId(req.provider.providerId)
            },
            {
                $set: {
                    workingHours: workingHours,
                    updatedAt: new Date()
                }
            }
        );

        res.json({
            success: true,
            message: "Working hours updated successfully!"
        });

    } catch (error) {

        console.error("Save working hours error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to save working hours."
        });

    }
});

// Public: Get provider working hours
app.get("/api/public/providers/:providerId/working-hours", async (req, res) => {
    try {
        const { providerId } = req.params;

        if (!ObjectId.isValid(providerId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid provider ID."
            });
        }

        const provider = await db.collection("providers").findOne(
            {
                _id: new ObjectId(providerId)
            },
            {
                projection: {
                    workingHours: 1
                }
            }
        );

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: "Provider not found."
            });
        }

        const defaultHours = {
            monday: {
                isOpen: true,
                start: "09:00",
                end: "20:00"
            },
            tuesday: {
                isOpen: true,
                start: "09:00",
                end: "20:00"
            },
            wednesday: {
                isOpen: true,
                start: "09:00",
                end: "20:00"
            },
            thursday: {
                isOpen: true,
                start: "09:00",
                end: "20:00"
            },
            friday: {
                isOpen: true,
                start: "09:00",
                end: "20:00"
            },
            saturday: {
                isOpen: true,
                start: "09:00",
                end: "20:00"
            },
            sunday: {
                isOpen: false,
                start: "09:00",
                end: "20:00"
            }
        };

        const savedHours = provider.workingHours;

        const isWeeklySchedule =
            savedHours &&
            savedHours.monday &&
            savedHours.tuesday &&
            savedHours.wednesday &&
            savedHours.thursday &&
            savedHours.friday &&
            savedHours.saturday &&
            savedHours.sunday;

        const workingHours =
            isWeeklySchedule
                ? savedHours
                : defaultHours;

        res.json({
            success: true,
            workingHours
        });

    } catch (error) {
        console.error("Public working hours error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch working hours."
        });
    }
});


// ===============================
// PUBLIC: GET PROVIDER AVAILABILITY
// ===============================

app.get(
    "/api/public/providers/:providerId/availability",
    async (req, res) => {

        try {

            const { providerId } = req.params;
            const { date } = req.query;


            // ===============================
            // VALIDATE PROVIDER ID
            // ===============================

            if (!ObjectId.isValid(providerId)) {

                return res.status(400).json({
                    success: false,
                    message: "Invalid provider ID."
                });

            }


            // ===============================
            // VALIDATE DATE
            // ===============================

            if (!date) {

                return res.status(400).json({
                    success: false,
                    message: "Date is required."
                });

            }


            // ===============================
            // CHECK PROVIDER
            // ===============================

            const provider =
                await db.collection("providers").findOne(
                    {
                        _id: new ObjectId(providerId)
                    },
                    {
                        projection: {
                            name: 1,
                            workingHours: 1
                        }
                    }
                );


            if (!provider) {

                return res.status(404).json({
                    success: false,
                    message: "Provider not found."
                });

            }


            // ===============================
            // GET DAY NAME
            // ===============================

            const selectedDate =
                new Date(`${date}T00:00:00`);

            const dayNames = [
                "sunday",
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday"
            ];

            const dayName =
                dayNames[selectedDate.getDay()];


            // ===============================
            // GET WORKING HOURS
            // ===============================

            const workingHours =
                provider.workingHours || {};

            const daySchedule =
                workingHours[dayName];


            if (!daySchedule || !daySchedule.isOpen) {

                return res.json({
                    success: true,
                    date: date,
                    day: dayName,
                    isOpen: false,
                    workingHours: null,
                    bookedTimes: []
                });

            }


            // ===============================
            // GET BOOKED TIMES
            // ===============================

            const bookings =
                await db.collection("bookings")
                    .find({
                        providerId:
                            new ObjectId(providerId),

                        date: date,

                        status: {
                            $ne: "Cancelled"
                        }
                    })
                    .project({
                        time: 1
                    })
                    .toArray();


            const bookedTimes =
                bookings.map(
                    function(booking) {
                        return booking.time;
                    }
                );


            // ===============================
            // RESPONSE
            // ===============================

            res.json({

                success: true,

                provider: {
                    id: provider._id,
                    name: provider.name
                },

                date: date,

                day: dayName,

                isOpen: true,

                workingHours: {
                    start: daySchedule.start,
                    end: daySchedule.end
                },

                bookedTimes: bookedTimes

            });


        } catch (error) {

            console.error(
                "Public availability error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to fetch provider availability."
            });

        }

    }
);


// Public: Get all providers for customer booking
app.get("/api/public/providers", async (req, res) => {

    try {

        const providers =
            await db.collection("providers")
                .find(
                    {},
                    {
                        projection: {
                            name: 1,
                            accountType: 1,
                            area: 1,
                            category: 1,
                            profileImage: 1,
                            businessImages: 1,
                            latitude: 1,
                            longitude: 1,
                            workingHours: 1
                        }
                    }
                )
                .toArray();


        const providersWithDetails =
            await Promise.all(

                providers.map(
                    async function (provider) {

                        // ===============================
                        // GET PROVIDER REVIEWS
                        // ===============================

                        const reviews =
                            await db.collection("reviews")
                                .find(
                                    {
                                        providerId:
                                            provider._id
                                    },
                                    {
                                        projection: {
                                            rating: 1
                                        }
                                    }
                                )
                                .toArray();


                        const totalReviews =
                            reviews.length;


                        const totalStars =
                            reviews.reduce(
                                function (sum, review) {

                                    return (
                                        sum +
                                        Number(
                                            review.rating || 0
                                        )
                                    );

                                },
                                0
                            );


                        const averageRating =
                            totalReviews > 0
                                ? Number(
                                    (
                                        totalStars /
                                        totalReviews
                                    ).toFixed(1)
                                )
                                : 0;


                        // ===============================
                        // GET PROVIDER SERVICES
                        // ===============================

                        const services =
                            await db.collection("services")
                                .find(
                                    {
                                        providerId:
                                            provider._id,

                                        isActive:
                                            true
                                    },
                                    {
                                        projection: {
                                            price: 1
                                        }
                                    }
                                )
                                .toArray();


                        // ===============================
                        // CALCULATE STARTING PRICE
                        // ===============================

                        const prices =
                            services
                                .map(
                                    function (service) {

                                        return Number(
                                            service.price
                                        );

                                    }
                                )
                                .filter(
                                    function (price) {

                                        return (
                                            Number.isFinite(price) &&
                                            price > 0
                                        );

                                    }
                                );


                        const startingPrice =
                            prices.length > 0
                                ? Math.min(...prices)
                                : null;


                        // ===============================
                        // RETURN PROVIDER DATA
                        // ===============================

                        return {

                            _id:
                                provider._id,

                            name:
                                provider.name,

                            accountType:
                                provider.accountType,

                            area:
                                provider.area,

                            category:
                                provider.category,

                            profileImage:
                                provider.profileImage,

                            businessImages:
                                provider.businessImages || [],

                            latitude:
                                provider.latitude,

                            longitude:
                                provider.longitude,

                            workingHours:
                                provider.workingHours || null,

                            rating:
                                averageRating,

                            totalReviews:
                                totalReviews,

                            startingPrice:
                                startingPrice

                        };

                    }
                )

            );


        // ===============================
        // SEND RESPONSE
        // ===============================

        res.json({

            success: true,

            providers:
                providersWithDetails

        });


    } catch (error) {

        console.error(
            "Get public providers error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to fetch providers."

        });

    }

});


// ===============================
// GET SINGLE PUBLIC PROVIDER
// ===============================

app.get("/api/public/providers/:id", async (req, res) => {
    try {

        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid provider ID."
            });
        }

        const provider =
            await db.collection("providers").findOne(
                {
                    _id: new ObjectId(id)
                },
                {
                    projection: {
                        name: 1,
                        accountType: 1,
                        area: 1,
                        category: 1,
                        profileImage: 1,
                        businessImages: 1,
                        workingHours: 1,
                        latitude:1,
                    longitude:1
                    }
                }
            );

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: "Provider not found."
            });
        }

        res.json({
            success: true,
            provider
        });

    } catch (error) {

        console.error(
            "Public provider error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to load provider."
        });
    }
});

// Public: Get services of a provider
app.get("/api/public/providers/:providerId/services", async (req, res) => {
    try {
        const { providerId } = req.params;

        if (!ObjectId.isValid(providerId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid provider ID."
            });
        }

        const services = await db.collection("services")
            .find({
                providerId: new ObjectId(providerId),
                isActive: true
            })
            .sort({ createdAt: -1 })
            .toArray();

        res.json({
            success: true,
            services
        });

    } catch (error) {
        console.error("Public services error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch provider services."
        });
    }
});

// ===============================
// PROVIDER BOOKINGS
// ===============================

// Get bookings for logged-in provider
app.get(
    "/api/providers/bookings",
    authenticateProvider,
    async (req, res) => {

        try {

            const providerId = new ObjectId(
                req.provider.providerId
            );

            const bookings = await db.collection("bookings")
                .find({
                    providerId: providerId
                })
                .sort({
                    date: 1,
                    time: 1
                })
                .toArray();


            res.json({
                success: true,
                bookings: bookings
            });


        } catch (error) {

            console.error(
                "Get provider bookings error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to fetch bookings."
            });

        }

    }
);


// ===============================
// UPDATE PROVIDER BOOKING STATUS
// ===============================

app.patch(
    "/api/providers/bookings/:id/status",
    authenticateProvider,
    async (req, res) => {

        try {

            const bookingId = req.params.id;
            const { status } = req.body;

            // Check booking ID
            if (!ObjectId.isValid(bookingId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid booking ID."
                });
            }

            // Allowed statuses
            const allowedStatuses = [
                "Pending",
                "Confirmed",
                "Completed",
                "Cancelled"
            ];

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid booking status."
                });
            }

            // Update only provider's own booking
            const result =
                await db.collection("bookings").updateOne(
                    {
                        _id: new ObjectId(bookingId),

                        providerId:
                            new ObjectId(
                                req.provider.providerId
                            )
                    },
                    {
                        $set: {
                            status: status,
                            updatedAt: new Date()
                        }
                    }
                );

            if (result.matchedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Booking not found or you do not have permission."
                });
            }

            res.json({
                success: true,
                message:
                    `Booking status updated to ${status}.`
            });

        } catch (error) {

            console.error(
                "Update booking status error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to update booking status."
            });
        }
    }
);


// ===============================
// CUSTOMER REVIEWS / RATINGS
// ===============================

app.post("/api/reviews", async (req, res) => {
    try {

        const {
            receivingCode,
            phone,
            rating,
            review
        } = req.body;

        // -------------------------------
        // VALIDATION
        // -------------------------------

        if (!receivingCode || !phone || !rating) {
            return res.status(400).json({
                success: false,
                message: "Booking code, phone and rating are required."
            });
        }

        const numericRating = Number(rating);

        if (
            !Number.isInteger(numericRating) ||
            numericRating < 1 ||
            numericRating > 5
        ) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5."
            });
        }

        // -------------------------------
        // FIND BOOKING
        // -------------------------------

        const booking = await db.collection("bookings").findOne({
            receivingCode: receivingCode.trim().toUpperCase(),
            phone: phone.trim()
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        // -------------------------------
        // ONLY COMPLETED BOOKINGS
        // -------------------------------

        if (booking.status !== "Completed") {
            return res.status(400).json({
                success: false,
                message: "You can rate the provider only after the appointment is completed."
            });
        }

        // -------------------------------
        // PROVIDER BOOKING CHECK
        // -------------------------------

        if (!booking.providerId) {
            return res.status(400).json({
                success: false,
                message: "This booking cannot be reviewed."
            });
        }

        // -------------------------------
        // CHECK DUPLICATE REVIEW
        // -------------------------------

        const existingReview =
            await db.collection("reviews").findOne({
                bookingId: booking._id
            });

        if (existingReview) {
            return res.status(409).json({
                success: false,
                message: "You have already rated this booking."
            });
        }

        // -------------------------------
        // SAVE REVIEW
        // -------------------------------

        const newReview = {
            bookingId: booking._id,
            providerId: booking.providerId,

            customerName:
                booking.customerName || "Customer",

            rating: numericRating,

            review:
                typeof review === "string"
                    ? review.trim().slice(0, 500)
                    : "",

            createdAt: new Date()
        };

        const result =
            await db.collection("reviews").insertOne(newReview);

        console.log(
            "New Review Saved:",
            result.insertedId
        );

        // -------------------------------
        // RESPONSE
        // -------------------------------

        res.json({
            success: true,
            message: "Thank you! Your review has been submitted.",
            reviewId: result.insertedId
        });

    } catch (error) {

        console.error(
            "Review submission error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to submit review."
        });
    }
});



// ===============================
// GET PROVIDER REVIEWS & RATING
// ===============================

app.get("/api/public/providers/:providerId/reviews", async (req, res) => {
    try {

        const { providerId } = req.params;

        // -------------------------------
        // VALIDATE PROVIDER ID
        // -------------------------------

        if (!ObjectId.isValid(providerId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid provider ID."
            });
        }

        const providerObjectId =
            new ObjectId(providerId);

        // -------------------------------
        // CHECK PROVIDER
        // -------------------------------

        const provider =
            await db.collection("providers").findOne(
                {
                    _id: providerObjectId
                },
                {
                    projection: {
                        name: 1
                    }
                }
            );

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: "Provider not found."
            });
        }

        // -------------------------------
        // GET REVIEWS
        // -------------------------------

        const reviews =
            await db.collection("reviews")
                .find({
                    providerId: providerObjectId
                })
                .sort({
                    createdAt: -1
                })
                .toArray();

        // -------------------------------
        // CALCULATE RATING
        // -------------------------------

        const totalReviews =
            reviews.length;

        const totalStars =
            reviews.reduce(
                function (sum, item) {
                    return sum + Number(item.rating || 0);
                },
                0
            );

        const averageRating =
            totalReviews > 0
                ? Number(
                    (totalStars / totalReviews)
                        .toFixed(1)
                )
                : 0;

        // -------------------------------
        // SEND RESPONSE
        // -------------------------------

        res.json({
            success: true,

            provider: {
                id: provider._id,
                name: provider.name
            },

            averageRating,

            totalReviews,

            reviews: reviews.map(function (item) {

                return {
                    customerName:
                        item.customerName || "Customer",

                    rating:
                        Number(item.rating),

                    review:
                        item.review || "",

                    createdAt:
                        item.createdAt
                };

            })
        });

    } catch (error) {

        console.error(
            "Get provider reviews error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to load provider reviews."
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
