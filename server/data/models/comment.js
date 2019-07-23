export default (orm, DataTypes) => {
    const Comment = orm.define('comment', {
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

    return Comment;
};
