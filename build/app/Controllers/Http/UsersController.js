"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(require("@ioc:Adonis/Lucid/Database"));
const User_1 = __importDefault(require("App/Models/User"));
const UserClinica_1 = __importDefault(require("App/Models/UserClinica"));
const UserContato_1 = __importDefault(require("App/Models/UserContato"));
const UserEndereco_1 = __importDefault(require("App/Models/UserEndereco"));
const UserExaminadorRad_1 = __importDefault(require("App/Models/UserExaminadorRad"));
const UserExaminadorVet_1 = __importDefault(require("App/Models/UserExaminadorVet"));
const UserIdentificacao_1 = __importDefault(require("App/Models/UserIdentificacao"));
const UserInfo_1 = __importDefault(require("App/Models/UserInfo"));
const UserLaudador_1 = __importDefault(require("App/Models/UserLaudador"));
const UserVeterinario_1 = __importDefault(require("App/Models/UserVeterinario"));
const UserVeterinarioClinica_1 = __importDefault(require("App/Models/UserVeterinarioClinica"));
const EmailController_1 = require("./EmailController");
class UsersController {
    async index({}) {
        const users = await Database_1.default.rawQuery('SELECT u.id, u.name, u.is_adm, u.email, u.active, i.category, i.is_cuidador, i.is_veterinario, i.is_laudador, i.is_examinador_veterinario, i.is_examinador_radiologia, u.created_at, u.updated_at FROM users u, user_infos i WHERE i.user_id = u.id');
        return users.rows;
    }
    async store({ request }) {
        const body = request.only(['name', 'email', 'password', 'category', 'isCuidador', 'isVeterinario', 'isLaudador', 'isExaminadorVeterinario', 'isExaminadorRadiologia', 'is_adm']);
        const verifyEmail = await User_1.default.findBy('email', body.email);
        if (verifyEmail === null) {
            const isDonoDePet = !body.isCuidador && !body.isVeterinario && !body.isLaudador &&
                !body.isExaminadorVeterinario && !body.isExaminadorRadiologia;
            const user = await User_1.default.create({
                name: body.name,
                email: body.email,
                password: body.password,
                active: isDonoDePet,
                is_adm: body.is_adm
            });
            await UserInfo_1.default.create({
                user_id: user.id,
                category: body.category,
                is_cuidador: body.isCuidador,
                is_veterinario: body.isVeterinario,
                is_laudador: body.isLaudador,
                is_examinador_veterinario: body.isExaminadorVeterinario,
                is_examinador_radiologia: body.isExaminadorRadiologia,
            });
            return { status: 200 };
        }
        else {
            return { status: 500 };
        }
    }
    async updatepass({ auth, request }) {
        try {
            const userId = auth?.user?.id;
            const body = request.only(['password', 'newPassword']);
            const token = await auth.use('api')
                .attempt(auth.user?.email, body.password);
            if (token !== null) {
                const user = await User_1.default.findOrFail(userId);
                const nUser = user;
                nUser.password = body.newPassword;
                await user.merge(nUser).save();
                return { status: 200 };
            }
            else {
                return { status: 403 };
            }
        }
        catch {
            return { status: 500 };
        }
    }
    async resetPass({ request }) {
        try {
            const body = request.only(['email']);
            const res = await (0, EmailController_1.sendResetPassword)(body.email);
            if (res === 200) {
                return { status: 200 };
            }
            else {
                return { status: 403 };
            }
        }
        catch {
            return { status: 500 };
        }
    }
    async show({ request }) {
        const userId = request.param('id');
        const user = await User_1.default.find(userId);
        return user;
    }
    async update({ request }) {
        const userId = request.param('id');
        const body = request.only(['name', 'email', 'password', 'active', 'is_adm']);
        const user = await User_1.default.findOrFail(userId);
        await user.merge(body).save();
        return { status: 200 };
    }
    async destroy({ request }) {
        const userId = request.param('id');
        const user = await User_1.default.findOrFail(userId);
        await user.delete();
        return true;
    }
    async howiam({ auth }) {
        const userId = auth.user.id;
        const userInfo = await Database_1.default.query().from("users")
            .join('user_infos', 'users.id', '=', 'user_infos.user_id')
            .select(['users.name', 'users.email', 'user_infos.category'])
            .where('users.id', userId)
            .firstOrFail();
        return userInfo;
    }
    async activate({ request }) {
        const userId = request.param('id');
        const user = await User_1.default.findOrFail(userId);
        user.active = true;
        user.save();
        return user;
    }
    async identificacao({ auth, request }) {
        const userId = auth.user.id;
        const body = request.only(["name", 'document_type', 'document_number']);
        const user = await User_1.default.findOrFail(userId);
        await user.merge({ name: body.name }).save();
        const duplicatedCPF = await UserIdentificacao_1.default.findBy("document_number", body.document_number);
        if (duplicatedCPF !== null && duplicatedCPF?.user_id !== userId) {
            return { status: 403 };
        }
        const identificacao = await UserIdentificacao_1.default.updateOrCreate({ user_id: userId }, {
            user_id: userId,
            document_type: body.document_type,
            document_number: body.document_number
        });
        return identificacao;
    }
    async contato({ auth, request }) {
        const userId = auth.user.id;
        const body = request.only(['email', 'whatsapp', 'phone', 'phone_emergency']);
        const contato = await UserContato_1.default.updateOrCreate({ user_id: userId }, {
            user_id: userId,
            email: body.email,
            whatsapp: body.whatsapp,
            phone: body.phone,
            phone_emergency: body.phone_emergency
        });
        return contato;
    }
    async endereco({ auth, request }) {
        const userId = auth.user.id;
        const body = request.only(['country', 'cep', 'street', 'number', 'district', 'city', 'state', 'complement']);
        const endereco = await UserEndereco_1.default.updateOrCreate({ user_id: userId }, {
            user_id: userId,
            country: body.country,
            cep: body.cep,
            street: body.street,
            number: body.number,
            district: body.district,
            city: body.city,
            state: body.state,
            complement: body.complement
        });
        return endereco;
    }
    async clinica({ auth, request }) {
        const userId = auth.user.id;
        const body = request.only(['country', 'clinic', 'cnpj', 'representant', 'representant_cpf', 'crmv_state', 'crmv_number', 'header']);
        const clinica = await UserClinica_1.default.updateOrCreate({ user_id: userId }, {
            user_id: userId,
            country: body.country,
            clinic: body.clinic,
            cnpj: body.cnpj,
            representant: body.representant,
            representant_cpf: body.representant_cpf,
            crmv_state: body.crmv_state,
            crmv_number: body.crmv_number,
            header: body.header
        });
        return clinica;
    }
    async examinadorVet({ auth, request }) {
        const userId = auth.user.id;
        const body = request.only(['country', 'crmv_state', 'crmv_number', 'signature']);
        const examinadorVet = await UserExaminadorVet_1.default.updateOrCreate({ user_id: userId }, {
            user_id: userId,
            country: body.country,
            crmv_state: body.crmv_state,
            crmv_number: body.crmv_number,
            signature: body.signature
        });
        return examinadorVet;
    }
    async examinadorRad({ auth, request }) {
        const userId = auth.user.id;
        const body = request.only(['country', 'crtr_state', 'crtr_number', 'signature']);
        const examinadorRad = await UserExaminadorRad_1.default.updateOrCreate({ user_id: userId }, {
            user_id: userId,
            country: body.country,
            crtr_state: body.crtr_state,
            crtr_number: body.crtr_number,
            signature: body.signature
        });
        return examinadorRad;
    }
    async laudador({ auth, request }) {
        const userId = auth.user.id;
        const body = request.only(['country', 'crtr_state', 'crtr_number', 'signature', 'curriculum', 'specialist_title']);
        const laudador = await UserLaudador_1.default.updateOrCreate({ user_id: userId }, {
            user_id: userId,
            country: body.country,
            crtr_state: body.crtr_state,
            crtr_number: body.crtr_number,
            signature: body.signature,
            curriculum: body.curriculum,
            specialist_title: body.specialist_title
        });
        return laudador;
    }
    async veterinario({ auth, request }) {
        const userId = auth.user.id;
        const body = request.only(['country', 'autonomous', 'crmv_state', 'crmv_number', 'signature', 'clinicas']);
        const veterinario = await UserVeterinario_1.default.updateOrCreate({ user_id: userId }, {
            user_id: userId,
            country: body.country,
            crmv_state: body.crmv_state,
            crmv_number: body.crmv_number,
            signature: body.signature,
            autonomous: body.autonomous
        });
        await Database_1.default.query().from("user_veterinario_clinicas").where("veterinario_id", veterinario.id).delete();
        const clinicasWithId = body.clinicas.map(clinica => ({
            veterinario_id: veterinario.id,
            name: clinica
        }));
        await UserVeterinarioClinica_1.default.createMany(clinicasWithId);
        return veterinario;
    }
    async complemento({ auth }) {
        const userId = auth.user.id;
        const info = await UserInfo_1.default.findBy("user_id", userId);
        const identificacao = await UserIdentificacao_1.default.findBy("user_id", userId);
        const contato = await UserContato_1.default.findBy("user_id", userId);
        const endereco = await UserEndereco_1.default.findBy("user_id", userId);
        const clinica = await UserClinica_1.default.findBy("user_id", userId);
        const laudador = await UserLaudador_1.default.findBy("user_id", userId);
        const examinadorVet = await UserExaminadorVet_1.default.findBy("user_id", userId);
        const examinadorRad = await UserExaminadorRad_1.default.findBy("user_id", userId);
        const veterinario = await UserVeterinario_1.default.findBy("user_id", userId);
        const clinicas = veterinario ?
            await Database_1.default.query().from("user_veterinario_clinicas")
                .select('name')
                .where('veterinario_id', veterinario.id).exec()
            : [];
        const userName = await Database_1.default.query().from("users")
            .select('name')
            .where('id', userId).first();
        const data = {
            name: userName.name,
            info,
            identificacao,
            contato,
            endereco,
            clinica,
            laudador,
            examinadorVet,
            examinadorRad,
            veterinario: {
                info: veterinario,
                clinicas
            }
        };
        return data;
    }
    async isRegistered({ auth }) {
        const userId = auth.user.id;
        const identificacao = await UserIdentificacao_1.default.findBy("user_id", userId);
        if (!identificacao?.document_number || !identificacao?.document_type)
            return false;
        const contato = await UserContato_1.default.findBy("user_id", userId);
        if (!contato?.whatsapp)
            return false;
        const endereco = await UserEndereco_1.default.findBy("user_id", userId);
        if (!endereco?.country || !endereco?.cep || !endereco?.street || !endereco?.number || !endereco?.district || !endereco?.city || !endereco?.state)
            return false;
        const info = await UserInfo_1.default.findBy("user_id", userId);
        if (info?.category == 2) {
            const clinica = await UserClinica_1.default.findBy("user_id", userId);
            if (!clinica?.clinic || !clinica?.cnpj ||
                !clinica?.crmv_state || !clinica?.crmv_number ||
                !clinica?.country) {
                return false;
            }
        }
        if (info?.is_laudador) {
            const laudador = await UserLaudador_1.default.findBy("user_id", userId);
            if (!laudador?.signature || !laudador?.curriculum || !laudador?.country || !laudador?.crtr_state || !laudador?.crtr_number)
                return false;
        }
        if (info?.is_veterinario) {
            const veterinario = await UserVeterinario_1.default.findBy("user_id", userId);
            if (!veterinario?.signature || !veterinario?.country || !veterinario?.crmv_state || !veterinario?.crmv_number)
                return false;
        }
        if (info?.is_examinador_veterinario) {
            const examinadorVet = await UserExaminadorVet_1.default.findBy("user_id", userId);
            if (!examinadorVet?.signature || !examinadorVet?.country || !examinadorVet?.crmv_state || !examinadorVet?.crmv_number)
                return false;
        }
        if (info?.is_examinador_radiologia) {
            const examinadorRad = await UserExaminadorRad_1.default.findBy("user_id", userId);
            if (!examinadorRad?.signature || !examinadorRad?.country || !examinadorRad?.crtr_state || !examinadorRad?.crtr_number)
                return false;
        }
        return true;
    }
}
exports.default = UsersController;
//# sourceMappingURL=UsersController.js.map