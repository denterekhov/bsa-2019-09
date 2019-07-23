import { Router } from 'express';
import * as commentService from '../services/comment.service';

const router = Router();

router
    .get('/:id', (req, res, next) => commentService.getCommentById(req.params.id)
        .then(comment => res.send(comment))
        .catch(next))
    .post('/', (req, res, next) => commentService.create(req.user.id, req.body) // user added to the request in the jwt strategy, see passport config
        .then(comment => res.send(comment))
        .catch(next))
    .delete('/:id', (req, res, next) => commentService.removeCommentById(req.params.id) 
        .then((comment) => res.send({ comment }))
        .catch(next))
    .put('/:id', (req, res, next) => commentService.updateCommentById(req.params.id, req.body)
        .then((comment) => {
            req.io.emit('update_comment', comment); // notify all users that a comment was updated
            return res.send(comment);
        })
        .catch(next))
    .put('/react/:id', (req, res, next) => commentService.setReaction(req.user.id, req.body) // user added to the request in the jwt strategy, see passport config
        .then((reaction) => {
            if (reaction.post && (reaction.post.userId !== req.user.id)) {
                // notify a user if someone (not himself) liked his post
                req.io.to(reaction.post.userId).emit('like', 'Your post was liked!');
            }
            return res.send(reaction);
        })
        .catch(next));

export default router;
