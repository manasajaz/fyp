const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const ExistingDoctor = await Doctor.findOne({ email });
    const ExistingPatient = await Patient.findOne({ email });

    if (ExistingDoctor || ExistingPatient) {
      return res
        .status(400)
        .json({ error: "User with this email already Exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    let user;

    if (role === "doctor") {
      user = new Doctor({ name, email, password: hashedPassword });
    } else if (role === "patient") {
      user = new Patient({ name, email, password: hashedPassword });
    }

    await user.save();

    const payload = {
      id: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "12d",
    });

    res.status(201).json({ message: "User registered successfully", token });
  }
  
  catch (error) {
    res.status(400).json({ error: "Error registering user" });
    console.error("Error registering user:", error);
  }
};

const deleteUser = async (req, res) => {
  const id = req.user.id;

  try {
    const user =
      (await Patient.findByIdAndDelete(id)) ||
      (await Doctor.findByIdAndDelete(id));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User Deleted Succesfully" });
    console.log("User delete", user);
  } catch (error) {
    console.log("Error Deleting User");
    res.status(500).json({ message: "Error Deleting User" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Fetch all doctors and patients
    const doctors = await Doctor.find({}, '-password'); // Exclude password field
    const patients = await Patient.find({}, '-password'); // Exclude password field

    // Combine both doctors and patients into a single array
    const users = [
      ...doctors.map((doc) => ({ ...doc._doc, role: 'doctor' })), // Add role manually
      ...patients.map((pat) => ({ ...pat._doc, role: 'patient' })),
    ];

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
    console.error("Error fetching users:", error);
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;
  const jwtSecret =
    "22c4dda7e924bfd3d0bf9fa1ce65e35fda7b8360ea018b7e215d0a881099638d";

  try {
    console.log("Attempting to log in user with email:", email);

    // Check for user in Patient collection
    let user = await Patient.findOne({ email });
    let userType = "patient";

    // If not found, check in Doctor collection
    if (!user) {
      user = await Doctor.findOne({ email });
      userType = "doctor";
    }

    // If user still not found, return error
    if (!user) {
      console.error("User not found for email:", email);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error("Password does not match for user:", email);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: userType }, jwtSecret, {
      expiresIn: "1h",
    });
    console.log("Token generated successfully for user:", email);
    res.json({ token });
  } catch (error) {
    console.error("Server error during login:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { register, login, deleteUser, getAllUsers };
