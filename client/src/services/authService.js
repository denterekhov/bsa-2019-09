import callWebApi from 'src/helpers/webApiHelper';

export const login = async (request) => {
    const response = await callWebApi({
        endpoint: '/api/auth/login',
        type: 'POST',
        request,
    });
    return response.json();
};

export const registration = async (request) => {
    const response = await callWebApi({
        endpoint: '/api/auth/register',
        type: 'POST',
        request,
    });
    return response.json();
};

export const getCurrentUser = async () => {
    try {
        const response = await callWebApi({
            endpoint: '/api/auth/user',
            type: 'GET'
        });
        return response.json();
    } catch (e) {
        return null;
    }
};

export const setUserProps = async (request) => {
    try {
        const response = await callWebApi({
            endpoint: '/api/auth/update_user',
            type: 'PUT',
            request
        });
        return response.json();
    } catch (e) {
        return null;
    }
};

export const resetPassword = async (request) => {
    try {
        const response = await callWebApi({
            endpoint: '/api/auth/forgot',
            type: 'POST',
            request
        });
        return response.json();
    } catch (e) {
        return null;
    }
};

export const checkToken = async (token) => {
    try {
        const response = await callWebApi({
            endpoint: `/api/auth/reset/${token}`,
            type: 'GET'
        });
        return response.json();
    } catch (e) {
        return null;
    }
};

export const setNewPassword = async (request) => {
    try {
        const response = await callWebApi({
            endpoint: '/api/auth/new_password',
            type: 'POST',
            request
        });
        return response.json();
    } catch (e) {
        return null;
    }
};
