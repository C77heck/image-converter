import { useCallback, useReducer } from 'react';

const inputReducer = (state: any, action: any): any => {
    switch (action.type) {
        case 'CHANGE':
            return {
                ...state,
                hasError: action.hasError,
                errorMessage: action.errorMessage
            };
        case 'FOCUS_CHANGE':
            return {
                ...state,
                focus: action.value,
            };
        default:
            return state;
    }
};

export const useInput = (data: any) => {
    const [state, dispatch] = useReducer(inputReducer, data);

    const handleDataChange = useCallback(({ hasError, errorMessage }) => {
        dispatch({ hasError, errorMessage, type: 'CHANGE' });
    }, []);

    const focusChange = useCallback(({ value }) => {
        dispatch({ value, type: 'FOCUS_CHANGE' });
    }, []);

    return { state, handleDataChange, focusChange };
};
