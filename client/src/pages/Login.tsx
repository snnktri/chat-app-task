import { useForm } from "react-hook-form";
import { LoginSchema, type LoginInput } from "@/lib/user/userValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login as LoginUser} from "@/apiHandler/auth";
import { useAuthStore } from "@/store/user.store";

const Login = () => {
  const navigate = useNavigate();
  const login  = useAuthStore(state => state.login)
  const {
    register,
    handleSubmit,
    formState: { errors}
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: LoginInput) => {
    console.log(data);
    try {
      const res = await LoginUser(data);
      console.log(res.data);

      if(res.success) {
        localStorage.setItem("cToken", res.data.accessToken);
        login(res.data.loggedUser);
        navigate("/");
      }
    } catch (error) {
      console.log(error)
    }
  }

    return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-2/3 md:w-1/2 bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          

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

          

          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
        <p className="text-center">
          Don't have account <Link to="/register" className="text=blue-500 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login
