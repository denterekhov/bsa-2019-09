import Sequelize from 'sequelize';
import sequelize from '../db/connection';
import { PostModel, CommentModel, UserModel, ImageModel, PostReactionModel, CommentReactionModel } from '../models/index';
import BaseRepository from './base.repository';

const Op = Sequelize.Op;

const likePostCase = bool => `CASE WHEN "postReactions"."isLike" = ${bool} THEN 1 ELSE 0 END`;

class PostRepository extends BaseRepository {
    async getPosts(filter) {
        const {
            from: offset,
            count: limit,
            userId: queryUserId,
            likes
        } = filter;

        const where = {};
        if (queryUserId && !likes) {
            Object.assign(where, { userId: { [Op.ne]: queryUserId } });
        }

        if (queryUserId && likes) {
            Object.assign(where, {
                "$postReactions.userId$": `${queryUserId}`, "$postReactions.isLike$": "true"
            });
        }

        return this.model.findAll({
            where,
            attributes: {
                include: [
                    [sequelize.literal(`
                        (SELECT COUNT(*)
                        FROM "comments" as "comment"
                        WHERE "post"."id" = "comment"."postId" AND "comment"."deletedAt" IS NULL)`), 'commentCount'],
                ]
            },
            include: [{
                model: ImageModel,
                attributes: ['id', 'link']
            }, {
                model: UserModel,
                attributes: ['id', 'username'],
                include: {
                    model: ImageModel,
                    attributes: ['id', 'link']
                }
            }, {
                model: PostReactionModel,
                attributes: ['isLike'],
                duplicating: false,
                include: {
                    model: UserModel,
                    attributes: ['id', 'username']
                }
            }],
            group: [
                'post.id',
                'image.id',
                'user.id',
                'user->image.id',
                'postReactions.id',
                'postReactions->user.id'
            ],
            order: [['createdAt', 'DESC']],
            paranoid: false,
            offset,
            limit
        });
    }

    getPostById(id) {
        return this.model.findOne({
            group: [
                'post.id',
                'comments.id',
                'comments->user.id',
                'comments->user->image.id',
                'comments->commentReactions.id',
                'comments->commentReactions->user.id',
                'user.id',
                'user->image.id',
                'image.id',
                'postReactions.id',
                'postReactions->user.id',
            ],
            where: { id },
            attributes: {
                include: [
                    [sequelize.literal(`
                        (SELECT COUNT(*)
                        FROM "comments" as "comment"
                        WHERE "post"."id" = "comment"."postId" AND "comment"."deletedAt" IS NULL)`), 'commentCount'],
                    [sequelize.fn('SUM', sequelize.literal(likePostCase(true))), 'likePostCount'],
                    [sequelize.fn('SUM', sequelize.literal(likePostCase(false))), 'dislikePostCount'],
                ]
            },
            include: [{
                model: CommentModel,
                include: [{
                    model: UserModel,
                    attributes: ['id', 'username'],
                    include: {
                        model: ImageModel,
                        attributes: ['id', 'link']
                    }
                }, {
                    model: CommentReactionModel,
                    attributes: ['isLike'],
                        include: {
                            model: UserModel,
                            attributes: ['id', 'username']
                        }
                }]
            }, {
                model: UserModel,
                attributes: ['id', 'username'],
                include: {
                    model: ImageModel,
                    attributes: ['id', 'link']
                }
            }, {
                model: ImageModel,
                attributes: ['id', 'link']
            }, {
                model: PostReactionModel,
                attributes: ['isLike'],
                include: {
                    model: UserModel,
                    attributes: ['id', 'username']
                }
            }],
            paranoid: false,
        });
    }
}

export default new PostRepository(PostModel);
