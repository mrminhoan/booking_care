import specialtyService from '../services/specialtyService';
let createSpecialty = async (req, res) => {
    try {
        let response = await specialtyService.createSpecialty(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
module.exports = {
    createSpecialty
}