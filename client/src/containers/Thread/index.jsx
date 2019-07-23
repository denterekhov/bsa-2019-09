import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as imageService from 'src/services/imageService';
import ExpandedPost from 'src/containers/ExpandedPost';
import Post from 'src/components/Post';
import AddPost from 'src/components/AddPost';
import RestorePost from 'src/components/RestorePost';
import SharedPostLink from 'src/components/SharedPostLink';
import { Checkbox, Loader } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';
import { loadPosts, loadMorePosts, removePost, editPost, togglePostLike, toggleExpandedPost, addPost, updatePost, sharePost, restorePost } from './actions';

import styles from './styles.module.scss';

class Thread extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sharedPostId: undefined,
            showOtherPeoplesPosts: false,
            showPostsLikedByMe: false
        };
        this.postsFilter = {
            userId: undefined,
            from: 0,
            count: 10
        };
    }

    toggleOthersPeoplePosts = () => {
        this.setState(
            ({ showOtherPeoplesPosts }) => ({
                showPostsLikedByMe: false,
                showOtherPeoplesPosts: !showOtherPeoplesPosts
            }),
            () => {
                Object.assign(this.postsFilter, {
                    userId: this.state.showOtherPeoplesPosts ? this.props.userId : undefined,
                    from: 0,
                    likes: ''
                });
                this.props.loadPosts(this.postsFilter);
                const { from, count } = this.postsFilter;
                this.postsFilter.from = from + count;
            }
        );
    };

    togglePostsLikedByMe = () => {
        this.setState(
            ({ showPostsLikedByMe }) => ({
                showOtherPeoplesPosts: false,
                showPostsLikedByMe: !showPostsLikedByMe
            }),
            () => {
                Object.assign(this.postsFilter, {
                    userId: this.state.showPostsLikedByMe ? this.props.userId : undefined,
                    from: 0,
                    likes: this.state.showPostsLikedByMe || ''
                });
                this.props.loadPosts(this.postsFilter);
                const { from, count } = this.postsFilter;
                this.postsFilter.from = from + count;
            }
        );
    };

    loadMorePosts = () => {
        this.props.loadMorePosts(this.postsFilter);
        const { from, count } = this.postsFilter;
        this.postsFilter.from = from + count;
    }

    sharePost = (sharedPostId) => {
        this.setState({ sharedPostId });
    };

    closeSharePost = () => {
        this.setState({ sharedPostId: undefined });
    }

    uploadImage = file => imageService.uploadImage(file);

    render() {
        const { posts = [], expandedPost, hasMorePosts, ...props } = this.props;
        const { showOtherPeoplesPosts, showPostsLikedByMe, sharedPostId } = this.state;
        return (
            <div className={styles.threadContent}>
                <div className={styles.addPostForm}>
                    <AddPost
                        addPost={props.addPost}
                        uploadImage={this.uploadImage}
                        editingPost={props.editingPost}
                        updatePost={props.updatePost}
                    />
                </div>
                <RestorePost
                    deletedPosts={props.deletedPosts}
                    restorePost={props.restorePost}
                />
                <div className={styles.toolbar}>
                    <Checkbox toggle label="Show only other people's posts" checked={showOtherPeoplesPosts} onChange={this.toggleOthersPeoplePosts} />
                    <Checkbox toggle label="Show only posts liked by me" checked={showPostsLikedByMe} onChange={this.togglePostsLikedByMe} />
                </div>
                <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadMorePosts}
                    hasMore={hasMorePosts}
                    loader={<Loader active inline="centered" key={0} />}
                >
                    {posts.map(post => (
                        <Post
                            post={post}
                            expandedPost={expandedPost}
                            removePost={props.removePost}
                            toggleExpandedPost={props.toggleExpandedPost}
                            togglePostLike={props.togglePostLike}
                            sharePost={this.sharePost}
                            editPost={props.editPost}
                            currentUserId={props.userId}
                            key={post.id}
                        />
                    ))}
                </InfiniteScroll>
                {
                    expandedPost
                    && <ExpandedPost sharePost={this.sharePost} />
                }
                {
                    sharedPostId && (
                        <SharedPostLink
                            postId={sharedPostId}
                            close={this.closeSharePost}
                            sharePost={props.sharePost}
                            userName={props.userName}
                            email={props.email}
                        />
                    )
                }
            </div>
        );
    }
}

Thread.propTypes = {
    posts: PropTypes.arrayOf(PropTypes.object),
    hasMorePosts: PropTypes.bool,
    expandedPost: PropTypes.objectOf(PropTypes.any),
    sharedPostId: PropTypes.string,
    userId: PropTypes.string,
    loadPosts: PropTypes.func.isRequired,
    loadMorePosts: PropTypes.func.isRequired,
    toggleExpandedPost: PropTypes.func.isRequired,
    togglePostLike: PropTypes.func.isRequired,
    addPost: PropTypes.func.isRequired,
    removePost: PropTypes.func.isRequired,
    updatePost: PropTypes.func.isRequired,
    sharePost: PropTypes.func.isRequired
};

Thread.defaultProps = {
    posts: [],
    hasMorePosts: true,
    expandedPost: undefined,
    sharedPostId: undefined,
    userId: undefined
};

const mapStateToProps = rootState => ({
    posts: rootState.posts.posts,
    deletedPosts: rootState.posts.deletedPosts,
    hasMorePosts: rootState.posts.hasMorePosts,
    expandedPost: rootState.posts.expandedPost,
    editingPost: rootState.posts.editingPost,
    userId: rootState.profile.user.id,
    userName: rootState.profile.user.username,
    email: rootState.profile.user.email
});

const actions = {
    loadPosts,
    loadMorePosts,
    togglePostLike,
    removePost,
    editPost,
    toggleExpandedPost,
    addPost,
    updatePost,
    sharePost,
    restorePost
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Thread);
