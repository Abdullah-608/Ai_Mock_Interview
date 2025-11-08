"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import SpaceBackground from "./SpaceBackground";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { signIn, signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: type === "sign-up" 
      ? z.string().min(8, "Password must be at least 8 characters")
      : z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (!password) return 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 10;
    
    // Complexity checks
    if (/[a-z]/.test(password)) strength += 15; // lowercase
    if (/[A-Z]/.test(password)) strength += 15; // uppercase
    if (/[0-9]/.test(password)) strength += 15; // numbers
    if (/[^a-zA-Z0-9]/.test(password)) strength += 20; // special characters
    
    return Math.min(strength, 100);
  };

  const getStrengthLabel = (strength: number) => {
    if (strength === 0) return '';
    if (strength < 40) return 'Weak';
    if (strength < 70) return 'Medium';
    if (strength < 90) return 'Strong';
    return 'Very Strong';
  };

  const getStrengthColor = (strength: number) => {
    if (strength < 40) return 'from-red-500 to-orange-500';
    if (strength < 70) return 'from-yellow-500 to-orange-500';
    if (strength < 90) return 'from-blue-500 to-cyan-500';
    return 'from-green-500 to-emerald-500';
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.replace("/sign-in");
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success("Signed in successfully.");
        router.push("/dashboard");
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:py-0 relative overflow-hidden">
      {/* Space Background */}
      <SpaceBackground />

      {/* Back to Home Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute left-1/2 top-4 -translate-x-1/2 sm:left-6 sm:top-6 sm:translate-x-0 z-20 w-[calc(100%-2rem)] sm:w-auto"
      >
        <Link href="/" className="block">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center justify-center px-4 py-2 text-white border border-white/30 rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all ${isSignIn ? "w-full sm:w-auto" : "hidden sm:flex sm:w-auto"}`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </motion.button>
        </Link>
      </motion.div>

      <div className="relative z-10 w-full max-w-5xl px-2 sm:px-3">
        <div className="flex flex-col items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="w-full max-w-sm sm:max-w-md lg:max-w-lg justify-self-center"
          >
            <div className="relative bg-gradient-to-br from-slate-900/92 to-slate-800/90 backdrop-blur-xl rounded-[26px] px-5 py-6 sm:px-6 sm:py-7 border border-white/10 shadow-2xl">
              {/* Subtle glow */}
              <div className="absolute -inset-[1px] rounded-[26px] bg-gradient-to-r from-purple-600/18 to-blue-600/18 blur-xl" />

              <div className="relative">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-center mb-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
                    className="flex items-center justify-center mb-5"
                  >
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 mr-3 sm:mr-4">
                      <Image
                        src="/svg/Logo.svg"
                        alt="Prepify Logo"
                        fill
                        sizes="64px"
                        className="object-contain"
                      />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Prepify
                    </h1>
                  </motion.div>

                  <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
                    {isSignIn ? "Welcome Back!" : "Create Your Account"}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {isSignIn ? "Continue your interview practice journey" : "Unlock personalized interview coaching in minutes"}
                  </p>
                </motion.div>

                {/* Form */}
                <div className="space-y-5">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-5"
                    >
                      {!isSignIn && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          <FormField
                            control={form.control}
                            name="name"
                            label="Full Name"
                            placeholder="Enter your full name"
                            type="text"
                          />
                        </motion.div>
                      )}

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: isSignIn ? 0.4 : 0.5 }}
                      >
                        <FormField
                          control={form.control}
                          name="email"
                          label="Email Address"
                          placeholder="Enter your email"
                          type="email"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: isSignIn ? 0.5 : 0.6 }}
                        className="space-y-2.5"
                      >
                        <FormField
                          control={form.control}
                          name="password"
                          label="Password"
                          placeholder="Enter your password"
                          type="password"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            form.setValue('password', e.target.value);
                            if (!isSignIn) {
                              setPasswordStrength(calculatePasswordStrength(e.target.value));
                            }
                          }}
                        />

                        {/* Password Strength Indicator - Only for Sign Up */}
                        {!isSignIn && form.watch('password') && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-2.5"
                          >
                            {/* Strength Bar */}
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${passwordStrength}%` }}
                                transition={{ duration: 0.3 }}
                                className={`h-full bg-gradient-to-r ${getStrengthColor(passwordStrength)} rounded-full`}
                              />
                            </div>

                            {/* Strength Label */}
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                              <span className={`font-semibold ${
                                passwordStrength < 40 ? 'text-red-400' :
                                passwordStrength < 70 ? 'text-yellow-400' :
                                passwordStrength < 90 ? 'text-blue-400' :
                                'text-green-400'
                              }`}>
                                {getStrengthLabel(passwordStrength)}
                              </span>
                              <span className="text-gray-400">
                                {passwordStrength}% secure
                              </span>
                            </div>

                            {/* Password Requirements */}
                            {passwordStrength < 100 && (
                              <div className="mt-2 p-2 bg-white/5 rounded-lg border border-white/10">
                                <p className="text-[11px] text-gray-400 mb-2">Password should contain:</p>
                                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                                  <div className={`flex items-center gap-1 ${form.watch('password').length >= 8 ? 'text-green-400' : 'text-gray-500'}`}>
                                    <span>{form.watch('password').length >= 8 ? '✓' : '○'}</span>
                                    <span>8+ characters</span>
                                  </div>
                                  <div className={`flex items-center gap-1 ${/[A-Z]/.test(form.watch('password')) ? 'text-green-400' : 'text-gray-500'}`}>
                                    <span>{/[A-Z]/.test(form.watch('password')) ? '✓' : '○'}</span>
                                    <span>Uppercase</span>
                                  </div>
                                  <div className={`flex items-center gap-1 ${/[a-z]/.test(form.watch('password')) ? 'text-green-400' : 'text-gray-500'}`}>
                                    <span>{/[a-z]/.test(form.watch('password')) ? '✓' : '○'}</span>
                                    <span>Lowercase</span>
                                  </div>
                                  <div className={`flex items-center gap-1 ${/[0-9]/.test(form.watch('password')) ? 'text-green-400' : 'text-gray-500'}`}>
                                    <span>{/[0-9]/.test(form.watch('password')) ? '✓' : '○'}</span>
                                    <span>Number</span>
                                  </div>
                                  <div className={`flex items-center gap-1 ${/[^a-zA-Z0-9]/.test(form.watch('password')) ? 'text-green-400' : 'text-gray-500'}`}>
                                    <span>{/[^a-zA-Z0-9]/.test(form.watch('password')) ? '✓' : '○'}</span>
                                    <span>Special char</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </motion.div>

                      <div>
                        <Button
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 text-sm sm:text-base"
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2 inline-block"
                            />
                          ) : null}
                          {isSignIn ? "Sign In" : "Create Account"}
                        </Button>
                      </div>
                    </form>
                  </Form>

                  {/* Footer */}
                  <div className="text-center">
                    <p className="text-sm text-gray-400">
                      {isSignIn ? "Don't have an account?" : "Already have an account?"}
                      <Link
                        href={!isSignIn ? "/sign-in" : "/sign-up"}
                        className="ml-2 text-blue-400 hover:text-cyan-400 font-semibold transition-colors"
                      >
                        {!isSignIn ? "Sign In" : "Sign Up"}
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
