import Joi from "joi";

export const addItemSchema = Joi.object({
  body: Joi.object({
    productId: Joi.string().hex().length(24).required(),
    qty: Joi.number().integer().min(1).default(1),
  }),
  params: Joi.object({}),
  query: Joi.object({}),
});

export const getCartSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({}),
  query: Joi.object({}),
});

export const updateQtySchema = Joi.object({
  body: Joi.object({
    productId: Joi.string().hex().length(24).required(),
    qty: Joi.number().integer().min(0).required() // 0이면 제거
  }),
  params: Joi.object({}),
  query: Joi.object({})
});

export const deleteItemSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({
    productId: Joi.string().hex().length(24).required()
  }),
  query: Joi.object({})
});