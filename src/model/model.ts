import { Schema, model, Types } from "mongoose";

const CycUserSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: "your_name_here"
    }
  },
  { timestamps: true }
);

const CycShowCaseSaveFile = new Schema(
  {
    saveData: {
      type: Object,
      required: true
    },
    createdBy: {
      type: Types.ObjectId,
      required: true,
      ref: "cycvuser"
    }
  },
  { timestamps: true }
);

const CycvCommentSchema = new Schema(
  {
    createdIn: {
      type: Types.ObjectId,
      required: true,
      ref: "cycshowcasesavefile"
    },
    content: {
      type: String,
      required: true
    },
    createdBy: {
      type: Types.ObjectId,
      required: true,
      ref: "cycvuser"
    }
  },
  { timestamps: true }
);

export const comment = model(`comment`, CycvCommentSchema);

export const cycShowCaseSaveFile = model(
  `cycshowcasesavefile`,
  CycShowCaseSaveFile
);

export const cycvuser = model(`cycvuser`, CycUserSchema);
