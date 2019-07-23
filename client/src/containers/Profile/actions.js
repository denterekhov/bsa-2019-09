import * as authService from 'src/services/authService';
import { SET_USER, SET_IS_LOADING } from './actionTypes';

const setToken = token => localStorage.setItem('token', token);

const setUser = user => async dispatch => dispatch({
    type: SET_USER,
    user
});

export const setUserProps = props => async (dispatch, getRootState) => {
    const [{ id }] = await authService.setUserProps(props);
    if (id) {
        const user = await authService.getCurrentUser();
        setUser(user)(dispatch, getRootState);
    }
};

export const resetPassword = email => async () => {
    const { body } = await authService.resetPassword(email);
    return body;
};

export const checkToken = token => async () => {
    const { body } = await authService.checkToken(token);
    return body;
};

export const setNewPassword = request => async () => {
    const { body } = await authService.setNewPassword(request);
    return body;
};

const setIsLoading = isLoading => async dispatch => dispatch({
    type: SET_IS_LOADING,
    isLoading
});

const setAuthData = (user = null, token = '') => (dispatch, getRootState) => {
    setToken(token); // token should be set first before user
    setUser(user)(dispatch, getRootState);
};

const handleAuthResponse = authResponsePromise => async (dispatch, getRootState) => {
    const { user, token } = await authResponsePromise;
    setAuthData(user, token)(dispatch, getRootState);
};

export const login = request => handleAuthResponse(authService.login(request));

export const registration = request => handleAuthResponse(authService.registration(request));

export const logout = () => setAuthData();

export const loadCurrentUser = () => async (dispatch, getRootState) => {
    setIsLoading(true)(dispatch, getRootState);
    const user = await authService.getCurrentUser();
    setUser(user)(dispatch, getRootState);
    setIsLoading(false)(dispatch, getRootState);
};
