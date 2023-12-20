import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import Select from 'react-select';

import 'react-markdown-editor-lite/lib/index.css';
import './ManageDoctor.scss';
import * as actions from "../../../store/actions";
import { CRUD_ACTION } from '../../../utils';



const mdParser = new MarkdownIt(/* Markdown-it options */);
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
            contentMarkdown: '',
            contentHTML: '',
            doctorSelected: '',
            doctorOptions: [],
            description: '',
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctors()
    }

    componentDidUpdate(prevProps, preState) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            this.setState({
                doctorOptions: this.props.allDoctors
            })
        }
    }


    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html
        })
    }

    handleChangeSelectDoctor = (e) => {
        this.setState({
            doctorSelected: e
        })
    }
    handleOnChangeDescription = (e) => {
        this.setState({
            description: e.target.value
        })
    }

    handleSaveContentMarkdown = () => {
        console.log(this.state)
        let data = {
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            doctorId: this.state.doctorSelected.value,
            description: this.state.description
        }

        this.props.saveDoctorInfor(data);
    }
    render() {
        let doctorOptions = this.state.doctorOptions;
        return (
            <div className='manage-doctor-container'>
                <div className='manage-doctor-title'>Manage Doctor</div>

                <div className='more-infor'>
                    <div className='content-left form-group'>
                        <label>Chọn bác sĩ</label>
                        <Select
                            value={this.state.doctorSelected}
                            onChange={(e) => this.handleChangeSelectDoctor(e)}
                            options={doctorOptions && doctorOptions.map(doctor => {
                                return {
                                    value: doctor.id,
                                    label: `${doctor.firstName} ${doctor.lastName}`
                                }
                            })}
                        />
                    </div>
                    <div className="content-right">
                        <label>Thông tin giới thiệu: </label>
                        <textarea
                            className='form-control'
                            row={4}
                            onChange={(e) => this.handleOnChangeDescription(e)}
                            value={this.state.description}
                        >
                            Text Area
                        </textarea>
                    </div>
                </div>

                <div className='manage-doctor-editor'>
                    <MdEditor style={{ height: '500px' }} renderHTML={text => mdParser.render(text)} onChange={this.handleEditorChange} />
                </div>
                <button
                    onClick={() => this.handleSaveContentMarkdown()}
                    className='save-content-doctor-btn'
                >
                    Lưu thông tin
                </button>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        allDoctors: state.admin.all_doctors,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctor()),
        saveDoctorInfor: (data) => dispatch(actions.saveDetailDoctor(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
