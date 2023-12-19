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


module.exports = {
    getTopDoctorHome
}