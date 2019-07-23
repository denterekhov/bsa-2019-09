import { CommentModel, UserModel, ImageModel, CommentReactionModel } from '../models/index';
import BaseRepository from './base.repository';

class CommentRepository extends BaseRepository {
    getCommentById(id) {
        return this.model.findOne({
            group: [
                'comment.id',
                'user.id',
                'user->image.id',
                'commentReactions.id"'
            ],
            where: { id },
            include: [{
                model: UserModel,
                attributes: ['id', 'username'],
                include: {
                    model: ImageModel,
                    attributes: ['id', 'link']
                }
            }, {
                model: CommentReactionModel,
            }]
        });
    }
}

export default new CommentRepository(CommentModel);
