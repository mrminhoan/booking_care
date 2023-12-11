import actionTypes from "./actionTypes";
import { getAllCodeService, createNewUserService, getAllUsers, deleteUserService, editUserService } from "../../services/userService";
import { toast } from "react-toastify";
import { FormattedMessage } from 'react-intl';

export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_GENDER_START })

            let res = await getAllCodeService("GENDER");
            if (res && res.errCode === 0) {
                dispatch(fetchGenderSuccess(res.data));
            } else {
                dispatch(fetchGenderFailed());
            }
        } catch (error) {
            dispatch(fetchGenderFailed());
            console.log("fetchGender", error)
        }
    }
}

export const fetchGenderSuccess = (gender_data) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: gender_data
})

export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
})


export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ROLE_START })

            let res = await getAllCodeService("ROLE");
            if (res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data));
            } else {
                dispatch(fetchRoleFailed());
            }
        } catch (error) {
            dispatch(fetchRoleFailed());
            console.log("fetchRole", error)
        }
    }
}

export const fetchRoleSuccess = (gender_data) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: gender_data
})

export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
})


export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_POSITION_START })

            let res = await getAllCodeService("POSITION");
            if (res && res.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data));
            } else {
                dispatch(fetchPositionFailed());
            }
        } catch (error) {
            dispatch(fetchPositionFailed());
            console.log("fetchPosition", error)
        }
    }
}

export const fetchPositionSuccess = (position_data) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: position_data
})

export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED
})

export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            // dispatch({ type: actionTypes.FETCH_GENDER_START })
            let res = await createNewUserService(data);
            if (res && res.errCode === 0) {
                toast.success(<FormattedMessage id={"notification.create-user-success"} />)
                dispatch(saveUserSuccess(res));
                dispatch(fetchAllUserStart());
            } else {
                dispatch(saveUserFailed());
            }
        } catch (error) {
            dispatch(saveUserFailed());
            console.log("CreateNewUser", error)
        }
    }
}

export const saveUserSuccess = (data) => ({
    type: actionTypes.SAVE_USER_SUCCESS,
    data: data
})

export const saveUserFailed = () => ({
    type: actionTypes.SAVE_USER_FAILED
})


export const fetchAllUserStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_USER_START })

            let res = await getAllUsers("ALL");
            if (res && res.errCode === 0) {
                dispatch(fetchAllUserSuccess(res.users));
            } else {
                dispatch(fetchGenderFailed());
            }
        } catch (error) {
            dispatch(fetchGenderFailed());
            console.log("fetchAllUSer", error)
        }
    }
}
export const fetchAllUserSuccess = (userData) => ({
    type: actionTypes.FETCH_ALL_USER_SUCCESS,
    data: userData
})

export const fetchAllUserFailed = () => ({
    type: actionTypes.FETCH_ALL_USER_FAILED
})


export const deleteUser = (userId) => {
    return async (dispatch, getState) => {
        try {
            // dispatch({ type: actionTypes.FETCH_GENDER_START })
            let res = await deleteUserService(userId);
            if (res && res.errCode === 0) {
                toast.success(<FormattedMessage id={"notification.delete-user-success"} />);
                dispatch(deleteUserSuccess(res));
                dispatch(fetchAllUserStart());
            } else {
                toast.error(<FormattedMessage id={"notification.delete-user-failed"} />);
                dispatch(saveUserFailed());
            }
        } catch (error) {
            toast.error(<FormattedMessage id={"notification.delete-user-failed"} />);
            dispatch(deleteUserFailed());
            console.log("CreateNewUser", error)
        }
    }
}

export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS
})

export const deleteUserFailed = () => ({
    type: actionTypes.DELETE_USER_FAILED
})

export const editUser = (data) => {
    return async (dispatch, getState) => {
        try {
            // dispatch({ type: actionTypes.FETCH_GENDER_START })
            let res = await editUserService(data);
            if (res && res.errCode === 0) {
                toast.success(<FormattedMessage id={"notification.edit-user-success"} />);
                dispatch(editUserSuccess(res));
                dispatch(fetchAllUserStart());
            } else {
                toast.error(<FormattedMessage id={"notification.edit-user-failed"} />);
                dispatch(editUserFailed());
            }
        } catch (error) {
            dispatch(editUserFailed());
            toast.error(<FormattedMessage id={"notification.edit-user-failed"} />);
            console.log("Edit User", error)
        }
    }
}

export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS
})

export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_FAILED
})