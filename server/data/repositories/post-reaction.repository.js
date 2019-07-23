import { PostReactionModel, PostModel, UserModel } from '../models/index';
import BaseRepository from './base.repository';

class PostReactionRepository extends BaseRepository {
    getPostReaction(userId, postId) {
        return this.model.findOne({
            group: [
                'postReaction.id',
                'post.id',
                'post->user.id'
            ],
            where: { userId, postId },
            include: [{
                model: PostModel,
                attributes: ['id', 'userId'],
                include: {
                    model: UserModel,
                    attributes: ['email']
                }
            }]
        });
    }
}

export default new PostReactionRepository(PostReactionModel);
