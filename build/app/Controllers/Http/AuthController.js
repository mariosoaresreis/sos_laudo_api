"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("App/Models/User"));
class AuthController {
    async login({ auth, request, response }) {
        const { email, password } = request.only(['email', 'password']);
        try {
            const token = await auth.use('api')
                .attempt(email, password);
            const user = await User_1.default.query()
                .where('email', email);
            return response.status(200).json({
                user: user[0],
                token: token.token
            });
        }
        catch {
            return response.status(200).json({
                message: 'Invalid credentials'
            });
        }
    }
    async validateToken({ auth, response }) {
        try {
            await auth.use('api').authenticate();
            const isValid = await auth.use('api').isLoggedIn;
            if (isValid) {
                const id = auth?.user?.id;
                const user = await User_1.default.find(id);
                return response.status(200).json({
                    isValid: isValid,
                    user: user
                });
            }
            return response.status(200).json({
                isValid: isValid
            });
        }
        catch (error) {
            return response.status(200).json({
                isValid: false
            });
        }
    }
    async logout({ auth, response }) {
        await auth.use('api').revoke();
        return response.status(200).json({
            revoked: true
        });
    }
}
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map