import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import './TableManageUser.scss';
import * as actions from "../../../store/actions";
import { CRUD_ACTION } from '../../../utils';
class TableManageUser extends Component {

    /** Life Cycle
    * Run component:
    *1. Run constructor -> Init State
    *2. Did Mount (set State)
    *3. Render
    */
    constructor(props) {
        super(props);
        this.state = {
            userRedux: []
        }
    }

    componentDidMount() {
        this.props.fetchUserRedux();
    }

    componentDidUpdate(prevProps, preState) {
        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({
                userRedux: this.props.listUsers
            })
        }
    }

    handle_delete = (userId) => {
        this.props.deleteUser(userId);
    }
    handle_edit_user = (user) => {
        this.props.handleEditUserFromParent(user)
        console.log({ user })
    }

    render() {
        let arrUsers = this.state.userRedux;
        return (
            <table id="TableManageUser">
                <tbody>
                    <tr>
                        <th>Email</th>
                        <th>First name</th>
                        <th>Last name</th>
                        <th>Address</th>
                        <th>Action</th>

                    </tr>
                    {
                        arrUsers && arrUsers.length > 0 &&
                        arrUsers.map((user, index) => {
                            return (
                                <tr key={index}>
                                    <td>{user.email}</td>
                                    <td>{user.firstName}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.address}</td>
                                    <td>
                                        <button
                                            className='btn btn-edit'
                                            onClick={() => this.handle_edit_user(user)}
                                        >
                                            <i className="fas fa-pencil-alt"></i>
                                        </button>
                                        <button
                                            onClick={() => this.handle_delete(user.id)}
                                            className={this.props.action === CRUD_ACTION.EDIT ? 'btn btn-disable' : 'btn btn-delete'}
                                            disabled={this.props.action === CRUD_ACTION.EDIT ? true : false}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    }

                </tbody>
            </table>
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

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
