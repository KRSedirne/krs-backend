import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    lastname: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false,
    },
    role: {
        type: String,
        enum: ["user", "admin", "Admin", "User"],
        default: "user"
    }
})

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        if (this.password.length < 6 || this.password.length > 30) {
            return next(new Error('Password should be between 6 and 30 characters.'));
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_./*-@&%/()=?_^+!><])[A-Za-z\d_./*-@&%/()=?_^+!><]{6,30}$/;

        if (!passwordRegex.test(this.password)) {
            return next(new Error('Password should contain at least one lowercase letter, one uppercase letter, and one number.'));
        }
        try {
            this.password = await bcrypt.hash(this.password, 10);
        } catch (error) {
            return next(error);
        }
    }
    next();
});

// Şifre doğrulama (hashleme işleminden önce) - findOneAndUpdate middleware
userSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();

    // Eğer şifre güncelleniyorsa, hashle
    if (update.password) {
        // Plain text şifrenin uzunluğunu kontrol et
        if (update.password.length < 6 || update.password.length > 30) {
            return next(new Error('Password should be between 2 and 30 characters.'));
        }

        if (update.password.length < 6 || update.password.length > 30) {
            return next(new Error('Password should be between 6 and 30 characters.'));
        }
        
        // Şifrede en az bir küçük harf, bir büyük harf ve bir rakam olmalı
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_./*-@&%/()=?_^+!><])[A-Za-z\d_./*-@&%/()=?_^+!><]{6,30}$/;

        if (!passwordRegex.test(update.password)) {
            return next(new Error('Password should contain at least one lowercase letter, one uppercase letter, and one number.'));
        }

        // Hashleme işlemi
        try {
            const saltRounds = 10;
            update.password = await bcrypt.hash(update.password, saltRounds);
            this.setUpdate(update);  // Güncellenmiş şifreyi set et
        } catch (error) {
            return next(error);
        }
    }
    next();
});

//şifre doğru mu değil mi kontrol etmek için
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
