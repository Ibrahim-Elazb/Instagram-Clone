// @ts-nocheck
const mongoose = require("mongoose");
const DBschema = mongoose.Schema;
const bcrypt=require("bcrypt");
const userSchema = new DBschema({
    userName: {
        type: DBschema.Types.String,
        required: true
    },
    firstName: {
        type: DBschema.Types.String,
        required: true
    },
    lastName: {
        type: DBschema.Types.String,
        required: true
    },
    email: {
        type: DBschema.Types.String,
        unique:true,
        required: true
    },
    password: {
        type: DBschema.Types.String,
        required: true
    },
    phone: {
        type: DBschema.Types.String,
    },
    age: {
        type: DBschema.Types.Number,
        required: true
    },
    gender: {
        type: DBschema.Types.String,
        enum: ["male", "female"],
        default: "male"
    },
    profilePicture: DBschema.Types.String,
    coverPictures: {
        type: DBschema.Types.Array,
        default:[]
    },
    gallery: {
        type: DBschema.Types.Array,
        default:[]
    },
    confirmEmail: {
        type: DBschema.Types.Boolean,
        default: false
    },
    // online: {
    //     type: DBschema.Types.Boolean,
    //     default: false
    // },
    isBlocked: {
        type: DBschema.Types.Boolean,
        default: false
    },
    role: {
        type: DBschema.Types.String,
        default: "user"
    },
    socialLinks: {
        type: DBschema.Types.Array,
        default: []
    },
    followers: {
        type: [{
            type: DBschema.Types.ObjectId,
            ref: "User"
        }],
        default: []
    },
    following: {
        type: [{
            type: DBschema.Types.ObjectId,
            ref: "User"
        }],
        default: []
    },
    resetPasswordCode:DBschema.Types.Number,
    pdfLink:DBschema.Types.String
}, {
    timestamps: true
});

userSchema.pre('save',async function(next){
    this.password=await bcrypt.hash(this.password,+process.env.HASH_SALT)
    next()
})

userSchema.pre('findOneAndUpdate',async function(next){
    // console.log(this.getQuery())
    // console.log(this.model)
   const user=await this.model.findOne(this.getQuery()).select("__v")
   this.set({ __v: user.__v + 1 })
    next()
})


const userModel=mongoose.model("User",userSchema);
module.exports=userModel;