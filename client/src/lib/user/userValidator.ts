import { z } from "zod";

export const RegisterSchema = z.object({
    fullName: z.string()
            .min(4, "Minimum name need to be 4")
            .max(30, "Maximum name should 30"),
    email: z.string()
            .email("Invalid email"),
    password: z.string()
            .min(8, "Password need to be minimum 8"),
     profile: z
    .any()
    .refine((file) => file instanceof File, "Profile must be a file")
    .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
    .refine(
      (file) =>
        ["image/jpeg", "image/png"].includes(file.type),
      "Only JPEG, PNG files are accepted"
    )
    .optional().nullable(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;


export const LoginSchema = z.object({
    email: z.string()
                .email("Invalid email"),
    password: z.string()
                .min(8, "Password need to be minimum 8.")
});

export type LoginInput = z.infer<typeof LoginSchema>;