import callWebApi from 'src/helpers/webApiHelper';

export const getAllPosts = async (filter) => {
    const response = await callWebApi({
        endpoint: '/api/posts',
        type: 'GET',
        query: filter
    });
    return response.json();
};

export const addPost = async (request) => {
    const response = await callWebApi({
        endpoint: '/api/posts',
        type: 'POST',
        request
    });
    return response.json();
};

export const getPost = async (id) => {
    const response = await callWebApi({
        endpoint: `/api/posts/${id}`,
        type: 'GET'
    });
    return response.json();
};

export const restorePost = async (id) => {
    const response = await callWebApi({
        endpoint: `/api/posts/restore/${id}`,
        type: 'PUT'
    });
    return response.json();
};

export const togglePostLike = async (postId, isLike) => {
    const response = await callWebApi({
        endpoint: `/api/posts/react/${postId}`,
        type: 'PUT',
        request: {
            postId,
            isLike
        }
    });
    return response.json();
};

export const updatePost = async (postId, request) => {
    const response = await callWebApi({
        endpoint: `/api/posts/${postId}`,
        type: 'PUT',
        request
    });
    return response.json();
};

export const removePost = async (postId) => {
    const response = await callWebApi({
        endpoint: `/api/posts/${postId}`,
        type: 'DELETE',
    });
    return response.json();
};

export const sharePost = async (request) => {
    const response = await callWebApi({
        endpoint: '/api/posts/share',
        type: 'POST',
        request
    });
    return response.json();
};

// should be replaced by appropriate function
export const getPostByHash = async hash => getPost(hash);
