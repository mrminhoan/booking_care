import actionTypes from '../actions/actionTypes';

const initialState = {
    genders: [],
    roles: [],
    positions: [],
    users: [],
    isLoadingGender: false,
    isLoadingRole: false,
    isLoadingPosition: false,
    isLoadingUser: false,


}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_START: {
            let newState = { ...state };
            newState.isLoadingGender = true;
            return {
                ...newState,
            }
        };
        case actionTypes.FETCH_GENDER_SUCCESS: {
            let newState = { ...state };
            newState.genders = action.data;
            newState.isLoadingGender = false;
            return {
                ...newState,
            }
        };
        case actionTypes.FETCH_GENDER_FAILED: {
            let newState = { ...state };
            newState.isLoadingGender = false;
            newState.genders = [];
            return {
                ...newState,
            }
        };

        case actionTypes.FETCH_ROLE_START: {
            let newState = { ...state };
            newState.isLoadingRole = true;
            return {
                ...newState,
            }
        };
        case actionTypes.FETCH_ROLE_SUCCESS: {
            let newState = { ...state };
            newState.roles = action.data;
            newState.isLoadingRole = false;
            return {
                ...newState,
            }
        };
        case actionTypes.FETCH_ROLE_FAILED: {
            let newState = { ...state };
            newState.isLoadingRole = false;
            newState.roles = [];
            return {
                ...newState,
            }
        };


        case actionTypes.FETCH_POSITION_START: {
            let newState = { ...state };
            newState.isLoadingPosition = true;
            return {
                ...newState,
            }
        };
        case actionTypes.FETCH_POSITION_SUCCESS: {
            let newState = { ...state };
            newState.positions = action.data;
            newState.isLoadingPosition = false;
            return {
                ...newState,
            }
        };
        case actionTypes.FETCH_POSITION_FAILED: {
            let newState = { ...state };
            newState.isLoadingPosition = false;
            newState.positions = [];
            return {
                ...newState,
            }
        };


        case actionTypes.FETCH_ALL_USER_START: {
            let newState = { ...state };
            newState.isLoadingUser = true;
            return {
                ...newState
            }
        };
        case actionTypes.FETCH_ALL_USER_SUCCESS: {
            let newState = { ...state };
            newState.users = action.data;
            newState.isLoadingUser = false;
            return {
                ...newState
            }
        };
        case actionTypes.FETCH_ALL_USER_FAILED: {
            let newState = { ...state };
            newState.isLoadingUser = false;
            return {
                ...newState
            }
        };

        default:
            return state;
    }
}

export default adminReducer;