import validator from "express-validator"

export const register = [
    validator.body("email").isString().isEmail().withMessage("Wrong Email").isLength({ min: 10, max: 40 }).withMessage("Допустимое количество символов от 10 до 40)"),
    validator.body("name").isString().isLength({ min: 2, max: 40}).withMessage("Допустимое количество символов в логине от 2 до 40."),
    validator.body("password", "Укажите пароль").isString().isLength({ min: 6 }).withMessage("Минимальная длинна пароля 6 символов").custom((value, { req }) => {
        if(value !== req.body.password2) {
            throw new Error("Пароли не совпадают");
        }
        else {
            return value;
        }
    }),
]

export const update = [
    validator.body("email").isString().isEmail().withMessage("Wrong Email").isLength({ min: 10, max: 40 }).withMessage("Допустимое количество символов от 10 до 40)"),
    validator.body("name").isString().isLength({ min: 2, max: 40}).withMessage("Допустимое количество символов в логине от 2 до 40."),
    validator.body("city").isString().isLength({ min: 2 }).withMessage("Минимальная длинна названия города 2 символа"),
    validator.body("address").isString().isLength({ min: 6 }).withMessage("Минимальная длинна адреса 6 символов"),
]