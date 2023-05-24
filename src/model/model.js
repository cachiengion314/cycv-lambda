const {
    Schema, model, ObjectId
} = require(`mongoose`);

const CycUserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        default: "your_name_here",
    }
}, { timestamps: true })

const CycShowCaseSaveFile = new Schema({
    saveData: {
        type: Object,
        required: true
    },
    createdBy: {
        type: ObjectId,
        required: true,
        ref: "cycvuser"
    }
}, { timestamps: true })

const CycvCommentSchema = new Schema({
    createdIn: {
        type: ObjectId,
        required: true,
        ref: "cycshowcasesavefile"
    },
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: ObjectId,
        required: true,
        ref: "cycvuser"
    }
}, { timestamps: true })

exports.comment = model(`comment`, CycvCommentSchema)

exports.cycShowCaseSaveFile = model(`cycshowcasesavefile`, CycShowCaseSaveFile)

exports.cycvuser = model(`cycvuser`, CycUserSchema)