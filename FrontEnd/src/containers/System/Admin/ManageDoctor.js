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
import { getDetailInforDoctor } from '../../../services/userService';


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
            doctorSelected: '',
            doctorOptions: [],
            contentMarkdown: '',
            contentHTML: '',
            description: '',
            hasOldData: false,
            action: ''
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

    handleChangeSelectDoctor = async (e) => {
        this.setState({ doctorSelected: e });
        let response = await getDetailInforDoctor(e.value);
        if (response && response.errCode === 0 && response.data && response.data.Markdown) {
            let markdown = response.data.Markdown;
            this.setState({
                contentMarkdown: markdown.contentMarkdown,
                contentHTML: markdown.contentHTML,
                description: markdown.description,
                hasOldData: true
            })
        } else {
            this.setState({
                contentMarkdown: '',
                contentHTML: '',
                description: '',
                hasOldData: false
            })
        }
    }
    handleOnChangeDescription = (e) => {
        this.setState({
            description: e.target.value
        })
    }

    handleSaveContentMarkdown = () => {
        let { hasOldData, contentHTML, contentMarkdown, doctorSelected, description } = this.state;
        let data = {
            contentHTML: contentHTML,
            contentMarkdown: contentMarkdown,
            doctorId: doctorSelected.value,
            description: description,
            action: hasOldData === true ? CRUD_ACTION.EDIT : CRUD_ACTION.CREATE
        }

        this.props.saveDoctorInfor(data);
    }
    render() {
        let doctorOptions = this.state.doctorOptions;
        let { hasOldData } = this.state;
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
                            <span>Lưu thông tin</span>
                            : <span>Tạo thông tin</span>

                    }
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
