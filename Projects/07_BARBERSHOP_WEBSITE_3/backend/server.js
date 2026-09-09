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


            // Create new booking

            const booking = {

                providerId: providerObjectId,

                serviceId: serviceObjectId,

                service: selectedService.name,

                barber:
                    provider.name,

                date: date,

                time: time,

                customerName:
                    customerName.trim(),

                phone:
                    phone.trim(),

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
                "New Provider Booking Saved:",
                result.insertedId
            );


            return res.json({

                success: true,

                message:
                    "Appointment booked successfully!",

                bookingId:
                    result.insertedId,

                manageToken:
                    booking.manageToken

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


// Public: Get all providers for customer booking
app.get("/api/public/providers", async (req, res) => {
    try {

        const providers = await db.collection("providers")
            .find(
                {},
                {
                    projection: {
                        name: 1,
                        accountType: 1,
                        area: 1
                    }
                }
            )
            .toArray();

        res.json({
            success: true,
            providers
        });

    } catch (error) {

        console.error("Get public providers error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch providers."
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


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
