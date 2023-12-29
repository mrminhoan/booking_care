const db = require("../models/index");
require('dotenv').config();
const _ = require('lodash')
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limit,
                where: { "roleId": "R2" },
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: ["password"],
                },
                include: [
                    { model: db.Allcode, as: "positionData", attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: "genderData", attributes: ['valueEn', 'valueVi'] },
                ],
                raw: true,
                nest: true
            });

            resolve({
                errCode: 0,
                data: users
            })
        } catch (error) {
            reject(error);
        }
    })
}

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: "R2" },
                attributes: {
                    exclude: ["image", "password"]
                }
            });
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}

let saveDetailInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData
                || !inputData.doctorId
                || !inputData.contentHTML
                || !inputData.contentMarkdown
                || !inputData.action
                || !inputData.selectedPayment
                || !inputData.selectedProvince
                || !inputData.selectedPrice
                || !inputData.nameClinic
                || !inputData.addressClinic
                || !inputData.note

            ) {
                resolve({ errCode: 1, errMessage: "Missing paramters" })
            }
            // Upsert to Markdown
            if (inputData.action === "CREATE") {
                await db.Markdown.create({
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                    doctorId: inputData.doctorId
                })
            } else if (inputData.action === "EDIT") {
                let doctorMarkdown = await db.Markdown.findOne({
                    where: { doctorId: inputData.doctorId },
                    raw: false
                })
                if (doctorMarkdown) {
                    doctorMarkdown.contentHTML = inputData.contentHTML;
                    doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                    doctorMarkdown.description = inputData.description;
                    doctorMarkdown.updatedAt = new Date();
                    console.log(doctorMarkdown)
                    await doctorMarkdown.save();
                }
            }

            // Upsert to doctor_info table
            let doctorInfor = await db.Doctor_Infor.findOne({
                where: { doctorId: inputData.doctorId },
                raw: false
            })
            if (doctorInfor) {
                doctorInfor.doctorId = inputData.doctorId;
                doctorInfor.priceId = inputData.selectedPrice;
                doctorInfor.provinceId = inputData.selectedProvince;
                doctorInfor.paymentId = inputData.selectedPayment;
                doctorInfor.note = inputData.note;
                doctorInfor.nameClinic = inputData.nameClinic;
                doctorInfor.addressClinic = inputData.addressClinic;
                await doctorInfor.save();
            } else {
                await db.Doctor_Infor.create({
                    doctorId: inputData.doctorId,
                    priceId: inputData.selectedPrice,
                    provinceId: inputData.selectedProvince,
                    paymentId: inputData.selectedPayment,
                    note: inputData.note,
                    nameClinic: inputData.nameClinic,
                    addressClinic: inputData.addressClinic,
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'Save info doctor succeed'
            })
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

let getDetailDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: -1,
                    errMessage: "Missing paramters"
                })
            }

            let data = await db.User.findOne({
                where: {
                    id: id
                },
                attributes: {
                    exclude: ["password"]
                },
                include: [
                    {
                        model: db.Markdown,
                        attributes: ["description", "contentHTML", "contentMarkdown"]
                    },
                    { model: db.Allcode, as: "positionData", attributes: ['valueEn', 'valueVi'] },
                    {
                        model: db.Doctor_Infor,
                        include: [
                            { model: db.Allcode, as: "priceTypeData", attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: "provinceTypeData", attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: "paymentTypeData", attributes: ['valueEn', 'valueVi'] },
                        ]
                    },
                ],
                raw: false,
                nested: true
            })
            if (data && data.image) {
                data.image = new Buffer(data.image, 'base64').toString('binary');
            }

            if (!data) data = {};

            resolve({
                errCode: 0,
                data: data
            })
        } catch (error) {
            console.log(error);
            reject(error)
        }
    })
}

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.dateFormatted) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing required param!'
                })
            } else {
                let schedule = data.arrSchedule
                schedule = schedule.map(item => {
                    item.maxNumber = MAX_NUMBER_SCHEDULE;
                    return item;
                })

                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.dateFormatted },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                });

                // if (existing && existing.length > 0) {
                //     existing = existing.map(item => {
                //         item.date = new Date(item.date).getTime();
                //         return item;
                //     })
                // }

                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }
                resolve({
                    errCode: 0,
                    errMessage: "Success"
                });

            }
        } catch (error) {
            reject(error)
        }
    })
}
let getScheduleDoctorByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing require parameters'
                })
            } else {
                let data = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        { model: db.Allcode, as: "timeTypeData", attributes: ['valueEn', 'valueVi'] },
                    ],
                    nest: true,
                    raw: false
                })

                if (!data) data = [];

                resolve({
                    data,
                    errCode: 0,
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getExtraInforDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing required param!'
                })
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: doctorId
                    },
                    attributes: {
                        exclude: ["id", "doctorId"]
                    },
                    include: [
                        { model: db.Allcode, as: "priceTypeData", attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: "provinceTypeData", attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: "paymentTypeData", attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true
                })
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                });
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getProfileDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing required param!'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: doctorId
                    },
                    attributes: {
                        exclude: ["password"]
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ["description", "contentHTML", "contentMarkdown"]
                        },
                        { model: db.Allcode, as: "positionData", attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Infor,
                            include: [
                                { model: db.Allcode, as: "priceTypeData", attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: "provinceTypeData", attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: "paymentTypeData", attributes: ['valueEn', 'valueVi'] },
                            ]
                        },
                    ],
                    raw: false,
                    nested: true
                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            console.log(error);
            reject(error)
        }

    })
}
module.exports = {
    getTopDoctorHome,
    getAllDoctors,
    saveDetailInforDoctor,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleDoctorByDate,
    getExtraInforDoctorById,
    getProfileDoctorById
}