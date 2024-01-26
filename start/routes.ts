import Route from '@ioc:Adonis/Core/Route'
import PaymentCCController from 'App/Controllers/Http/PaymentCCController'

Route.get('/', async () => {
  return { hello: 'api SosLaudos is running...' }
})

Route.group(() => {
  Route.post('/login', 'AuthController.login')
})

Route.post('/logout', 'AuthController.logout').middleware('auth')
Route.post('/validatetoken', 'AuthController.validateToken').middleware('auth')

Route.get('dashboard', async ({ auth }) => {
  await auth.use('api').authenticate()
  return auth.use('api').user!
}).middleware('auth')

// User Cadastro
Route.group(()=>{
  Route.post('/users', 'UsersController.store')
  Route.post('/users/resetpass', 'UsersController.resetPass')
})

// Clinicas => PRECISA MUDAR MIDDLEWARE PARA ADMIN ONLY
Route.group(() => {
  Route.get('/clinicinfo', 'ClinicInfosController.index')
  Route.post('/clinicinfo', 'ClinicInfosController.create')
  Route.get('/clinicinfo/:id', 'ClinicInfosController.show')
  Route.put('/clinicinfo/:id', 'ClinicInfosController.update')
  Route.delete('/clinicinfo/:id', 'ClinicInfosController.destroy')

  Route.get('/userclinic', 'UserClinicsController.index')
  Route.post('/userclinic', 'UserClinicsController.create')
  Route.get('/userclinic/:id', 'UserClinicsController.show')
  Route.put('/userclinic/:id', 'UserClinicsController.update')
  Route.delete('/userclinic/:id', 'UserClinicsController.destroy')
}).middleware('auth')

// User Demais
Route.group(()=>{
  Route.get('/users', 'UsersController.index')
  Route.get('/users/:id', 'UsersController.show')
  Route.put('/users/:id', 'UsersController.update')
  Route.delete('/users/:id', 'UsersController.destroy')
  Route.get('/howiam', 'UsersController.howiam')
  Route.put('/activate/:id', 'UsersController.activate')
  
  Route.post('/users/identificacao', 'UsersController.identificacao')
  Route.post('/users/contato', 'UsersController.contato')
  Route.post('/users/endereco', 'UsersController.endereco')
  Route.post('/users/clinica', 'UsersController.clinica')
  Route.post('/users/examinadorVet', 'UsersController.examinadorVet')
  Route.post('/users/examinadorRad', 'UsersController.examinadorRad')
  Route.post('/users/laudador', 'UsersController.laudador')
  Route.post('/users/veterinario', 'UsersController.veterinario')

  Route.post('/users/updatepass', 'UsersController.updatepass')

  Route.get('/complemento', 'UsersController.complemento')
  Route.get('/isRegistered', 'UsersController.isRegistered')
}).middleware('auth')

// Pets
Route.group(() => {
  Route.get('/pets', 'PetsController.index')
  Route.post('/pets', 'PetsController.create')
  Route.get('/pets/:id', 'PetsController.show')
  Route.put('/pets/:id', 'PetsController.update')
  Route.delete('/pets/:id', 'PetsController.destroy')
}).middleware('auth')

Route.get('/petsList', 'PetsController.listPets')
.middleware('auth') // => PRECISA MUDAR MIDDLEWARE PARA ADMIN ONLY

Route.get('/species/groups/:id', 'SpeciesController.getGroups') // => PÚBLICO
Route.get('/species', 'SpeciesController.index') // => PÚBLICO

// Especies => PRECISA MUDAR MIDDLEWARE PARA ADMIN ONLY
Route.group(() => {
  Route.post('/species', 'SpeciesController.create')
  Route.get('/species/:id', 'SpeciesController.show')
  Route.put('/species/:id', 'SpeciesController.update')
  Route.delete('/species/:id', 'SpeciesController.destroy')
}).middleware('auth')

// Packages
Route.group(() => {
  Route.get('/packages', 'PackagesController.index')
  Route.post('/packages', 'PackagesController.create')
  Route.get('/packages/:id', 'PackagesController.show')
  Route.put('/packages/:id', 'PackagesController.update')
  Route.delete('/packages/:id', 'PackagesController.destroy')
}).middleware('auth')


// Credits
Route.group(() => {
  Route.get('/credits', 'CreditsController.index')
  Route.post('/credits', 'CreditsController.create')
  Route.put('/credits/:id', 'CreditsController.update')
  Route.delete('/credits/:id', 'CreditsController.destroy')
  Route.post('/creditsadd', 'CreditsController.addCredits')
}).middleware('auth')


