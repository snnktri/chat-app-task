import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, type RegisterInput } from "@/lib/user/userValidator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/apiHandler/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
    const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      profile: null,
    },
  });

 const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0] ?? null;
  setValue("profile", file, { shouldValidate: true });
};

  const onSubmit = async (data: RegisterInput) => {
    console.log("Form data:", data);
    try {
      const res = await registerUser(data);
      if(res?.success) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error)
    }
  };
   return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-2/3 md:w-1/2 bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              {...register("fullName")}
              placeholder="Ram Sharma"
              className={errors.fullName ? "border-red-600" : ""}
            />
            {errors.fullName && (
              <p className="text-red-600 text-sm mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="you@example.com"
              className={errors.email ? "border-red-600" : ""}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="******"
              className={errors.password ? "border-red-600" : ""}
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile">Profile Image</Label>
            <input
              id="profile"
              type="file"
              onChange={handleProfileChange}
              className="file-input file-input-bordered w-full"
            />
          </div>

          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
        <p className="text-center">
          Have alrady account <Link to="/login" className="text=blue-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register
