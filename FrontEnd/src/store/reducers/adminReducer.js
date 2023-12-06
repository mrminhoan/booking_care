import actionTypes from '../actions/actionTypes';

const initialState = {
    genders: [],
    roles: [],
    positions: []
}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_GENDER_SUCCESS:
            let newGenders = [...state.genders];
            newGenders = action.data
            return {
                ...state,
                genders: newGenders
            }
        case actionTypes.FETCH_GENDER_FAILED:
            return {
                ...state,
            }
        default:
            return state;
    }
}

export default adminReducer;