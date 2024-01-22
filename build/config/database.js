"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(require("@ioc:Adonis/Core/Env"));
const databaseConfig = {
    connection: Env_1.default.get('DB_CONNECTION'),
    connections: {
        pg: {
            client: 'pg',
            connection: {
                host: Env_1.default.get('PG_HOST'),
                port: Env_1.default.get('PG_PORT'),
                user: Env_1.default.get('PG_USER'),
                password: Env_1.default.get('PG_PASSWORD', ''),
                database: Env_1.default.get('PG_DB_NAME'),
            },
            migrations: {
                naturalSort: true,
            },
            healthCheck: false,
            debug: false,
        },
        cedimtech: {
            client: 'pg',
            connection: {
                host: Env_1.default.get('PG_HOST_CT'),
                port: Env_1.default.get('PG_PORT_CT'),
                user: Env_1.default.get('PG_USER_CT'),
                password: Env_1.default.get('PG_PASSWORD_CT', ''),
                database: Env_1.default.get('PG_DB_NAME_CT'),
            },
            migrations: {
                naturalSort: true,
            },
            healthCheck: false,
            debug: false,
        },
    }
};
exports.default = databaseConfig;
//# sourceMappingURL=database.js.map