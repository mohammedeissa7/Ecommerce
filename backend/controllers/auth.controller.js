import User from "../models/user.model.js";

export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const newUser = await User.create({ name, email, password });
        await newUser.save();

        res.status(201).json({ user: newUser, message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const signin = async (req, res) => {
    console.log("Sign-in");
}

export const login = async (req, res) => {
    console.log("Login");
}