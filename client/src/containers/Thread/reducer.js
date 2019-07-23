import {
    SET_ALL_POSTS,
    LOAD_MORE_POSTS,
    ADD_POST,
    REMOVE_POST,
    EDIT_POST,
    EDIT_COMMENT,
    REMOVE_COMMENT,
    SET_EXPANDED_POST,
    SET_EDITING_POST,
    SET_EDITING_COMMENT,
    LOAD_DELETED_POSTS,
    REMOVE_RESTORED_POST_FROM_DELETED,
    ADD_POST_TO_DELETED
} from './actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case SET_ALL_POSTS:
            return {
                ...state,
                posts: action.posts,
                hasMorePosts: Boolean(action.posts.length)
            };
        case LOAD_MORE_POSTS:
            return {
                ...state,
                posts: [...(state.posts || []), ...action.posts],
                hasMorePosts: Boolean(action.posts.length)
            };
        case ADD_POST:
            return {
                ...state,
                posts: [action.post, ...state.posts]
            };
        case REMOVE_POST:
            return {
                ...state,
                posts: state.posts.filter(post => post.id !== action.postId)
            };
        case LOAD_DELETED_POSTS:
            return {
                ...state,
                deletedPosts: [...(state.deletedPosts || []), ...action.posts]
            };
        case ADD_POST_TO_DELETED:
            return {
                ...state,
                deletedPosts: [...(state.deletedPosts || []), action.post]
            };
        case REMOVE_RESTORED_POST_FROM_DELETED:
            return {
                ...state,
                deletedPosts: state.deletedPosts.filter(post => post.id !== action.postId)
            };
        case REMOVE_COMMENT:
            return {
                ...state,
                expandedPost: {
                    ...state.expandedPost,
                    comments: state.expandedPost.comments.filter(
                        comment => comment.id !== action.commentId
                    )
                }
            };
        case SET_EXPANDED_POST:
            return {
                ...state,
                expandedPost: action.post
            };
        case EDIT_POST:
            return {
                ...state,
                editingPost: action.post
            };
        case EDIT_COMMENT:
            return {
                ...state,
                editingComment: action.comment
            };
        case SET_EDITING_POST:
            return {
                ...state,
                editingPost: undefined
            };
        case SET_EDITING_COMMENT:
            return {
                ...state,
                editingComment: undefined
            };
        default:
            return state;
    }
};
