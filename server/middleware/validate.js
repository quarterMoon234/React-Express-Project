import AppError from "../errors/AppError.js";

// Joi 스키마: { body, params, query } 형태를 기대
export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate( // 스키마 검증 시 오류가 발생하면 error 가 생기고 없으면 error는 빈 값
    { body: req.body, params: req.params, query: req.query },
    { abortEarly: false, stripUnknown: true } // 처음 에러가 발생할 때 실행 흐름을 멈추지 않고 계속 수행 + 불필요 필드 제거
  );

  if (error) { // error 가 있을 때 처리
    const messages = error.details.map(d => d.message);
    throw new AppError(400, messages);
  }

  // 검증/정제된 값으로 교체
  req.validated = {
    body:   value.body   || {},
    params: value.params || {},
    query:  value.query  || {},
  };

  next();
};
