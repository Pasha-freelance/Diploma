import { ILoginDto, IRegistrationDto } from "../../interfaces/registration-dto.interface";
import User from "../../model/user.model";
import jwt from "jsonwebtoken";

const bcrypt = require("bcryptjs");

export const register = async (body: IRegistrationDto) => {
    // Get user input
    const { firstName, lastName, email, password } = body;
    let user = null;
    let message = 'User is created';
    let status = 200;

    // Validate user input
    if (!(email && password && firstName && lastName)) {
        message = "All input is required";
        status = 500;
        return { message, status, user }
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
        message = "User Already Exist. Please Login";
        status = 209;
        return { message, status, user }
    }

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    user = await User.create({
        firstName,
        lastName,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY as string,
        {
            expiresIn: "2h",
        }
    );
    // save user token
    user.token = token;

    // return new user
    return { user, status, message };
}

export const login = async (body: ILoginDto) => {
    // Get user input
    const { email, password } = body;
    let message = 'Login successfully';
    let user = null;
    let status = 200;

    // Validate user input
    if (!(email && password)) {
        message = "All input is required";
        status = 400;
        return { user, message, status };
    }
    // Validate if user exist in our database
    user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY as string,
            {
                expiresIn: "2h",
            }
        );

        // save user token
        user.token = token;

        // user
        return { user, message, status };
    }
    message = "Invalid Credentials";
    status = 401;
    return { user, message, status };
};

