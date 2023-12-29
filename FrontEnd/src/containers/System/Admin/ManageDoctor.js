import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import Select from 'react-select';

import 'react-markdown-editor-lite/lib/index.css';
import './ManageDoctor.scss';
import * as actions from "../../../store/actions";
import { CRUD_ACTION, LANGUAGES } from '../../../utils';
import { getDetailInforDoctor } from '../../../services/userService';


const mdParser = new MarkdownIt(/* Markdown-it options */);

const listSelects = {
    DOCTOR_SELECT: "DOCTOR_SELECT",
    PRICE_SELECT: "PRICE_SELECT",
    PAYMENT_SELECT: "PAYMENT_SELECT",
    PROVINCE_SELECT: "PROVINCE_SELECT",
}
class ManageDoctor extends Component {

    /** Life Cycle
    * Run component:
    *1. Run constructor -> Init State
    *2. Did Mount (set State)
    *3. Render
    */

    constructor(props) {
        super(props);
        this.state = {
            doctorSelected: '',
            doctorOptions: [],
            contentMarkdown: '',
            contentHTML: '',
            description: '',
            hasOldData: false,
            action: '',

            listPrices: [],
            listPayments: [],
            listProvinces: [],
            selectedPayment: '',
            selectedProvince: '',
            selectedPrice: '',
            nameClinic: '',
            addressClinic: '',
            note: ''
        }

    }


    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.getAllRequiredDoctorInfor();
    }

    componentDidUpdate(prevProps, preState) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let doctorOptions = this.mapSelect(this.props.allDoctors, listSelects.DOCTOR_SELECT);
            this.setState({
                doctorOptions: doctorOptions
            })
        }

        if (prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor) {
            let { resPrice, resPayment, resProvince } = this.props.allRequiredDoctorInfor
            if (resPrice && resPayment && resProvince) {
                let priceOptions = this.mapSelect(resPrice, listSelects.PRICE_SELECT);
                let paymentOptions = this.mapSelect(resPayment, listSelects.PRICE_SELECT);
                let provinceOptions = this.mapSelect(resProvince, listSelects.PRICE_SELECT);
                this.setState({
                    listPayments: paymentOptions,
                    listPrices: priceOptions,
                    listProvinces: provinceOptions
                })
            }
        }

        if (prevProps.language !== this.props.language) {
            let { resPrice, resPayment, resProvince } = this.props.allRequiredDoctorInfor
            if (resPrice && resPayment && resProvince) {
                if (resPrice && resPayment && resProvince) {
                    let priceOptions = this.mapSelect(resPrice, listSelects.PRICE_SELECT);
                    let paymentOptions = this.mapSelect(resPayment, listSelects.PRICE_SELECT);
                    let provinceOptions = this.mapSelect(resProvince, listSelects.PRICE_SELECT);
                    this.setState({
                        listPayments: paymentOptions,
                        listPrices: priceOptions,
                        listProvinces: provinceOptions
                    })
                }
            }
        }
    }

    mapSelect = (inputData, fieldName) => {
        try {
            let { language } = this.props;
            let result = [];
            switch (fieldName) {
                case listSelects.DOCTOR_SELECT:
                    result = inputData ? inputData.map(item => {
                        return {
                            value: item.id,
                            label: `${item.firstName} ${item.lastName}`
                        }
                    }) : [];
                    break;
                case listSelects.PAYMENT_SELECT:
                    result = inputData ? inputData.map(item => {
                        return ({
                            value: item.keyMap,
                            label: language === LANGUAGES.VI ? item.valueVi : item.valueEn
                        })
                    }) : [];
                    break;
                case listSelects.PRICE_SELECT:
                    result = inputData ? inputData.map(item => {
                        return ({
                            value: item.keyMap,
                            label: language === LANGUAGES.VI ? item.valueVi : item.valueEn
                        })
                    }) : [];
                    break;
                case listSelects.PROVINCE_SELECT:
                    result = inputData ? inputData.map(item => {
                        return ({
                            value: item.keyMap,
                            label: language === LANGUAGES.VI ? item.valueVi : item.valueEn
                        })
                    }) : [];
                    break;
            }
            return result;
        } catch (error) {
            console.log(error)
        }
    }


    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html
        })
    }



    handleChangeSelectDoctor = async (e) => {
        this.setState({ doctorSelected: e });
        let { listPayments, listPrices, listProvinces } = this.state;
        let response = await getDetailInforDoctor(e.value);
        if (response && response.errCode === 0 && response.data && response.data.Markdown) {
            let markdown = response.data.Markdown;
            let addressClinic = '', nameClinic = '', note = '',
                paymentId = '', priceId = '', provinceId = ''

            let selectedPayment = '', selectedProvince = '', selectedPrice = ''

            if (response.data.Doctor_Infor) {
                let { Doctor_Infor } = response.data;

                addressClinic = Doctor_Infor.addressClinic;
                nameClinic = Doctor_Infor.nameClinic;
                note = Doctor_Infor.note;
                paymentId = Doctor_Infor.paymentId;
                priceId = Doctor_Infor.priceId;
                provinceId = Doctor_Infor.provinceId;

                selectedPayment = listPayments.find(item => {
                    if (item && item.value === paymentId)
                        return item
                });
                selectedProvince = listProvinces.find(item => {
                    if (item && item.value === provinceId)
                        return item
                });
                selectedPrice = listPrices.find(item => {
                    if (item && item.value === priceId)
                        return item
                })
            }

            this.setState({
                contentMarkdown: markdown.contentMarkdown,
                contentHTML: markdown.contentHTML,
                description: markdown.description,
                hasOldData: true,
                addressClinic: addressClinic,
                nameClinic: nameClinic,
                note: note,
                selectedPrice: selectedPrice,
                selectedPayment: selectedPayment,
                selectedProvince: selectedProvince
            })
        } else {
            this.setState({
                contentMarkdown: '',
                contentHTML: '',
                description: '',
                hasOldData: false,
                addressClinic: '',
                nameClinic: '',
                note: '',
            })
        }
    }

    handleChangeSelectDoctorInfo = async (selectedOption, name) => {
        let stateName = name.name;
        let stateCopy = { ...this.state };
        stateCopy[stateName] = selectedOption;
        this.setState({
            ...stateCopy
        })
    }


    handleOnChangeText = (e, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = e.target.value;
        this.setState({ ...stateCopy });
    }

    handleSaveContentMarkdown = () => {
        console.log(">>>>> State: ", this.state)
        let {
            hasOldData,
            contentHTML,
            contentMarkdown,
            doctorSelected,
            description,
            selectedPayment,
            selectedProvince,
            selectedPrice,
            nameClinic,
            addressClinic,
            note,
        } = this.state;
        let data = {
            contentHTML: contentHTML,
            contentMarkdown: contentMarkdown,
            doctorId: doctorSelected.value,
            description: description,
            action: hasOldData === true ? CRUD_ACTION.EDIT : CRUD_ACTION.CREATE,

            selectedPayment: selectedPayment.value,
            selectedProvince: selectedProvince.value,
            selectedPrice: selectedPrice.value,
            nameClinic: nameClinic,
            addressClinic: addressClinic,
            note: note

        }

        this.props.saveDoctorInfor(data);
    }
    render() {
        let { hasOldData, doctorOptions, listPrices, listPayments, listProvinces } = this.state;
        let { language } = this.props;
        return (
            <div className='manage-doctor-container'>
                <div className='manage-doctor-title'>
                    <FormattedMessage id={"admin.manage-doctor.title"} />
                </div>

                <div className='more-infor'>
                    <div className='content-left form-group'>
                        <label>
                            <FormattedMessage id={"admin.manage-doctor.select-doctor"} />
                        </label>
                        <Select
                            placeholder="Chọn bác sĩ"
                            value={this.state.doctorSelected}
                            onChange={(e) => this.handleChangeSelectDoctor(e)}
                            options={doctorOptions}
                        />
                    </div>
                    <div className="content-right">
                        <label>
                            <FormattedMessage id={"admin.manage-doctor.intro"} />
                        </label>
                        <textarea
                            className='form-control'
                            row={4}
                            onChange={(e) => this.handleOnChangeText(e, "description")}
                            value={this.state.description}
                        />
                    </div>
                </div>

                <div className='doctor-infor-extra row'>
                    <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id={"admin.manage-doctor.select-price"} />
                        </label>
                        <Select
                            placeholder={<FormattedMessage id={"admin.manage-doctor.select-price"} />}
                            value={this.state.selectedPrice}
                            name="selectedPrice"
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={listPrices}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id={"admin.manage-doctor.select-payment-method"} />
                        </label>
                        <Select
                            placeholder={<FormattedMessage id={"admin.manage-doctor.select-payment-method"} />}
                            name="selectedPayment"
                            onChange={this.handleChangeSelectDoctorInfo}
                            value={this.state.selectedPayment}
                            options={listPayments}

                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id={"admin.manage-doctor.select-province"} />
                        </label>
                        <Select
                            placeholder={<FormattedMessage id={"admin.manage-doctor.select-province"} />}
                            value={this.state.selectedProvince}
                            name="selectedProvince"
                            onChange={this.handleChangeSelectDoctorInfo} options={listProvinces}
                        />
                    </div>


                    <div className='col-4 form-group'>
                        <label><FormattedMessage id={"admin.manage-doctor.clinic-name"} /></label>
                        <input
                            className='form-control'
                            value={this.state.nameClinic}
                            onChange={(e) => this.handleOnChangeText(e, "nameClinic")}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id={"admin.manage-doctor.clinic-address"} /></label>
                        <input
                            className='form-control'
                            value={this.state.addressClinic}
                            onChange={(e) => this.handleOnChangeText(e, "addressClinic")}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id={"admin.manage-doctor.note"} /></label>
                        <input
                            className='form-control'
                            value={this.state.note}
                            onChange={(e) => this.handleOnChangeText(e, "note")}
                        />
                    </div>
                </div>

                <div className='manage-doctor-editor'>
                    <MdEditor
                        style={{ height: '500px' }}
                        renderHTML={text => mdParser.render(text)}
                        value={this.state.contentMarkdown}
                        onChange={this.handleEditorChange}
                    />
                </div>
                <button
                    onClick={() => this.handleSaveContentMarkdown()}
                    className={hasOldData === true ? 'save-content-doctor-btn' : "create-content-doctor-btn"}
                >
                    {
                        hasOldData === true ?
                            <span>
                                <FormattedMessage id={"admin.manage-doctor.save"} />
                            </span>
                            : <span>
                                <FormattedMessage id={"admin.manage-doctor.add"} />
                            </span>

                    }
                </button>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        allDoctors: state.admin.all_doctors,
        allRequiredDoctorInfor: state.admin.all_required_doctor_infor,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctor()),
        getAllRequiredDoctorInfor: () => dispatch(actions.getRequireDoctorInfor()),
        saveDoctorInfor: (data) => dispatch(actions.saveDetailDoctor(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
