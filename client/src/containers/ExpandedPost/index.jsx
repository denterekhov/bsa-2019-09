import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Comment as CommentUI, Header } from 'semantic-ui-react';
import moment from 'moment';
import { togglePostLike, removePost, toggleExpandedPost, addComment, updateComment, removeComment, editComment, toggleCommentLike } from 'src/containers/Thread/actions';
import Post from 'src/components/Post';
import Comment from 'src/components/Comment';
import AddComment from 'src/components/AddComment';
import Spinner from 'src/components/Spinner';

class ExpandedPost extends React.Component {
    state = {
        open: true
    };

    closeModal = () => {
        this.props.toggleExpandedPost();
    }

    render() {
        const { post, sharePost, ...props } = this.props;
        return (
            <Modal dimmer="blurring" centered={false} open={this.state.open} onClose={this.closeModal}>
                {post
                    ? (
                        <Modal.Content>
                            <Post
                                post={post}
                                isExpanded
                                removePost={props.removePost}
                                togglePostLike={props.togglePostLike}
                                toggleExpandedPost={props.toggleExpandedPost}
                                sharePost={sharePost}
                                currentUserId={props.userId}
                                closeModal={this.closeModal}
                            />
                            <CommentUI.Group style={{ maxWidth: '100%' }}>
                                <Header as="h3" dividing>
                                    Comments
                                </Header>
                                {post.comments && post.comments
                                    .sort((c1, c2) => moment(c1.createdAt).diff(c2.createdAt))
                                    .map(comment => (
                                        <Comment
                                            key={comment.id}
                                            comment={comment}
                                            currentUserId={props.userId}
                                            removeComment={props.removeComment}
                                            editComment={props.editComment}
                                            updateComment={props.updateComment}
                                            toggleCommentLike={props.toggleCommentLike}
                                        />
                                    ))
                                }
                                <AddComment postId={post.id} addComment={props.addComment} updateComment={props.updateComment} editingComment={props.editingComment} />
                            </CommentUI.Group>
                        </Modal.Content>
                    )
                    : <Spinner />
                }
            </Modal>
        );
    }
}

ExpandedPost.propTypes = {
    post: PropTypes.objectOf(PropTypes.any).isRequired,
    toggleExpandedPost: PropTypes.func.isRequired,
    togglePostLike: PropTypes.func.isRequired,
    removePost: PropTypes.func.isRequired,
    addComment: PropTypes.func.isRequired,
    updateComment: PropTypes.func.isRequired,
    sharePost: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired
};

const mapStateToProps = rootState => ({
    post: rootState.posts.expandedPost,
    editingComment: rootState.posts.editingComment,
    userId: rootState.profile.user.id
});

const actions = {
    togglePostLike,
    removePost,
    toggleExpandedPost,
    addComment,
    removeComment,
    editComment,
    updateComment,
    toggleCommentLike
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ExpandedPost);
