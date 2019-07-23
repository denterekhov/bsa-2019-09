import { CommentModel, CommentReactionModel } from '../models/index';

import BaseRepository from './base.repository';

export const likeCommentCase = bool => `CASE WHEN "commentReactions"."isLike" = ${bool} THEN 1 ELSE 0 END`;

class CommentReactionRepository extends BaseRepository {
    getCommentReaction(userId, commentId) {
        return this.model.findOne({
            group: [
                'commentReaction.id',
                'comment.id'
            ],
            where: { userId, commentId },
            include: [{
                model: CommentModel,
                attributes: ['id', 'userId']
            }]
        });
    }
}

export default new CommentReactionRepository(CommentReactionModel);
