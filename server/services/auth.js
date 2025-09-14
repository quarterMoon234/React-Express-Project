import bcrypt from "bcryptjs";
import User from "../models/User.js";
import AppError from "../errors/AppError.js";

export async function registerUser({ username, password }) {

    const existing = await User.findOne({ username });
    if (existing) throw new AppError(400, "이미 존재하는 아이디입니다.")

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed });

    return user;
}

export async function loginUser({ username, password }) {
    const user = await User.findOne({ username });
    if (!user) throw new AppError(401, "계정을 찾을 수 없습니다.")

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new AppError(401, "비밀번호가 일치하지 않습니다.")

    return user;
}