const faker = require('faker');

const { baseUrl } = require('../config');
const TagModel = require('../models/tag');
const UserModel = require('../models/user');
const PostModel = require('../models/post');
const TicketModel = require('../models/ticket');
const CommentModel = require('../models/comment');
const CategoryModel = require('../models/category');
const PostViewModel = require('../models/post-view');
const UserRoleModel = require('../models/user-role');

module.exports = async () => {
    try {
        const tag1 = await TagModel.create({
            title: `${faker.name.jobDescriptor()}${Math.ceil(Math.random() * 1000)}`,
            description: faker.name.jobTitle()
        });

        const tag2 = await TagModel.create({
            title: `${faker.name.jobDescriptor()}${Math.ceil(Math.random() * 1000)}`,
            description: faker.name.jobTitle()
        });

        const tag3 = await TagModel.create({
            title: `${faker.name.jobDescriptor()}${Math.ceil(Math.random() * 1000)}`,
            description: faker.name.jobTitle()
        });

        const tag4 = await TagModel.create({
            title: `${faker.name.jobDescriptor()}${Math.ceil(Math.random() * 1000)}`,
            description: faker.name.jobTitle()
        });

        const category1 = await CategoryModel.create({
            title: 'important',
            description: `${faker.name.jobDescriptor()}${Math.ceil(Math.random() * 1000)}`
        });

        const category2 = await CategoryModel.create({
            title: `${faker.name.jobDescriptor()}${Math.ceil(Math.random() * 1000)}`,
            description: faker.name.jobTitle()
        });

        const category3 = await CategoryModel.create({
            title: `${faker.name.jobDescriptor()}${Math.ceil(Math.random() * 1000)}`,
            description: faker.name.jobTitle()
        });

        const category4 = await CategoryModel.create({
            title: `${faker.name.jobDescriptor()}${Math.ceil(Math.random() * 1000)}`,
            description: faker.name.jobTitle()
        });

        const adminRole = await UserRoleModel.create({
            title: 'ادمین',
            accessLevel: 4
        });

        const userRole = await UserRoleModel.create({
            title: 'کاربر',
            accessLevel: 1
        });

        const adminUser1 = await UserModel.create({
            fullname: faker.name.findName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            avatar: `${baseUrl}/img/avatars/sample.jpg`,
            userRoleId: adminRole.id,
            emailVerified: true,
            password: '123456zxc'
        });

        const adminUser2 = await UserModel.create({
            fullname: faker.name.findName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            avatar: `${baseUrl}/img/avatars/sample.jpg`,
            userRoleId: adminRole.id,
            emailVerified: true,
            password: '123456zxc'
        });

        const adminUser3 = await UserModel.create({
            fullname: faker.name.findName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            avatar: `${baseUrl}/img/avatars/sample.jpg`,
            userRoleId: adminRole.id,
            emailVerified: true,
            password: '123456zxc'
        });

        const simpleUser = await UserModel.create({
            fullname: faker.name.findName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            avatar: `${baseUrl}/img/avatars/sample.jpg`,
            userRoleId: userRole.id,
            emailVerified: true,
            password: '123456zxc'
        });

        let post1;
        for (let i = 0; i < 5; i++) {
            post1 = await PostModel.create({
                title: `${faker.lorem.words(6)} ${i}`,
                markedContent: faker.lorem.paragraphs(4),
                description: faker.lorem.lines(2),
                thumbnail: `${baseUrl}/img/thumbnails/sample.jpg`,
                baner: `${baseUrl}/img/baners/sample.jpeg`,
                userId: adminUser1.id,
                createdAt: new Date() - 100000,
                isPublished: true
            });
            tag1.addPost(post1);
            tag2.addPost(post1);
            category1.addPost(post1);
            category2.addPost(post1);
            await CommentModel.create({
                markedContent: faker.lorem.paragraph(3),
                adminSeened: i % 2 === 0 ? true : false,
                userId: adminUser1.id,
                postId: post1.id
            });
            await PostViewModel.create({
                userIp: faker.internet.ip(),
                systemInfo: faker.internet.userAgent(),
                postId: post1.id
            });
        };

        let post2;
        for (let i = 0; i < 5; i++) {
            post2 = await PostModel.create({
                title: `${faker.lorem.words(6)} ${i}`,
                markedContent: faker.lorem.paragraphs(4),
                description: faker.lorem.lines(2),
                thumbnail: `${baseUrl}/img/thumbnails/sample.jpg`,
                baner: `${baseUrl}/img/baners/sample.jpeg`,
                userId: adminUser2.id,
                createdAt: new Date() - 10000000,
                isPublished: true
            });
            tag3.addPost(post2);
            tag2.addPost(post2);
            category1.addPost(post2);
            category3.addPost(post2);
            await CommentModel.create({
                markedContent: faker.lorem.paragraph(3),
                adminSeened: i % 2 === 0 ? true : false,
                userId: adminUser2.id,
                postId: post2.id
            });
            await PostViewModel.create({
                userIp: faker.internet.ip(),
                systemInfo: faker.internet.userAgent(),
                userId: adminUser1.id,
                postId: post2.id
            });
        };

        let post3;
        for (let i = 0; i < 5; i++) {
            post3 = await PostModel.create({
                title: `${faker.lorem.words(6)} ${i}`,
                markedContent: faker.lorem.paragraphs(4),
                description: faker.lorem.lines(2),
                thumbnail: `${baseUrl}/img/thumbnails/sample.jpg`,
                baner: `${baseUrl}/img/baners/sample.jpeg`,
                userId: adminUser2.id,
                createdAt: new Date() - 1000000000,
                isPublished: true
            });
            tag3.addPost(post3);
            tag4.addPost(post3);
            category1.addPost(post3);
            category4.addPost(post3);
            await CommentModel.create({
                markedContent: faker.lorem.paragraph(3),
                adminSeened: i % 2 === 0 ? true : false,
                userId: adminUser3.id,
                postId: post3.id
            });
            await PostViewModel.create({
                userIp: faker.internet.ip(),
                systemInfo: faker.internet.userAgent(),
                postId: post3.id
            });
        };

        let post4;
        for (let i = 0; i < 5; i++) {
            post4 = await PostModel.create({
                title: `${faker.lorem.words(6)} ${i}`,
                markedContent: faker.lorem.paragraphs(4),
                description: faker.lorem.lines(2),
                thumbnail: `${baseUrl}/img/thumbnails/sample.jpg`,
                baner: `${baseUrl}/img/baners/sample.jpeg`,
                userId: adminUser2.id,
                createdAt: new Date() - 100000000000,
                isPublished: true
            });
            tag1.addPost(post4);
            tag4.addPost(post4);
            category4.addPost(post4);
            await CommentModel.create({
                markedContent: faker.lorem.paragraph(3),
                adminSeened: i % 2 === 0 ? true : false,
                userId: simpleUser.id,
                postId: post4.id
            });
            await PostViewModel.create({
                userIp: faker.internet.ip(),
                systemInfo: faker.internet.userAgent(),
                userId: simpleUser.id,
                postId: post4.id
            });
        };

        for (let i = 0; i < 4; i++) {
            await TicketModel.create({
                fullname: faker.name.firstName(),
                email: faker.internet.email(),
                subject: faker.lorem.words(6),
                message: faker.lorem.sentences(6),
            });
        };
    } catch (error) { console.error(error) };
};
