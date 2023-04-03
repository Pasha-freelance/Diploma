import { ILoginDto, IRegistrationDto, IUser } from "../../interfaces/registration-dto.interface";
import User from "../../model/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export class AuthorizationService {

  public async register(body: IRegistrationDto) {
    // Get user input
    const { firstName, lastName, email, password } = body;
    let response = {} as IUser;
    let message = 'User is created';
    let status = 200;

    // Validate user input
    if (!(email && password && firstName && lastName)) {
      message = "All inputs are required";
      status = 500;
      return { message, status, response }
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      message = "User Already Exist. Please Login";
      status = 209;
      return { message, status, response }
    }

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const userDB = new User({
      firstName,
      lastName,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      userId: 'pf-' + crypto.randomUUID()
    });

    await userDB.save();

    const token = jwt.sign(
        { user_id: userDB._id, email },
        process.env.TOKEN_KEY as string,
        {
          expiresIn: "2h",
        }
      );

    response = {
      email: userDB.email,
      firstName: userDB.firstName,
      lastName: userDB.lastName,
      userId: userDB.userId,
      token
    }

    return { response, status, message };
  }

  public async login(body: ILoginDto) {
    // Get user input
    const { email, password } = body;
    let message = 'Login successfully';
    let response = {} as IUser;
    let status = 200;

    // Validate user input
    if (!(email && password)) {
      message = "All input is required";
      status = 400;
      return { response, message, status };
    }
    // Validate if user exist in our database
    const userDB = await User.findOne({ email });

    if (userDB && (await bcrypt.compare(password, userDB.password))) {
      // save user token
      const token = jwt.sign(
        { user_id: userDB._id, email },
        process.env.TOKEN_KEY as string,
        {
          expiresIn: "2h",
        }
      );

      response = {
        token,
        userId: userDB.userId,
        firstName: userDB.firstName,
        lastName: userDB.lastName,
        email: userDB.email
      }

      return { response, message, status };
    }
    message = "Invalid Credentials";
    status = 401;
    return { response, message, status };
  };
}

