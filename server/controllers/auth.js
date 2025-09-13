import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Cart from "../models/Cart.js";

export async function register(req, res, next) {
    try {
        const { username, password } = req.body;

        if (!username?.trim()) return res.status(400).json({ message: "아이디는 공백일 수 없습니다." });
        if (!password?.trim()) return res.status(400).json({ message: "비밀번호는 10자 이상으로 작성해주세요. (백엔드)" });

        const existing = await User.findOne({ username });
        if (existing) return res.status(400).json({ message: "이미 존재하는 아이디입니다." });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashed });

        req.session.userId = user._id;
        return res.sendStatus(201);
    } catch (e) {
        next(e);
    }
}

export async function login(req, res, next) {
    try {
        const { username, password } = req.body;
        
        if (!username?.trim()) return res.status(400).json({ message: "아이디를 입력해주세요." });
        if (!password?.trim()) return res.status(400).json({ message: "비밀번호를 입력해주세요." });

        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: "계정을 찾을 수 없습니다."});

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json({ message: "비밀번호가 일치하지 않습니다."});

        req.session.userId = user._id;

        const { cartId } = req.cookies;
        if (cartId) {
            const cart = await Cart.findOne({ cartId });
            if (cart) {
                cart.userId = user._id;
                cart.expiresAt = null;
                await cart.save();
            }
        }

        return res.sendStatus(200);
    } catch (e) {
        next(e);
    }
}

export function logout(req, res, _next) {
    req.session.destroy(() => res.sendStatus(204));
}

// 세션 확인 (로그인 유지 확인용)
export function session(req, res, _next) {
    if (!req.session.userId) return res.sendStatus(204); // 로그인 아님
    return res.sendStatus(200); // 로그인 상태
}