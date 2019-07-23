import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Image, Label, Icon, Button } from 'semantic-ui-react';
import moment from 'moment';

import styles from './styles.module.scss';

const R = require('ramda');

const Post = ({
    post,
    isExpanded,
    togglePostLike,
    removePost,
    editPost,
    toggleExpandedPost,
    sharePost,
    currentUserId,
    closeModal
}) => {
    const {
        id,
        image,
        body,
        user,
        commentCount,
        createdAt,
        postReactions,
        userId
    } = post;

    const date = moment(createdAt).fromNow();

    const [likers, setLikers] = useState(false);
    const [dislikers, setDislikers] = useState(false);

    // Count likes and dislikes
    const countLikesAndDislikes = (array) => {
        const likesArray = R.pluck('isLike', array);
        return R.countBy(Boolean)(likesArray);
    };

    const {
        true: likePostCount = 0,
        false: dislikePostCount = 0
    } = countLikesAndDislikes(postReactions);

    // Show likers and dislikers
    const createLikersList = (isLike) => {
        const likersArray = postReactions.reduce((acc, next) => (next.isLike === isLike
            ? [...acc, next.user]
            : acc), []);
        return likersArray.length
            ? (
                <ul>
                    {likersArray.map(liker => <li key={liker.id}>{liker.username}</li>)}
                </ul>
            )
            : null;
    };

    const likes = likers && createLikersList(true);
    const dislikes = dislikers && createLikersList(false);

    // Create remove button
    const deletePost = () => {
        removePost(id);
        if (closeModal) closeModal();
    };

    const createEditButton = () => (currentUserId === userId
        ? (
            <button
                type="button"
                className="ui blue right floated button"
                onClick={() => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                    });
                    editPost({ body, id });
                }}
            >
            Edit
            </button>
        )
        : null);

    const editButton = !isExpanded && createEditButton();

    const createDeleteButton = () => (currentUserId === userId
        ? (<button type="submit" className="ui red right floated button" onClick={deletePost}>Delete</button>)
        : null);

    const deleteButton = createDeleteButton();

    return (
        <Card style={{ width: '100%' }}>
            {image && <Image src={image.link} wrapped ui={false} />}
            <Card.Content>
                <Card.Meta>
                    <span className="date">
                        posted by
                        {' '}
                        {user.username}
                        {' - '}
                        {date}
                    </span>
                </Card.Meta>
                <Card.Description>
                    {body}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => togglePostLike(id, true)} onMouseEnter={() => setLikers(true)} onMouseLeave={() => setLikers(false)}>
                    <Icon name="thumbs up">{likes}</Icon>
                    {likePostCount}
                </Label>
                <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => togglePostLike(id, false)} onMouseEnter={() => setDislikers(true)} onMouseLeave={() => setDislikers(false)}>
                    <Icon name="thumbs down">{dislikes}</Icon>
                    {dislikePostCount}
                </Label>
                <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => toggleExpandedPost(id)}>
                    <Icon name="comment" />
                    {commentCount}
                </Label>
                <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => sharePost(id)}>
                    <Icon name="share alternate" />
                </Label>
                <Button.Group floated="right">
                    {editButton}
                    {deleteButton}
                </Button.Group>
            </Card.Content>
        </Card>
    );
};


Post.propTypes = {
    post: PropTypes.objectOf(PropTypes.any).isRequired,
    isExpanded: PropTypes.bool,
    togglePostLike: PropTypes.func.isRequired,
    removePost: PropTypes.func.isRequired,
    editPost: PropTypes.func,
    toggleExpandedPost: PropTypes.func.isRequired,
    sharePost: PropTypes.func.isRequired,
    currentUserId: PropTypes.string.isRequired,
    closeModal: PropTypes.func
};


Post.defaultProps = {
    isExpanded: undefined,
    closeModal: undefined,
    editPost: undefined
};

export default Post;
