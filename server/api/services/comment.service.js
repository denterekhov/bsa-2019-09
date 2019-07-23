import commentRepository from '../../data/repositories/comment.repository';
import commentReactionRepository from '../../data/repositories/comment-reaction.repository';

export const updateCommentById = (id, comment) => commentRepository.updateById(id, comment);

export const removeCommentById = (id) => commentRepository.deleteById(id);

export const create = (userId, comment) => commentRepository.create({
    ...comment,
    userId
});

export const getCommentById = id => commentRepository.getCommentById(id);

export const setReaction = async (userId, { commentId, isLike = true }) => {
    // define the callback for future use as a promise
    const updateOrDelete = react => {
        return react.isLike === isLike
        ? commentReactionRepository.deleteById(react.id)
        : commentReactionRepository.updateById(react.id, { isLike })};

    const reaction = await commentReactionRepository.getCommentReaction(userId, commentId);

    const result = reaction
        ? await updateOrDelete(reaction)
        : await commentReactionRepository.create({ userId, commentId, isLike });

    // the result is an integer when an entity is deleted
    return Number.isInteger(result) ? {} : commentReactionRepository.getCommentReaction(userId, commentId);
};
