import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Icon, Label, Comment as CommentUI } from 'semantic-ui-react';
import moment from 'moment';
import { getUserImgLink } from 'src/helpers/imageHelper';

import styles from './styles.module.scss';

const R = require('ramda');

const Comment = (props) => {
    const { comment: { body, createdAt, id, user, userId, commentReactions },
        currentUserId,
        removeComment,
        toggleCommentLike,
        editComment
    } = props;

    const date = moment(createdAt).fromNow();

    const [likers, setLikers] = useState(false);
    const [dislikers, setDislikers] = useState(false);

    // Count likes and dislikes
    const countLikesAndDislikes = (array) => {
        const likesArray = R.pluck('isLike', array);
        return R.countBy(Boolean)(likesArray);
    };

    const {
        true: likeCommentCount = 0,
        false: dislikeCommentCount = 0
    } = countLikesAndDislikes(commentReactions);

    // Show likers and dislikers
    const createLikersList = (isLike) => {
        const likersArray = commentReactions.reduce((acc, next) => (next.isLike === isLike
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

    // Create remove icon
    const createIcons = () => (currentUserId === userId
        ? (
            <>
                <Icon link name="edit" onClick={() => editComment({ body, id })} />
                <Icon link name="close" onClick={() => removeComment(id)} />
            </>
        )
        : null);

    const editAndRemoveIcons = createIcons();

    return (
        <CommentUI className={styles.comment}>
            {editAndRemoveIcons}
            <CommentUI.Avatar src={getUserImgLink(user.image)} />
            <CommentUI.Content>
                <CommentUI.Author as="a">
                    {user.username}
                </CommentUI.Author>
                <CommentUI.Metadata>
                    {date}
                </CommentUI.Metadata>
                <CommentUI.Text>
                    {body}
                </CommentUI.Text>
            </CommentUI.Content>
            <Card.Content extra>
                <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => toggleCommentLike(id, true)} onMouseEnter={() => setLikers(true)} onMouseLeave={() => setLikers(false)}>
                    <Icon name="thumbs up">{likes}</Icon>
                    {likeCommentCount}
                </Label>
                <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => toggleCommentLike(id, false)} onMouseEnter={() => setDislikers(true)} onMouseLeave={() => setDislikers(false)}>
                    <Icon name="thumbs down">{dislikes}</Icon>
                    {dislikeCommentCount}
                </Label>
            </Card.Content>
        </CommentUI>
    );
};

Comment.propTypes = {
    comment: PropTypes.objectOf(PropTypes.any).isRequired,
    currentUserId: PropTypes.string.isRequired,
    removeComment: PropTypes.func.isRequired,
    toggleCommentLike: PropTypes.func.isRequired,
    editComment: PropTypes.func.isRequired
    // dislikeComment: PropTypes.func.isRequired
};

export default Comment;
