import { Request, Response, Router } from "express";
import { cycShowCaseSaveFile, comment, cycvuser } from "../model/model";
import { Types } from "mongoose";
const ObjectId = Types.ObjectId;

//
// /api/get-all-savefile-showcase
//
export const saveFileShowCases = async (
  request: Request,
  response: Response
) => {
  const { page, pageSize } = request.query;
  const _pageSize = Number(pageSize) || 8;
  const _page = Number(page) || 1;
  const skip = (_page - 1) * _pageSize;

  try {
    const docs = await cycShowCaseSaveFile.aggregate([
      {
        $facet: {
          totalItems: [
            {
              $match: {
                "saveData.preference.savePreference.isCvPublic": true
              }
            },
            {
              $count: "total"
            }
          ],
          allSaveFiles: [
            {
              $match: {
                "saveData.preference.savePreference.isCvPublic": true
              }
            },
            {
              $skip: skip
            },
            {
              $limit: _pageSize
            },
            {
              $lookup: {
                from: "cycvusers",
                localField: "createdBy",
                foreignField: "_id",
                as: "_createdByUser"
              }
            },
            {
              $unwind: {
                path: "$_createdByUser"
              }
            },
            {
              $project: {
                _id: 1,
                saveData: 1,
                createdBy: "$_createdByUser.email",
                createdAt: 1
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: "$totalItems"
        }
      }
    ]);

    response.send({ docs, messenger: "successfully!" });
  } catch (err) {
    console.log(err);
  }
};
//
// /api/get-specific-savefile-showcase
//
export const saveFileShowcase = async (
  request: Request,
  response: Response
) => {
  const { savefileId } = request.query;
  const _savefileId = savefileId?.toString();

  const doc = await cycShowCaseSaveFile
    .findOne({
      _id: new ObjectId(_savefileId),
      "saveData.preference.savePreference.isCvPublic": true
    })
    .populate({
      path: "createdBy",
      select: "email"
    });
  // .exec(function (err: any, doc: any) {
  //   if (!err) {
  //     if (doc) {
  //       response.send({ doc, messenger: "successfully!" });
  //       return;
  //     }
  //     response.send({
  //       messenger: "maybe this cv is not mean for public view!"
  //     });
  //     return;
  //   }
  //   if (err) {
  //     console.log(`messenger`, err);
  //     response.status(404).send({ messenger: "your info are so wrong!" });
  //     return;
  //   }
  //   console.log(`Can't find anything`);
  //   response.send({ messenger: "Can't find anything" });
  // });
  if (doc) {
    response.send({ doc, messenger: "successfully!" });
    return;
  }
  response.send({ messenger: "err!" });
};
//
// /api/get-all-savefile-showcase-of-user
//
export const getAllSaveFileShowCaseOfUser = async (
  request: Request,
  response: Response
) => {
  // @ts-ignore
  const userId = request?.user?._id;

  const docs = await cycShowCaseSaveFile
    .find({
      createdBy: userId
    })
    .populate({
      path: "createdBy",
      select: "email"
    });
  // .exec(function (err: any, docs: any) {
  //   if (!err) {
  //     response.send({ docs, messenger: "successfully!" });
  //     return;
  //   }
  //   if (err) {
  //     console.log(`messenger`, err);
  //     response.status(404).send({ messenger: "your info are so wrong!" });
  //     return;
  //   }
  //   console.log(`Can't find anything`);
  //   response.send({ messenger: "Can't find anything" });
  // });
  if (docs) {
    response.send({ docs, messenger: "successfully!" });
    return;
  }
  response.send({ messenger: "err!" });
};
//
// /api/remove-savefile-showcase
//
export const removeSaveFileShowCase = (
  request: Request,
  response: Response
) => {
  const { savefileId } = request.query;
  const _savefileId = savefileId?.toString();

  cycShowCaseSaveFile.findOneAndDelete(
    {
      _id: new ObjectId(_savefileId)
    },
    function (err: any, doc: any) {
      if (!err) {
        response.send({ doc, messenger: "successfully!" });
        comment.deleteMany(
          { createdIn: new ObjectId(_savefileId) },
          { new: true }
        );
        return;
      }
      if (err) {
        console.log(`messenger`, err);
        response.status(404).send({ messenger: "your info are so wrong!" });
        return;
      }
      console.log(`Can't find anything due to invalid id!`);
      response.send({ messenger: "Can't find anything due to invalid id!" });
    }
  );
};
//
// /api/update-savefile-showcase
//
export const updateSaveFileShowCase = async (
  request: Request,
  response: Response
) => {
  const { saveData } = request.body;
  const { savefileId } = request.query;
  const _savefileId = savefileId?.toString();

  const res = await cycShowCaseSaveFile.findOneAndUpdate(
    {
      _id: new ObjectId(_savefileId)
    },
    {
      $set: {
        saveData
      }
    },
    { new: true }
    // ,
    // function (err: any, doc: any) {
    //   if (!err) {
    //     response.send({ messenger: "successfully!" });
    //     return;
    //   }
    //   if (err) {
    //     console.log(`messenger`, err);
    //     response.status(404).send({ messenger: "your info are so wrong!" });
    //     return;
    //   }
    //   console.log(`Can't find anything due to invalid password or id!`);
    //   response.send({
    //     messenger: "Can't find anything due to invalid password or id!"
    //   });
    // }
  );
  if (res) {
    response.send({ messenger: "successfully!" });
    return;
  }
  response.send({ messenger: "err!" });
};
//
// /api/add-savefile-showcase
//
export const addSaveFileToShowCase = async (
  request: Request,
  response: Response
) => {
  // @ts-ignore
  const id = request?.user?._id;
  const { saveData } = request.body;

  const res = await cycShowCaseSaveFile.create(
    { saveData, createdBy: id }
    // ,
    // function (err: any, doc: any) {
    //   if (err) {
    //     response.send({ messenger: err });
    //     return;
    //   }
    //   response.send({ doc, messenger: "successfully!" });
    // }
  );
  if (res) {
    response.send({ messenger: "successfully!" });
    return;
  }
  response.send({ messenger: "err!" });
};
//
// /api/get-comments
//
export const getComments = async (request: Request, response: Response) => {
  const { savefileId } = request.query;
  if (!savefileId) {
    response.send({ messenger: "savefileId is empty!" });
    return;
  }

  const docs = await comment
    .find({
      createdIn: savefileId
    })
    .populate({
      path: "createdBy",
      select: "email"
    });
  // .exec(function (err: any, docs: any) {
  //   if (err) {
  //     console.log(err);
  //     response.send({ messenger: err });
  //     return;
  //   }
  //   console.log(`getComment`, docs);
  //   response.send({ docs, messenger: "successfully!" });
  // });
  if (docs) {
    response.send({ docs, messenger: "successfully!" });
    return;
  }
  response.send({ messenger: "err!" });
};
//
// /api/remove-comment
//
export const removeComment = (request: Request, response: Response) => {
  const { commentId } = request.query;

  comment.findByIdAndDelete(commentId, function (err: any, doc: any) {
    if (err) {
      response.send({ messenger: err });
      return;
    }
    response.send({ messenger: "successfully!" });
  });
};
//
// /api/add-comment
//
export const addComment = async (request: Request, response: Response) => {
  // @ts-ignore
  const id = request?.user?._id;
  const { content, createdIn } = request.body;

  const doc = await comment.create(
    { content, createdIn, createdBy: id }
    // ,
    // function (err: any, doc: any) {
    //   if (err) {
    //     response.send({ messenger: err });
    //     return;
    //   }
    //   response.send({ doc, messenger: "successfully!" });
    // }
  );
  if (doc) {
    response.send({ doc, messenger: "successfully!" });
    return;
  }
  response.send({ messenger: "err!" });
};
//
//
//
export const notfound = (request: Request, response: Response) => {
  response.send({
    messenger: `we can not found you location and this is a 404 page, if you ask :D`
  });
};
