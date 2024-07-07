import { z } from "zod";


export const SignUpSchema = z.object({
    username:z.string().min(1,"Please enter a username"),
    fullname:z.string().min(1,"Please enter your name"),
    password:z.string().min(6,"Your password must be at least 6 characters")
})

export const LoginSchema = z.object({
    username:z.string().min(1,"Please enter your username"),
    password:z.string().min(6,"Your Please must be at least 6 characters")
})