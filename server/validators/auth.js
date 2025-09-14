import Joi from "joi";

export const registerSchema = Joi.object({
  body: Joi.object({
    username: Joi.string().trim().min(3).max(30).required()
      .messages({
        "string.empty": "아이디는 공백일 수 없습니다.",
        "string.min": "아이디는 최소 3자 이상이어야 합니다."
      }),
    password: Joi.string().min(10).required()
      .messages({
        "string.min": "비밀번호는 10자 이상으로 작성해주세요.",
      }),
  }),
  params: Joi.object({}),
  query: Joi.object({}),
});

export const loginSchema = Joi.object({
  body: Joi.object({
    username: Joi.string().trim().required(),
    password: Joi.string().required(),
  }),
  params: Joi.object({}),
  query: Joi.object({}),
});
