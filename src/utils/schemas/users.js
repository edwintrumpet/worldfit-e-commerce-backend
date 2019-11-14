const joi = require('@hapi/joi')

const userIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/)
const userNameSchema = joi.string().max(100)
const userEmailSchema = joi.string().email()
const userPasswordSchema = joi.string()
const userRolSchema = joi.string().regex(/^((root)|(admin)|(collaborator)|(client))$/)

const createClientSchema = {
    name: userNameSchema.required(),
    email: userEmailSchema.required(),
    password: userPasswordSchema.required()
}

const createUserSchema = {
    name: userNameSchema.required(),
    email: userEmailSchema.required(),
    password: userPasswordSchema.required(),
    rol: userRolSchema.required()
}

const listUsersSchema = {
    id: userIdSchema,
    name: userNameSchema,
    email: userEmailSchema,
    rol: userRolSchema,
    nextId: userIdSchema
}

const updateMyUserSchema = {
    name: userNameSchema,
    email: userEmailSchema,
    password: userPasswordSchema,
    deleted: joi.boolean()
}

const updateUsersSchema = {
    name: userNameSchema,
    email: userEmailSchema,
    password: userPasswordSchema,
    deleted: joi.boolean(),
    rol: userRolSchema
}

module.exports = {
    userIdSchema,
    createClientSchema,
    createUserSchema,
    listUsersSchema,
    updateMyUserSchema,
    updateUsersSchema
}