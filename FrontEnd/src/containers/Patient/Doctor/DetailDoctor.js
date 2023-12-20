import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomPage/HomeHeader';
import './DetailDoctor.scss';
import { getDetailInforDoctor } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
class DetailDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailDoctor: {}
        }
    }

    async componentDidMount() {
        if (this.props.match &&
            this.props.match.params &&
            this.props.match.params.id) {
            let id = this.props.match.params.id;
            let response = await getDetailInforDoctor(id);
            if (response && response.errCode === 0) {
                this.setState({
                    detailDoctor: response.data
                })
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    render() {
        let { language } = this.props;
        let { detailDoctor } = this.state;
        let nameVi = '', nameEn = '';
        if (detailDoctor && detailDoctor.positionData) {
            nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.firstName} ${detailDoctor.lastName} `
            nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.firstName} ${detailDoctor.lastName} `
        }
        if (detailDoctor)
            return (
                <>
                    <HomeHeader isShowBanner={false} />
                    <div className='doctor-detail-container'>
                        <div className='intro-doctor'>
                            <div
                                className='content-left'
                                style={{ backgroundImage: `url(${detailDoctor && detailDoctor.image ? detailDoctor.image : ""})` }}
                            >

                            </div>
                            <div className='content-right'>
                                <div className='up'>
                                    {
                                        language === LANGUAGES.EN ? nameEn : nameVi
                                    }
                                </div>
                                <div className='down'>
                                    {
                                        detailDoctor.Markdown && detailDoctor.Markdown.description &&
                                        <span>
                                            {detailDoctor.Markdown.description}
                                        </span>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='scheduler-doctor'></div>
                        <div className='detail-info-doctor' >
                            {detailDoctor && detailDoctor.Markdown && detailDoctor.Markdown.contentHTML
                                &&
                                <div dangerouslySetInnerHTML={{ __html: detailDoctor.Markdown.contentHTML }} />
                            }
                        </div>
                        <div className='comment-doctor'></div>
                    </div>
                </>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