Route.group(() => {
  Route.get('/breeds', 'BreedsController.index')
  Route.post('/breeds', 'BreedsController.create')
  Route.get('/breeds/:id', 'BreedsController.show')
  Route.put('/breeds/:id', 'BreedsController.update')
  Route.delete('/breeds/:id', 'BreedsController.destroy')
}).middleware('auth')


// Regioes => PRECISA MUDAR MIDDLEWARE PARA ADMIN ONLY
Route.group(() => {
  Route.get('/regions', 'RegionsController.index')
  Route.post('/regions', 'RegionsController.create')
  Route.get('/regions/:id', 'RegionsController.show')
  Route.put('/regions/:id', 'RegionsController.update')
  Route.delete('/regions/:id', 'RegionsController.destroy')
}).middleware('auth')

// Laudos => PRECISA MUDAR MIDDLEWARE PARA ADMIN ONLY
Route.group(() => {
  Route.get('/reports', 'ReportsController.index')
  Route.post('/reports', 'ReportsController.create')
  Route.get('/reports/:id', 'ReportsController.show')
  Route.put('/reports/:id', 'ReportsController.update')
  Route.delete('/report/:id', 'ReportsController.destroy')
}).middleware('auth')

// Reports Controll
Route.group(() => {
  Route.get('/reportscontrol', 'ReportControlsController.index')
  Route.post('/reportscontrol', 'ReportControlsController.create')
  Route.get('/reportscontrol/:id', 'ReportControlsController.show')
  Route.put('/reportscontrol/:id', 'ReportControlsController.update')
  Route.delete('/reportscontrol/:id', 'ReportControlsController.destroy')
  Route.get('/report/:id', 'ReportControlsController.getReportPdf')
}).middleware('auth')

// Grupos => PRECISA MUDAR MIDDLEWARE PARA ADMIN ONLY
Route.group(() => {
  Route.get('/groups', 'GroupsController.index')
  Route.post('/groups', 'GroupsController.create')
  Route.get('/groups/:id', 'GroupsController.show')
  Route.put('/groups/:id', 'GroupsController.update')
  Route.delete('/groups/:id', 'GroupsController.destroy')
}).middleware('auth')

Route.group(()=>{
  Route.get('/payment', 'PaymentCCController.index')
  Route.post('/payment', 'PaymentCCController.create')
}).middleware('auth')

Route.group(()=>{
  Route.get('/publickey', 'PaymentCCController.pagSeguroPublicKey')
  Route.post('/publickey', 'PaymentCCController.pagSeguroPublicKey')
})

Route.group(()=>{
  Route.get('/paymentboleto', 'PaymentBoletoController.index')
  Route.post('/paymentboleto', 'PaymentBoletoController.create')
}).middleware('auth')

Route.group(()=>{
  Route.get('/paymentpix', 'PaymentPixController.index')
  Route.post('/paymentpix', 'PaymentPixController.create')
}).middleware('auth')

Route.group(()=>{
  Route.get('/paymentcheck', 'PaymentCheckController.index')
}).middleware('auth')

// ExamAttachmentFile
Route.group(()=>{
  Route.get('/attachmentfile/:id', 'ExamAttachmentFileController.index')
  Route.post('/attachmentfile', 'ExamAttachmentFileController.create')
}).middleware('auth')

// ORTHANC
Route.group(()=>{
  Route.post('/orthanc', 'OrthancCedimController.index')
  Route.post('/createexamcedimtech', 'OrthancCedimController.createExamCedimTech')
  Route.put('/updatestateexamcedimtech/:id', 'OrthancCedimController.updateExamCedimTech')
  Route.post('/orthancupload', 'OrthancCedimController.uploadDicom')
}).middleware('auth')

// AWS S3
Route.group(()=>{
  Route.post('/awss3', 'AwsS3Controller.uploadS3')
}).middleware('auth')

// Partes do corpo do pet para laudos
Route.group(()=>{
  Route.get('/bodyparts', 'ExamBodyPartsController.index')
}).middleware('auth')

// Integrador - atualizar exames
Route.group(()=>{
  Route.get('/integrator', 'IntegratorReportControlsController.index')
}).middleware('auth')

// Integrador - atualizar exames
/*
Route.group(()=>{
  Route.post('/email', 'EmailController.index')
}).middleware('auth')
*/

// CMS
Route.group(() => {
  // Route.get('/cms', 'CmsController.index')
  Route.post('/cms', 'CmsController.create')
  Route.get('/cms/:id', 'CmsController.show')
  Route.put('/cms/:id', 'CmsController.update')
  Route.delete('/cms/:id', 'CmsController.destroy')
}).middleware('auth')

Route.group(() => {  
  Route.get('/pagBankOrder', 'PaymentBoletoController.index')
  Route.post('/pagBankOrder', 'CmsController.show')  
}).middleware('auth')


Route.group(() => {
  Route.get('/cms', 'CmsController.index')
})