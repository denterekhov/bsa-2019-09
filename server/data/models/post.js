export default (orm, DataTypes) => {
    const Post = orm.define('post', {
        body: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    }, {
        paranoid: true,
        timestamps: true
    });

    return Post;
};
