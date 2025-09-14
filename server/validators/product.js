import Joi from "joi";

export const createProductSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().trim().min(1).required(),
    description: Joi.string().allow("").default(""),
    price: Joi.number().integer().min(0).required(),
    image: Joi.string().uri().allow(""), // URL 또는 빈 값 허용
  }),
  params: Joi.object({}),
  query: Joi.object({}),
});

export const updateProductSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().trim().min(1),
    description: Joi.string().allow(""),
    price: Joi.number().integer().min(0),
    image: Joi.string().uri().allow(""),
  }).min(1), // 최소 1개 필드라도 있어야 함
  params: Joi.object({
    id: Joi.string().hex().length(24).required(), // Mongo ObjectId 형식
  }),
  query: Joi.object({}),
});
