"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(require("@ioc:Adonis/Core/Route"));
Route_1.default.get('/', async () => {
    return { hello: 'api SosLaudos is running...' };
});
Route_1.default.group(() => {
    Route_1.default.post('/login', 'AuthController.login');
});
Route_1.default.post('/logout', 'AuthController.logout').middleware('auth');
Route_1.default.post('/validatetoken', 'AuthController.validateToken').middleware('auth');
Route_1.default.get('dashboard', async ({ auth }) => {
    await auth.use('api').authenticate();
    return auth.use('api').user;
}).middleware('auth');
Route_1.default.group(() => {
    Route_1.default.post('/users', 'UsersController.store');
    Route_1.default.post('/users/resetpass', 'UsersController.resetPass');
});
Route_1.default.group(() => {
    Route_1.default.get('/clinicinfo', 'ClinicInfosController.index');
    Route_1.default.post('/clinicinfo', 'ClinicInfosController.create');
    Route_1.default.get('/clinicinfo/:id', 'ClinicInfosController.show');
    Route_1.default.put('/clinicinfo/:id', 'ClinicInfosController.update');
    Route_1.default.delete('/clinicinfo/:id', 'ClinicInfosController.destroy');
    Route_1.default.get('/userclinic', 'UserClinicsController.index');
    Route_1.default.post('/userclinic', 'UserClinicsController.create');
    Route_1.default.get('/userclinic/:id', 'UserClinicsController.show');
    Route_1.default.put('/userclinic/:id', 'UserClinicsController.update');
    Route_1.default.delete('/userclinic/:id', 'UserClinicsController.destroy');
}).middleware('auth');
Route_1.default.group(() => {
    Route_1.default.get('/users', 'UsersController.index');
    Route_1.default.get('/users/:id', 'UsersController.show');
    Route_1.default.put('/users/:id', 'UsersController.update');
    Route_1.default.delete('/users/:id', 'UsersController.destroy');
    Route_1.default.get('/howiam', 'UsersController.howiam');
    Route_1.default.put('/activate/:id', 'UsersController.activate');
    Route_1.default.post('/users/identificacao', 'UsersController.identificacao');
    Route_1.default.post('/users/contato', 'UsersController.contato');
    Route_1.default.post('/users/endereco', 'UsersController.endereco');
    Route_1.default.post('/users/clinica', 'UsersController.clinica');
    Route_1.default.post('/users/examinadorVet', 'UsersController.examinadorVet');
    Route_1.default.post('/users/examinadorRad', 'UsersController.examinadorRad');
    Route_1.default.post('/users/laudador', 'UsersController.laudador');
    Route_1.default.post('/users/veterinario', 'UsersController.veterinario');
    Route_1.default.post('/users/updatepass', 'UsersController.updatepass');
    Route_1.default.get('/complemento', 'UsersController.complemento');
    Route_1.default.get('/isRegistered', 'UsersController.isRegistered');
}).middleware('auth');
Route_1.default.group(() => {
    Route_1.default.get('/pets', 'PetsController.index');
    Route_1.default.post('/pets', 'PetsController.create');
    Route_1.default.get('/pets/:id', 'PetsController.show');
    Route_1.default.put('/pets/:id', 'PetsController.update');
    Route_1.default.delete('/pets/:id', 'PetsController.destroy');
}).middleware('auth');
Route_1.default.get('/petsList', 'PetsController.listPets')
    .middleware('auth');
