
const express = require('express');
const dotenv = require('dotenv');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const corsConfig = {
    origin: "*", 
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE"] 
};
app.use(cors(corsConfig))
const bcrypt = require('bcrypt');
const UserModel = require('./model/UsersModel'); 
const path = require('path');
const multer = require('multer')
const jwt = require('jsonwebtoken');
const PostModel = require('./model/PostModel');
const CommentModel = require('./model/CommentModel');
const LikePostModel = require('./model/LikePostModel');

const port = process.env.PORT || 8000;
dotenv.config()

app.use(express.json());


// const uri = "mongodb://localhost:27017/app-instagram";
const uri = "mongodb+srv://admin:admin@ayoub.kz4ucnr.mongodb.net/?retryWrites=true&w=majority&appName=ayoub"
const JWT_SECRET = 'AYOUBIBIDARNE345';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-images`);
    }
});

// Storage configuration for video uploads
const storageVideo = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'posts/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-reels`);
    }
});

const upload = multer({ storage: storage });
const uploadVideo = multer({ storage: storageVideo });


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/posts', express.static(path.join(__dirname, 'posts')));

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection error:', err));


app.get('/', (req, res) => {
    res.send('Hello world');
});

app.post('/api/signup', upload.single('avatar'), async (req, res) => {
    const { username, email, name, password, gender } = req.body;
    const avatar = req.file;

    const errors = {};

    if (!username) errors.username = 'Username is required.';
    if (!email) errors.email = 'Email is required.';
    if (!password) errors.password = 'Password is required.';
    if (!name) errors.name = 'Name is required.';
    if (!gender) errors.gender = 'Gender is required.';

    if (Object.keys(errors).length > 0) {
        return res.status(422).json({ errors });
    }

    try {
        const existingUser = await UserModel.findOne({ email: email });
        if (existingUser) {
            return res.status(404).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            name,
            role: "user",
            gender,
            bio: "🥳🥳 Bio 🥳🥳",
            image: avatar ? avatar.filename : "logoprofile.png",
            followers: [],
            following: []
        });
        await newUser.save();

        res.status(200).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/edit/profile/:id', upload.single('avatar'), async (req, res) => {
    const { name, username, email, bio, gender } = req.body;
    const avatar = req.file;
    const { id } = req.params;

    const errors = {};
    if (!name) errors.name = 'Name is required.';
    if (!username) errors.username = 'Username is required.';
    if (!email) errors.email = 'Email is required.';
    if (!bio) errors.bio = 'Bio is required.';
    if (!gender) errors.gender = 'Gender is required.';

    if (Object.keys(errors).length > 0) {
        return res.status(422).json({ errors });
    }

    try {
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (email !== user.email) {
            const existingUser = await UserModel.findOne({ email: email });
            if (existingUser) {
                return res.status(404).json({ message: 'Email is already in use by another user' });
            }
        }

        user.name = name || user.name;
        user.username = username || user.username;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.gender = gender || user.gender;
        user.image = avatar ? avatar.filename : user.image;
        user.followers = user.followers
        user.following = user.following

        await user.save();
        const users = await UserModel.find()

        res.status(200).json({ message: 'Profile updated successfully', user: user, users: users });
    } catch (error) {
        console.error('Error during profile update:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.put('/api/change/password/:userid', async (req, res) => {
    try {
        const { new_password, confirm_password } = req.body
        const userId = req.params.userid;
        const errors = {};
        if (!new_password) errors.new_password = 'New Password is required.';
        if (!confirm_password) errors.confirm_password = 'Confirm Password is required.';
        if (Object.keys(errors).length > 0) {
            return res.status(422).json({ errors });
        }
        if (userId) {
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(new_password, salt);

            user.password = hashedPassword || user.password;

            await user.save();
            const users = await UserModel.find()

            res.status(200).json({ message: 'Password Changed successfully', user: user, users: users });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
})


app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    let errors = {};

    if (!email) errors.email = "Email is required.";
    if (!req.body.password) errors.password = "Password is required.";

    if (Object.keys(errors).length > 0) {
        return res.status(422).json({ errors });
    }

    if (email && password) {
        try {
            const user = await UserModel.findOne({ email: email });
            if (user) {
                const correctPassword = await bcrypt.compare(password, user.password)
                if (correctPassword) {
                    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });
                    res.status(200).json({
                        message: 'Login successful',
                        user: user,
                        token: token
                    });
                } else {
                    res.status(404).json({ message: 'Invalid password' });
                }
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

});

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.get('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.userId);
        if (user) {
            res.status(200).json({ user: user });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/api/users', async (req, res) => {
    try {
        const users = await UserModel.find({});
        if (users) {
            res.status(200).json({ users: users })
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

app.get('/api/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await UserModel.findOne({ _id: id });
        if (user) {
            res.status(200).json({ user: user })
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})


// Posts



app.post("/api/new/post", uploadVideo.single('video'), async (req, res) => {
    const { title, description, user_id } = req.body;
    const video = req.file;

    const errors = {};

    if (!title) errors.title = 'Title is required.';
    if (!description) errors.description = 'Description is required.';
    if (!user_id) errors.user_id = 'User ID is required.';
    if (!video) errors.video = 'Video file is required.';

    if (Object.keys(errors).length > 0) {
        return res.status(422).json({ errors });
    }

    try {
        if (title && description && user_id && video) {
            const newPost = new PostModel({
                title: title,
                description: description,
                user_id: user_id,
                video: video.filename
            });
            await newPost.save();
            const posts = await PostModel.find({}).sort({ date: -1 });
            const users = await UserModel.find({})
            res.status(200).json({ message: 'Post created successfully', post: newPost, posts: posts, users: users });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/get/posts', async (req, res) => {
    try {
        const posts = await PostModel.find({}).sort({ date: -1 });
        if (posts) {
            res.status(200).json({ posts: posts });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/like/post', async (req, res) => {
    const { postId, userId } = req.body;

    try {
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const existingLike = await LikePostModel.findOne({ post_id: postId, user_id: userId });

        if (existingLike) {
            await existingLike.deleteOne();
            post.like = Math.max(0, post.like - 1);
        } else {
            const newLike = new LikePostModel({ post_id: postId, user_id: userId });
            await newLike.save();
            post.like += 1;
        }

        await post.save();

        res.status(200).json({ message: 'Like updated', likes: post.like });
    } catch (error) {
        res.status(500).json({ message: 'Error updating like', error: error.message });
    }
});






//Comments
app.get('/api/get/comments/:id_post', async (req, res) => {
    const { id_post } = req.params;
    try {
        const comments = await CommentModel.find({ post_id: id_post });
        const count = await CommentModel.countDocuments({ post_id: id_post });
        if (comments) {
            res.status(200).json({ comments: comments, count: count })
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

app.get('/api/get/comments', async (req, res) => {
    try {
        const comments = await CommentModel.find({});
        res.status(200).json({ comments: comments })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

app.post('/api/create/comment', async (req, res) => {
    const { comment, user_id, post_id } = req.body;
    const errors = {};
    if (!comment) errors.comment = 'Comment is required.';
    if (!user_id) errors.user_id = 'User id is required.';
    if (!post_id) errors.post_id = 'Post id is required.';
    if (Object.keys(errors).length > 0) {
        return res.status(422).json({ errors });
    }
    try {
        const newComment = new CommentModel({
            comment: comment,
            user_id: user_id,
            post_id: post_id
        })
        await newComment.save();
        const comments = await CommentModel.find({})
        res.status(200).json({
            message: 'Comment created successfully', comment: newComment,
            comments: comments
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/delete/comment', async (req, res) => {
    const { comment_id, post_id } = req.body;
    try {
        const removeComment = await CommentModel.deleteOne({ _id: comment_id, post_id: post_id })
        if (removeComment) {
            const comments = await CommentModel.find({})
            res.status(200).json({ message: 'Comment deleted successfully', comments: comments })
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


//Follow
app.post("/api/follow/:id_followUserId/:id_userId", async (req, res) => {
    try {
        const userId = req.params.id_userId;
        const followUserId = req.params.id_followUserId;

        await UserModel.findByIdAndUpdate(userId, { $addToSet: { following: followUserId } });

        await UserModel.findByIdAndUpdate(followUserId, { $addToSet: { followers: userId } });
        const users = await UserModel.find({})
        res.status(200).send({ message: 'Followed successfully', users: users });
    } catch (err) {
        console.error('Error following user:', err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
})

app.post("/api/unfollow/:id_unfollowUserId/:id_userId", async (req, res) => {
    try {
        const userId = req.params.id_userId;
        const unfollowUserId = req.params.id_unfollowUserId;

        await UserModel.findByIdAndUpdate(userId, { $pull: { following: unfollowUserId } });

        await UserModel.findByIdAndUpdate(unfollowUserId, { $pull: { followers: userId } });

        const users = await UserModel.find({})
        res.status(200).send({ message: 'Unfollowed successfully', users: users });
    } catch (err) {
        console.error('Error unfollowing user:', err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
})



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
