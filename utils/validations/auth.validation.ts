import {z} from 'zod';
import { LoginModel } from '~~/models/auth/login.model';

export const changePasswordSchema = z.object({
    email: z.string().email(),
    confirmPassword: z.string(),
    newPassword: z.string(),
    oldPassword: z.string(),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const editProfileSchema = z.object({
  address: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  image: z.string().optional(),
  gender: z.enum(["Male", "Female"]), 
  password: z.string(),
});

export const signupSchema = z.object({
  address: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  gender: z.enum(["Male", "Female"]),  
  confirmPassword: z.string(),
  password: z.string(),
  image: z.string().optional()
}).refine((values) => values.password === values.confirmPassword) 
  

export const roleChangeSchema = z.object({
  email: z.string(),
  role: z.enum(["Admin", "Staff", "User"]),
})