Route_1.default.get('/species/groups/:id', 'SpeciesController.getGroups');
Route_1.default.get('/species', 'SpeciesController.index');
Route_1.default.group(() => {
    Route_1.default.post('/species', 'SpeciesController.create');
    Route_1.default.get('/species/:id', 'SpeciesController.show');
    Route_1.default.put('/species/:id', 'SpeciesController.update');
    Route_1.default.delete('/species/:id', 'SpeciesController.destroy');
}).middleware('auth');
Route_1.default.group(() => {
    Route_1.default.get('/packages', 'PackagesController.index');
    Route_1.default.post('/packages', 'PackagesController.create');
    Route_1.default.get('/packages/:id', 'PackagesController.show');
    Route_1.default.put('/packages/:id', 'PackagesController.update');
    Route_1.default.delete('/packages/:id', 'PackagesController.destroy');
}).middleware('auth');
Route_1.default.group(() => {
    Route_1.default.get('/credits', 'CreditsController.index');
    Route_1.default.post('/credits', 'CreditsController.create');
    Route_1.default.put('/credits/:id', 'CreditsController.update');
    Route_1.default.delete('/credits/:id', 'CreditsController.destroy');
    Route_1.default.post('/creditsadd', 'CreditsController.addCredits');
}).middleware('auth');
Route_1.default.group(() => {
    Route_1.default.get('/breeds', 'BreedsController.index');
    Route_1.default.post('/breeds', 'BreedsController.create');
    Route_1.default.get('/breeds/:id', 'BreedsController.show');
    Route_1.default.put('/breeds/:id', 'BreedsController.update');
    Route_1.default.delete('/breeds/:id', 'BreedsController.destroy');
}).middleware('auth');
Route_1.default.group(() => {
    Route_1.default.get('/regions', 'RegionsController.index');
    Route_1.default.post('/regions', 'RegionsController.create');
    Route_1.default.get('/regions/:id', 'RegionsController.show');
    Route_1.default.put('/regions/:id', 'RegionsController.update');
    Route_1.default.delete('/regions/:id', 'RegionsController.destroy');
}).middleware('auth');
Route_1.default.group(() => {
    Route_1.default.get('/reports', 'ReportsController.index');
    Route_1.default.post('/reports', 'ReportsController.create');
    Route_1.default.get('/reports/:id', 'ReportsController.show');
    Route_1.default.put('/reports/:id', 'ReportsController.update');
    Route_1.default.delete('/report/:id', 'ReportsController.destroy');
}).middleware('auth');
Route_1.default.group(() => {
    Route_1.default.get('/reportscontrol', 'ReportControlsController.index');
    Route_1.default.post('/reportscontrol', 'ReportControlsController.create');
    Route_1.default.get('/reportscontrol/:id', 'ReportControlsController.show');
    Route_1.default.put('/reportscontrol/:id', 'ReportControlsController.update');
    Route_1.default.delete('/reportscontrol/:id', 'ReportControlsController.destroy');
    Route_1.default.get('/report/:id', 'ReportControlsController.getReportPdf');
}).middleware('auth');
Route_1.default.group(() => {
    Route_1.default.get('/groups', 'GroupsController.index');
    Route_1.default.post('/groups', 'GroupsController.create');
    Route_1.default.get('/groups/:id', 'GroupsController.show');
    Route_1.default.put('/groups/:id', 'GroupsController.update');
    Route_1.default.delete('/groups/:id', 'GroupsController.destroy');
}).middleware('auth');
Route_1.default.group(() => {
    Route_1.default.get('/payment', 'PaymentCCController.index');
    Route_1.default.post('/payment', 'PaymentCCController.create');
}).middleware('auth');
Route_1.default.group(() => {
    Route_1.default.get('/paymentboleto', 'PaymentBoletoController.index');
    Route_1.default.post('/paymentboleto', 'PaymentBoletoController.create');
}).middleware('auth');
Route_1.default.group(() => {
    Route_1.default.get('/paymentpix', 'PaymentPixController.index');
    Route_1.default.post('/paymentpix', 'PaymentPixController.create');
}).middleware('auth');
Route_1.default.group(() => {
    Route_1.default.get('/paymentcheck', 'PaymentCheckController.index');
}).middleware('auth');
Route_1.default.group(() => {
    Route_1.default.get('/attachmentfile/:id', 'ExamAttachmentFileController.index');
    Route_1.default.post('/attachmentfile', 'ExamAttachmentFileController.create');
}).middleware('auth');
Route_1.default.group(() => {
    Route_1.default.post('/orthanc', 'OrthancCedimController.index');
    Route_1.default.post('/createexamcedimtech', 'OrthancCedimController.createExamCedimTech');
    Route_1.default.put('/updatestateexamcedimtech/:id', 'OrthancCedimController.updateExamCedimTech');
    Route_1.default.post('/orthancupload', 'OrthancCedimController.uploadDicom');
}).middleware('auth');
Route_1.default.group(() => {
    Route_1.default.post('/awss3', 'AwsS3Controller.uploadS3');
}).middleware('auth');
Route_1.default.group(() => {
    Route_1.default.get('/bodyparts', 'ExamBodyPartsController.index');
}).middleware('auth');
Route_1.default.group(() => {
    Route_1.default.get('/integrator', 'IntegratorReportControlsController.index');
}).middleware('auth');
Route_1.default.group(() => {
    Route_1.default.post('/cms', 'CmsController.create');
    Route_1.default.get('/cms/:id', 'CmsController.show');
    Route_1.default.put('/cms/:id', 'CmsController.update');
    Route_1.default.delete('/cms/:id', 'CmsController.destroy');
}).middleware('auth');
Route_1.default.group(() => {
    Route_1.default.get('/cms', 'CmsController.index');
});
//# sourceMappingURL=routes.js.map