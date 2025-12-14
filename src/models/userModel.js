import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: 'Member', // e.g., 'Project Manager', 'Developer', etc.
        },
        department: {
            type: String,
            default: 'General',
        },
        location: {
            type: String,
            default: 'Remote',
        },
        bio: {
            type: String,
            default: '',
        },
        avatar: {
            type: Number, // Picsum ID or similar, as per frontend analysis
            default: 1,
        },
        status: {
            type: String,
            enum: ['online', 'busy', 'offline', 'away'],
            default: 'offline',
        },
        // Gamification
        level: {
            type: Number,
            default: 1,
        },
        xp: {
            type: Number,
            default: 0,
        },
        badges: [{
            name: String,
            icon: String,
            color: String,
            earnedAt: {
                type: Date,
                default: Date.now
            }
        }],
        skills: [{
            name: String,
            level: Number // 0-100
        }],
        // Streak tracking
        currentStreak: {
            type: Number,
            default: 0,
        },
        longestStreak: {
            type: Number,
            default: 0,
        },
        lastActiveDate: {
            type: Date,
        },
        unlockedAchievements: [{
            type: String, // Achievement key
        }],
        // Additional profile fields
        phone: {
            type: String,
        },
        joinDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Virtual for xpToNextLevel
userSchema.virtual('xpToNextLevel').get(function () {
    return this.level * 1000;
});

// Ensure virtuals are included in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);

export default User;
