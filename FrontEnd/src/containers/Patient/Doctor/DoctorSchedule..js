import React, { Component } from 'react';
import { connect } from "react-redux";
import Select from 'react-select';
import moment, { lang } from 'moment';
import HomeHeader from '../../HomPage/HomeHeader';
import localization from 'moment/locale/vi';

import './DoctorSchedule.scss';
import { getDetailInforDoctor, getScheduleDoctorByDate } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
class DoctorSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDays: []
        }
    }

    componentDidMount() {
        let { language } = this.props;
        this.setArrDays(language);

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            this.setArrDays(this.props.language);
        }
    }

    setArrDays = (language) => {
        let arrDays = [];
        for (let i = 0; i < 7; i++) {
            let object = {};
            if (language === LANGUAGES.VI) {
                object.label = moment(new Date()).add(i, 'days').format('ddd - DD/MM');
            } else {
                object.label = moment(new Date()).add(i, 'days').locale('en').format('ddd - DD/MM');
            }
            object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();

            arrDays.push(object);
        }

        this.setState({
            allDays: arrDays
        })
    }
    handleOnChangeSelectDate = async (event) => {
        if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
            let doctorId = this.props.doctorIdFromParent;
            let date = event.target.value
            let res = await getScheduleDoctorByDate(doctorId, date);
            console.log(res)
        }
    }
    render() {
        let { allDays } = this.state;
        return (
            <div
                className='doctor-schedule-container'
            >
                <div className='all-schedule'>
                    <select onChange={(event) => this.handleOnChangeSelectDate(event)}>
                        {
                            allDays && allDays.length > 0 &&
                            allDays.map((day, index) => {
                                return <option key={index} value={day.value}>{day.label}</option>
                            })
                        }
                    </select>
                </div>
                <div className='all-available-time'></div>
            </div>

        );

    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
