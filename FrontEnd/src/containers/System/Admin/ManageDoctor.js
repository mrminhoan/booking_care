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
            doctorOptions: [
                { value: 'chocolate', label: 'Chocolate' },
                { value: 'strawberry', label: 'Strawberry' },
                { value: 'vanilla', label: 'Vanilla' },
            ],
            description: ''

        }
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, preState) { }


    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html
        })
    }

    handleChangeSelectDoctor = (e) => {
        let value = e.value;
        this.setState({
            doctorSelected: value
        })
    }
    handleOnChangeDescription = (e) => {
        this.setState({
            description: e.target.value
        })
    }

    handleSaveContentMarkdown = () => {
        console.log(this.state)
    }
    render() {
        let arrUsers = this.state.userRedux;
        return (
            <div className='manage-doctor-container'>
                <div className='manage-doctor-title'>Manage Doctor</div>

                <div className='more-infor'>
                    <div className='content-left form-group'>
                        <label>Chọn bác sĩ</label>
                        <Select
                            value={this.state.doctorSelected}
                            onChange={(e) => this.handleChangeSelectDoctor(e)}
                            options={this.state.doctorOptions}
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
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUserRedux: () => dispatch(actions.fetchAllUserStart()),
        deleteUser: (userId) => dispatch(actions.deleteUser(userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
