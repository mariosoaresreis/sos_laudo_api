"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs_1 = __importDefault(require("fs"));
class OrthancController {
    async index({}) {
        try {
            const fileData = fs_1.default.readFileSync('/Users/amador/Downloads/CR000000.dcm');
            const url = 'http://54.173.85.170:8042/instances';
            const response = await (0, node_fetch_1.default)(url, {
                method: 'POST',
                body: fileData,
                headers: {
                    'Authorization': 'Basic YnJpZGdlOmJyaWRnZQ==',
                    'Content-Type': 'application/dicom',
                },
            });
            if (response.ok) {
                const responseData = await response.text();
                console.log('Resposta do servidor:', responseData);
                return (responseData);
            }
            else {
                return (response.statusText);
            }
        }
        catch (error) {
            return (error);
        }
    }
}
exports.default = OrthancController;
//# sourceMappingURL=OrthancController.js.map