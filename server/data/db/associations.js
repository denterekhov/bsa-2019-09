export default (models) => {
    const {
        User,
        Post,
        PostReaction,
        Comment,
        CommentReaction,
        Image
    } = models;


    Image.hasOne(User);
    Image.hasOne(Post);

    User.hasMany(Post);
    User.hasMany(Comment);
    User.hasMany(CommentReaction);
    User.hasMany(PostReaction);
    User.belongsTo(Image);

    Post.belongsTo(Image);
    Post.belongsTo(User);
    Post.hasMany(PostReaction);
    Post.hasMany(Comment);

    Comment.hasMany(CommentReaction);
    Comment.belongsTo(User);
    Comment.belongsTo(Post);

    PostReaction.belongsTo(Post);
    PostReaction.belongsTo(User);

    CommentReaction.belongsTo(Comment);
    CommentReaction.belongsTo(User);
};
