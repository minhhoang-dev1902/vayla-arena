"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginApi } from "@/apis/auth.api";
import { Button } from "@/share/components/ui/button";

const loginSchema = z.object({
	password: z.string().min(1, "Please enter your password"),
	email: z.string().trim().email("Please enter a valid email"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const router = useRouter();
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [submitError, setSubmitError] = useState("");
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		const token = localStorage.getItem("access_token");
		if (token) {
			router.replace("/");
		}
	}, [router]);

	const onSubmit = async (values: LoginValues) => {
		setSubmitError("");
		try {
			const response = await loginApi(values);
			localStorage.setItem("access_token", response.accessToken);
			localStorage.setItem("refresh_token", response.refreshToken);
			router.replace("/");
		} catch {
			setSubmitError("Incorrect email or password. Please try again.");
		}
	};

	return (
		<div className="relative flex min-h-screen flex-col overflow-hidden bg-[#020816] text-white">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_36%_8%,rgba(37,229,221,0.24),transparent_42%),radial-gradient(circle_at_50%_48%,rgba(13,63,88,0.38),transparent_64%),linear-gradient(180deg,#05142a_0%,#010714_100%)]" />
			<div className="px-6 relative z-10 flex h-full w-full  flex-1 flex-col mt-5">
				<div className="mt-10 space-y-4">
					<h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white">
						Welcome Back
						<span className="block text-[#1ce8d7]">to VAYLA Arena</span>
					</h1>
					<p className="text-lg  text-[#8da2ba]">Enter your credentials to enter the arena.</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-5">
					<fieldset disabled={isSubmitting} className="flex flex-col gap-6">
						<div className="space-y-2">
							<label htmlFor="email" className="text-xs font-semibold uppercase text-[#9fb2c7]">
								Email Address
							</label>
							<input
								id="email"
								{...register("email")}
								type="email"
								placeholder="Enter your email"
								className="h-13 w-full rounded-lg border border-[#12d8d1]/45 bg-[#021321]/30 px-5 text-sm text-[#d6e4ef] placeholder:text-[#7f95ac] focus:border-[#1fe1d4] focus:outline-none mt-2"
							/>
							{errors.email && <p className="text-sm text-[#ff9c9c]">{errors.email.message}</p>}
						</div>

						<div className="space-y-2">
							<label htmlFor="password" className="text-xs font-semibold uppercase text-[#9fb2c7]">
								Password
							</label>
							<div className="relative">
								<input
									id="password"
									{...register("password")}
									placeholder="Enter your password"
									type={isPasswordVisible ? "text" : "password"}
									className="h-13 w-full rounded-lg border border-[#12d8d1]/45 bg-[#021321]/30 px-5 text-sm text-[#d6e4ef] placeholder:text-[#7f95ac] focus:border-[#1fe1d4] focus:outline-none mt-2"
								/>
								<button
									type="button"
									onClick={() => setIsPasswordVisible(prev => !prev)}
									aria-label={isPasswordVisible ? "Hide password" : "Show password"}
									className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7f95ac] hover:text-[#c9d8e6]"
								>
									{isPasswordVisible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
								</button>
							</div>
							{errors.password && (
								<p className="text-sm text-[#ff9c9c]">{errors.password.message}</p>
							)}
						</div>
					</fieldset>

					{submitError && (
						<p className="flex items-start gap-2 text-sm font-medium text-[#ff5f7d]">
							<AlertCircle className="mt-0.5 size-4 shrink-0" />
							{submitError}
						</p>
					)}

					<Button
						type="submit"
						disabled={isSubmitting}
						className="mt-5 py-6 rounded-lg bg-[linear-gradient(90deg,#2de8dc_0%,#119e9c_100%)] text-xl font-semibold text-[#eef5f7] hover:opacity-95"
					>
						{isSubmitting ? (
							<>
								<Loader2 className="size-5 animate-spin" />
								Logging in...
							</>
						) : (
							"Login"
						)}
					</Button>
				</form>

				<Link
					href="#"
					className="mt-5 text-center text-sm font-semibold text-[#1ce8d7] hover:text-[#58f2e5]"
				>
					Forgot Password?
				</Link>

				<p className="mt-15 text-center text-sm text-[#8ea3b9]">
					Don&apos;t have an account?{" "}
					<Link href="/sign-up" className="font-semibold text-[#1ce8d7] hover:text-[#58f2e5]">
						Sign Up
					</Link>
				</p>
			</div>
		</div>
	);
}
