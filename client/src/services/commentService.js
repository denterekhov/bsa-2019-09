import callWebApi from 'src/helpers/webApiHelper';

export const addComment = async (request) => {
    const response = await callWebApi({
        endpoint: '/api/comments',
        type: 'POST',
        request
    });
    return response.json();
};

export const getComment = async (id) => {
    const response = await callWebApi({
        endpoint: `/api/comments/${id}`,
        type: 'GET'
    });
    return response.json();
};

export const toggleCommentLike = async (commentId, isLike) => {
    const response = await callWebApi({
        endpoint: `/api/comments/react/${commentId}`,
        type: 'PUT',
        request: {
            commentId,
            isLike
        }
    });
    return response.json();
};

export const updateComment = async (commentId, request) => {
    const response = await callWebApi({
        endpoint: `/api/comments/${commentId}`,
        type: 'PUT',
        request
    });
    return response.json();
};

export const removeComment = async (commentId) => {
    const response = await callWebApi({
        endpoint: `/api/comments/${commentId}`,
        type: 'DELETE',
    });
    return response.json();
};
