const { Model, DataTypes } = require('sequelize');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const slugify = require('slugify');
const marked = require('marked');
const dompurify = createDomPurify(new JSDOM().window);

const TagModel = require('./tag');
const { sequelize } = require('./index');
const CommentModel = require('./comment');
const CategoryModel = require('./category');
const PostViewModel = require('./post-view');

class PostModel extends Model { };
PostModel.init({
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true
        }
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
    slug: {
        type: DataTypes.STRING,
        unique: true
    },
    thumbnail: {
        type: DataTypes.STRING,
        allowNull: false,
        // validate: {
        //     isUrl: true
        // }
    },
    baner: {
        type: DataTypes.STRING,
        allowNull: false,
        // validate: {
        //     isUrl: true
        // }
    },
    isPublished: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'posts',
    timestamps: true,
    paranoid: false,
    hooks: {
        beforeValidate(post) {
            post.slug = slugify(post.title, { lower: true, remove: /[`~!@#$%^&*()|+=?;:'",.<>\{\}\[\]\\\/]/gi });
            post.sanitizedContent = dompurify.sanitize(marked(post.markedContent));
        }
    }
});

// posts 1:N post_views
PostModel.hasMany(PostViewModel);
PostViewModel.belongsTo(PostModel, { constraints: true, onDelete: 'CASCADE' });
// posts 1:N comments
PostModel.hasMany(CommentModel);
CommentModel.belongsTo(PostModel, { constraints: true, onDelete: 'CASCADE' });
// posts M:N categories
PostModel.belongsToMany(CategoryModel, { through: 'post_categories', onDelete: 'CASCADE' });
CategoryModel.belongsToMany(PostModel, { through: 'post_categories', onDelete: 'CASCADE' });
// posts M:N tags
PostModel.belongsToMany(TagModel, { through: 'post_tags', onDelete: 'CASCADE' });
TagModel.belongsToMany(PostModel, { through: 'post_tags', onDelete: 'CASCADE' });

module.exports = PostModel;