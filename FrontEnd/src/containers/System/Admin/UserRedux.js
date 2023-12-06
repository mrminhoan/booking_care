import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getAllCodeService } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import { fetchGenderStart } from '../../../store/actions/adminAction';
class UserRedux extends Component {

    constructor(props) {
        super(props)
        this.state = {
            genderArr: []
        }
    }
    async componentDidMount() {
        try {
            this.props.getGender();
            // let res = await getAllCodeService("gender");
            // if (res && res.errCode === 0) {
            //     this.setState({
            //         genderArr: res.data
            //     })
            // }
        } catch (error) {
            console.log(error)
        }
    }

    componentDidUpdate(prevProps, preState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            this.setState({
                genderArr: this.props.genderRedux
            })
        }
    }
    render() {
        let genders = this.props.genderRedux;
        let language = this.props.language;
        return (
            <div className="user-redux-container">
                <div className='title'>
                    User Redux
                </div>
                <div className="user-redux-body" >
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 my-3'><FormattedMessage id={"manage-user.add"} /></div>

                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-user.email"} /></label>
                                <input className='form-control' type="email" />
                            </div>

                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-user.password"} /></label>
                                <input className='form-control' type="password" />
                            </div>

                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-user.first-name"} /></label>
                                <input className='form-control' type="text" />
                            </div>

                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-user.last-name"} /></label>
                                <input className='form-control' type="text" />
                            </div>

                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-user.phone-number"} /></label>
                                <input className='form-control' type="text" />
                            </div>

                            <div className='col-9'>
                                <label><FormattedMessage id={"manage-user.address"} /></label>
                                <input className='form-control' type="text" />
                            </div>

                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-user.gender"} /></label>
                                <select className="form-select">
                                    {
                                        this.state.genderArr && this.state.genderArr.length > 0 &&
                                        this.state.genderArr.map((gender, index) => {
                                            return (
                                                <option key={index} value={gender.id}>
                                                    {language === LANGUAGES.VI ? gender.valueVi : gender.valueEn}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>

                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-user.position"} /></label>
                                <select className="form-select">
                                    <option selected>Choose...</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                </select>
                            </div>

                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-user.role"} /></label>
                                <select className="form-select">
                                    <option selected>Choose...</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                </select>
                            </div>

                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-user.image"} /></label>
                                <input className='form-control' type="text" />
                            </div>

                            <div className="col-auto mt-3">
                                <button type="submit" className="btn btn-primary"><FormattedMessage id={"manage-user.save"} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGender: () => dispatch(fetchGenderStart())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
