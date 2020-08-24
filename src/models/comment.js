const { Model, DataTypes } = require('sequelize');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const marked = require('marked');
const dompurify = createDomPurify(new JSDOM().window);

const { sequelize } = require('./index');

class CommentModel extends Model {};
CommentModel.init({
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    markedContent: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true
        }
    },
    sanitizedContent: DataTypes.TEXT,
    adminSeened: DataTypes.BOOLEAN
}, {
    sequelize,
    modelName: 'comments',
    timestamps: true,
    paranoid: false,
    hooks: {
        beforeValidate(comment) {
            comment.sanitizedContent = dompurify.sanitize(marked(comment.markedContent));
        }
    }
});

CommentModel.hasMany(CommentModel, { as: 'Replies' });

module.exports = CommentModel;