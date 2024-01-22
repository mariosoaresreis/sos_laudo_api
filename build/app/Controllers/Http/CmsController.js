"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Cms_1 = __importDefault(require("App/Models/Cms"));
class CmsController {
    async index({}) {
        const cms = await Cms_1.default.all();
        return cms;
    }
    async create({ request }) {
        const body = request.only(['reference', 'ordering', 'title', 'content']);
        await Cms_1.default.create({
            reference: body.reference,
            ordering: body.ordering,
            title: body.title,
            content: body.content
        });
        return { status: 200 };
    }
    async show({ request }) {
        const cmsId = request.param('id');
        const cms = await Cms_1.default.find(cmsId);
        return cms;
    }
    async update({ request }) {
        const cmsId = request.param('id');
        const body = request.only(['reference', 'ordering', 'title', 'content']);
        const cms = await Cms_1.default.findOrFail(cmsId);
        await cms.merge(body).save();
        return cms;
    }
    async destroy({ request }) {
        const cmsId = request.param('id');
        const cms = await Cms_1.default.findOrFail(cmsId);
        await cms.delete();
        return true;
    }
}
exports.default = CmsController;
//# sourceMappingURL=CmsController.js.map