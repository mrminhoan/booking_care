import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Lightbox from 'react-image-lightbox';
import { LANGUAGES } from '../../../utils';
import * as actions from "../../../store/actions"
import './userRedux.scss';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import { ToastUtil } from '../../../utils';
import TableManageUser from './TableManageUser';
class UserRedux extends Component {

    constructor(props) {
        super(props)
        this.state = {
            genderArr: [],
            roleArr: [],
            positionArr: [],
            previewImgUrl: '',
            isOpenReviewImg: false,

            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            position: '',
            role: '',
            avatar: ''
        }
    }
    async componentDidMount() {
        try {
            this.props.getGender();
            this.props.getRole();
            this.props.getPosition();

        } catch (error) {
            console.log(error)
        }
    }

    componentDidUpdate(prevProps, preState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux
            this.setState({
                genderArr: this.props.genderRedux,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].key : ''
            })
        }
        if (prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux;
            this.setState({
                roleArr: this.props.roleRedux,
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].key : ''
            })
        }
        if (prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux;
            this.setState({
                positionArr: this.props.positionRedux,
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].key : ''
            })
        }

        if (prevProps.listUsers !== this.props.listUsers) {
               this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
                gender: '',
                position: 'P0',
                role: 'R1',
                avatar: ''
            })

        }
    }

    handleOnChangeImg = (e) => {
        let data = e.target.files;
        let file = data[0];
        if (file) {
            let objUrl = URL.createObjectURL(file);
            this.setState({
                previewImgUrl: objUrl,
                avatar: file
            })
        }
    }

    onOpenPreviewImage = () => {
        if (!this.state.previewImgUrl) return;
        this.setState({
            isOpenReviewImg: true
        })
    }
    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }
    checkValidateInput = () => {
        let arrCheck = ['email', 'password', 'firstName', 'lastName', 'phoneNumber', 'address'];
        let isValid = true;
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                // ToastUtil.error("Error", `Invailid field: ${arrCheck[i]}`)
                break;
            }
        }
        return isValid;
    }
    handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if (isValid === false)
            return;
        let data = {
            email: this.state.email,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phoneNumber: this.state.phoneNumber,
            address: this.state.address,
            gender: this.state.gender,
            position: this.state.position,
            role: this.state.role,
        }
        // console.log(data)
        this.props.createNewUser(data);
    }
    render() {
        let genders = this.state.genderArr;
        let positions = this.state.positionArr;
        let roles = this.state.roleArr;
        let language = this.props.language;
        let isLoadingGender = this.props.isLoadingGender;
        let isLoadingRole = this.props.isLoadingRole;
        let isLoadingPosition = this.props.isLoadingPosition;

        let { email, password, firstName, lastName, phoneNumber, address, gender, position, role, avatar } = this.state
        return (
            <div className="user-redux-container">
                <div className='title'>
                    User Redux
                </div>
                <div></div>
                <div className="user-redux-body" >
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 my-3'><FormattedMessage id={"manage-user.add"} /></div>

                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-user.email"} /></label>
                                <input
                                    className='form-control'
                                    type="email"
                                    value={email}
                                    onChange={(e) => this.onChangeInput(e, 'email')}
                                />
                            </div>

                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-user.password"} /></label>
                                <input
                                    className='form-control'
                                    type="password"
                                    value={password}
                                    onChange={(e) => this.onChangeInput(e, 'password')}
                                />
                            </div>

                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-user.first-name"} /></label>
                                <input
                                    className='form-control'
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => this.onChangeInput(e, 'firstName')}
                                />
                            </div>

                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-user.last-name"} /></label>
                                <input
                                    className='form-control'
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => this.onChangeInput(e, 'lastName')}
                                />
                            </div>

                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-user.phone-number"} /></label>
                                <input
                                    className='form-control'
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) => this.onChangeInput(e, 'phoneNumber')}
                                />
                            </div>

                            <div className='col-9'>
                                <label><FormattedMessage id={"manage-user.address"} /></label>
                                <input
                                    className='form-control'
                                    type="text"
                                    value={address}
                                    onChange={(e) => this.onChangeInput(e, 'address')}
                                />
                            </div>

                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-user.gender"} /></label>
                                <div className="d-flex align-items-center">
                                    <select
                                        className="form-select form-control"
                                        value={gender}
                                        onChange={(e) => this.onChangeInput(e, "gender")}
                                    >
                                        {
                                            genders && genders.length > 0 &&
                                            genders.map((gender, index) => {
                                                return (
                                                    <option key={index} value={gender.key}>
                                                        {language === LANGUAGES.VI ? gender.valueVi : gender.valueEn}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                    {
                                        isLoadingGender && isLoadingGender === true ?
                                            <span className="spinner-border spinner-border-sm m-3" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </span>
                                            :
                                            <></>
                                    }

                                </div>

                            </div>

                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-user.position"} /></label>
                                <div className="d-flex align-items-center">
                                    <select
                                        className="form-select form-control"
                                        value={position}
                                        onChange={(e) => this.onChangeInput(e, "position")}
                                    >
                                        {
                                            positions && positions.length > 0 &&
                                            positions.map((position, index) => {
                                                return (
                                                    <option key={index} value={position.id}>
                                                        {language === LANGUAGES.VI ? position.valueVi : position.valueEn}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                    {
                                        isLoadingPosition && isLoadingPosition === true ?
                                            <span className="spinner-border spinner-border-sm m-3" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </span>
                                            :
                                            <></>
                                    }

                                </div>
                            </div>

                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-user.role"} /></label>
                                <div className="d-flex align-items-center">
                                    <select
                                        className="form-select form-control"
                                        value={role}
                                        onChange={(e) => this.onChangeInput(e, "role")}
                                    >
                                        {
                                            roles && roles.length > 0 &&
                                            roles.map((role, index) => {
                                                return (
                                                    <option key={index} value={role.id}>
                                                        {language === LANGUAGES.VI ? role.valueVi : role.valueEn}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                    {
                                        isLoadingRole && isLoadingRole === true ?
                                            <span className="spinner-border spinner-border-sm m-3" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </span>
                                            :
                                            <></>
                                    }

                                </div>

                            </div>

                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-user.image"} /></label>
                                <div className='review-img-container'>
                                    <input
                                        id="previewImg"
                                        className='form-control'
                                        type="file"
                                        hidden
                                        onChange={(e) => this.handleOnChangeImg(e)}
                                    />
                                    <label className='label-upload' htmlFor="previewImg">Tải ảnh <i className="fas fa-upload"></i></label>
                                    <div
                                        className='preview-image'
                                        style={{ backgroundImage: `url(${this.state.previewImgUrl})` }}
                                        onClick={() => this.onOpenPreviewImage()}
                                    />
                                </div>

                            </div>

                            <div className="col-auto my-3">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    onClick={() => this.handleSaveUser()}
                                >
                                    <FormattedMessage id={"manage-user.save"} />
                                </button>
                            </div>
                            <div className='col-12 mt-3'>
                                <TableManageUser />
                            </div>
                        </div>
                    </div>
                </div>



                {
                    this.state.isOpenReviewImg === true ?
                        <Lightbox
                            mainSrc={this.state.previewImgUrl}
                            onCloseRequest={() => this.setState({ isOpenReviewImg: false })}
                        />
                        : <></>
                }

            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        roleRedux: state.admin.roles,
        positionRedux: state.admin.positions,
        isLoadingGender: state.admin.isLoadingGender,
        isLoadingPosition: state.admin.isLoadingPosition,
        isLoadingRole: state.admin.isLoadingRole,
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGender: () => dispatch(actions.fetchGenderStart()),
        getRole: () => dispatch(actions.fetchRoleStart()),
        getPosition: () => dispatch(actions.fetchPositionStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => dispatch(actions.fetchAllUserStart())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
