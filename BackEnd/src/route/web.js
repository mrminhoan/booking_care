const express = require("express")
const homeController = require("../controllers/homeController");
const userController = require("../controllers/userController");
const doctorController = require("../controllers/doctorController");
const patientController = require("../controllers/patientController");
const specialtyController = require("../controllers/specialtyController")

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage);
    router.get("/about", homeController.getAboutPage);
    router.get("/crud", homeController.getCRUD)

    router.post("/post-crud", homeController.postCRUD);
    router.get('/get-crud', homeController.displayGetCURD);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);

    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUser);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);


    router.get('/api/allcode', userController.getAllCode)
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDoctors);
    router.post('/api/save-infor-doctor', doctorController.postInfoDoctor);
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById)
    router.post('/api/save-infor-doctor', doctorController.postInfoDoctor);
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleDoctorByDate)
    router.get('/api/get-extra-doctor-by-id', doctorController.getExtraInforDoctorById)
    router.get('/api/profile-doctor-by-id', doctorController.getProfileDoctorById)

    router.post('/api/patient-book-appointment', patientController.postBookAppointment);
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment);


    router.post('/api/create-new-specialty', specialtyController.createSpecialty);

    return app.use("/", router);
}

module.exports = initWebRoutes;