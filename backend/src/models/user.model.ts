import mongoose, { Document, Schema} from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    profile?: string;
    refreshToken?: string;
    isPasswordCorrect(enterPassword: string): Promise<boolean>;
    generateAccessToken():string;
    generateRefreshToken():string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
    {
        fullName: {
            type:String,
            required:true,
            trim: true,
        },
        email: {
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        password:{
            type:String,
            required:true,
            minlength:8
        },
        profile: {
            type: String,
            required: false
        },
        refreshToken: {
            type:String,
            required:false,
        },
    },
    {
        timestamps: true,
    }
)

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    try {
        this.password = await bcrypt.hash(this.password, 10);
    } catch (error:unknown) {
        if(error instanceof Error) next(error);

        next (new Error("Error occured during password hasing"));
    }
});

userSchema.methods.isPasswordCorrect = async function (
    this: IUser,
    enterPassword: string
    ):Promise<boolean> {
        try {
            const isMatch: boolean = await bcrypt.compare(enterPassword, this.password);
            return isMatch;
        } catch (error) {
            throw new Error("Error comparing passwords");
        }
}

userSchema.methods.generateAccessToken = function():string {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        {
            expiresIn: '7d'
        }
    )
};

userSchema.methods.generateRefreshToken = function(): string{
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET as string,
        {
            expiresIn: "10d"
        }
    );
}

export const User = mongoose.model<IUser>("User", userSchema);