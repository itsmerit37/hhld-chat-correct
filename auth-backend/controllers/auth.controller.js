import User from "../models/user.model.js"

const signup = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }
        
        // Create new user
        await User.create({
            username,
            password
        });

        // Return only the message
        return res.status(201).json({
            message: "User registered successfully"
        });

    } catch (error) {
        console.error("Error in signup:", error);
        return res.status(500).json({ 
            message: "Registration failed" 
        });
    }
};

export default signup;