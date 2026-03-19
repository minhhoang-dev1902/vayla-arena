"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import vaylaLogo from "@/assets/images/vayla-logo.png";
import { useRegister } from "@/features/auth/hooks/use-register";
import { Button } from "@/share/components/ui/button";

const signUpSchema = z
	.object({
		email: z.string().trim().email("Please enter a valid email"),
		confirmPassword: z.string().min(1, "Please confirm your password"),
		password: z.string().min(8, "Password must be at least 8 characters"),
	})
	.refine(values => values.password === values.confirmPassword, {
		path: ["confirmPassword"],
		message: "Confirm password does not match",
	});

type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
	const router = useRouter();
	const [submitMessage, setSubmitMessage] = useState<string>("");
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting: isFormSubmitting },
	} = useForm<SignUpValues>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	});
	const { isPending: isRegistering, register: registerAccount } = useRegister();
	const isSubmitting = isFormSubmitting || isRegistering;

	const onSubmit = async (values: SignUpValues) => {
		setSubmitMessage("");
		try {
			await registerAccount({
				email: values.email,
				password: values.password,
			});

			setSubmitMessage("Sign up successful. Please log in to continue.");
			setTimeout(() => {
				router.push("/login");
			}, 900);
		} catch (error) {
			const fallback = "Unable to sign up right now. Please try again.";
			if (typeof error === "object" && error && "message" in error) {
				const message = (error as { message?: string }).message;
				setSubmitMessage(message || fallback);
				return;
			}
			setSubmitMessage(fallback);
		}
	};

	return (
		<div className="relative flex max-h-screen min-h-screen flex-col overflow-hidden bg-[#020816] px-6 pb-8  text-white">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(33,225,216,0.24),transparent_34%),radial-gradient(circle_at_50%_45%,rgba(9,50,76,0.42),transparent_63%),linear-gradient(180deg,#041426_0%,#010612_100%)]" />

			<div className="relative z-10 mx-auto flex h-full w-full  flex-1 flex-col">
				<div className="flex items-center justify-center">
					<Image priority src={vaylaLogo} alt="VAYLA Logo" className="h-60 object-contain" />
				</div>

				<h1 className="text-center text-3xl font-extrabold tracking-tight">SIGN UP</h1>

				<form onSubmit={handleSubmit(onSubmit)} className="mt-10 flex flex-col gap-5">
					<fieldset disabled={isSubmitting} className="flex flex-col gap-3.5">
						<div className="flex flex-col gap-1.5">
							<input
								{...register("email")}
								type="email"
								placeholder="Email"
								className="h-13 rounded-2xl border border-[#17d9d4]/45 bg-transparent px-5 text-lg text-[#d6e4ef] placeholder:text-[#748ba5] focus:border-[#33e9dd] focus:outline-none"
							/>
							{errors.email && (
								<p className="px-2 text-sm text-[#ff9c9c]">{errors.email.message}</p>
							)}
						</div>

						<div className="flex flex-col gap-1.5">
							<div className="relative">
								<input
									{...register("password")}
									placeholder="Password"
									type={isPasswordVisible ? "text" : "password"}
									className="h-13 w-full rounded-2xl border border-[#17d9d4]/45 bg-transparent px-5 pr-12 text-lg text-[#d6e4ef] placeholder:text-[#748ba5] focus:border-[#33e9dd] focus:outline-none"
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
								<p className="px-2 text-sm text-[#ff9c9c]">{errors.password.message}</p>
							)}
						</div>

						<div className="flex flex-col gap-1.5">
							<div className="relative">
								<input
									{...register("confirmPassword")}
									placeholder="Confirm Password"
									type={isConfirmPasswordVisible ? "text" : "password"}
									className="h-13 w-full rounded-2xl border border-[#17d9d4]/45 bg-transparent px-5 pr-12 text-lg text-[#d6e4ef] placeholder:text-[#748ba5] focus:border-[#33e9dd] focus:outline-none"
								/>
								<button
									type="button"
									onClick={() => setIsConfirmPasswordVisible(prev => !prev)}
									aria-label={isConfirmPasswordVisible ? "Hide password" : "Show password"}
									className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7f95ac] hover:text-[#c9d8e6]"
								>
									{isConfirmPasswordVisible ? (
										<EyeOff className="size-5" />
									) : (
										<Eye className="size-5" />
									)}
								</button>
							</div>
							{errors.confirmPassword && (
								<p className="px-2 text-sm text-[#ff9c9c]">{errors.confirmPassword.message}</p>
							)}
						</div>
					</fieldset>

					<Button
						type="submit"
						disabled={isSubmitting}
						className="mt-2 h-13 rounded-2xl bg-[linear-gradient(90deg,#39dcd5_0%,#1b9d99_100%)] text-2xl font-semibold text-[#e8f6f8] hover:opacity-95"
					>
						{isSubmitting ? (
							<>
								<Loader2 className="size-5 animate-spin" />
								Submitting...
							</>
						) : (
							"Sign Up"
						)}
					</Button>
				</form>

				<p className="mx-auto mt-8 max-w-[300px] text-center text-sm leading-relaxed text-[#97a9bf]">
					A verification notice will be sent to your email after submission.
				</p>
				{submitMessage && (
					<p className="mx-auto mt-3 max-w-[320px] text-center text-sm text-[#97f6e5]">
						{submitMessage}
					</p>
				)}

				<p className="mt-auto pt-16 text-center text-[10px] uppercase tracking-[0.65em] text-[#7f95ac]">
					Powered by VAYLA
				</p>
			</div>
		</div>
	);
}
