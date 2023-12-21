const db = require("../models/index");

let getTopDoctorHome = (limit) => {
    return new Promise(async (resole, reject) => {
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

            resole({
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
            if (!inputData ||
                !inputData.doctorId ||
                !inputData.contentHTML ||
                !inputData.contentMarkdown ||
                !inputData.action) {
                resolve({ errCode: 1, errMessage: "Missing paramters" })
            }
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
    return new Promise(async (resole, reject) => {
        try {
            if (!id) {
                resole({
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
                ],
                raw: false,
                nested: true
            })
            if (data && data.image) {
                data.image = new Buffer(data.image, 'base64').toString('binary');
            }

            if (!data) data = {};

            resole({
                errCode: 0,
                data: data
            })
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
    getDetailDoctorById
}