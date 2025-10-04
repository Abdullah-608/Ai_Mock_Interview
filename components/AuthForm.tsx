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
        router.push("/sign-in");
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
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Space Background */}
      <SpaceBackground />

      {/* Back to Home Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-8 left-8 z-20"
      >
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-4 py-2 text-white border border-white/30 rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </motion.button>
        </Link>
      </motion.div>

      {/* Auth Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
          {/* Subtle glow */}
          <div className="absolute -inset-px bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur-xl" />
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-8 relative"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
              className="flex items-center justify-center mb-6"
            >
              <div className="relative w-16 h-16 mr-3">
                <Image
                  src="/real_logo.svg"
                  alt="PrepWise Logo"
                  width={64}
                  height={64}
                  className="w-full h-full"
                />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                PrepWise
              </h1>
            </motion.div>
            
            <h2 className="text-2xl font-bold text-white mb-2">
              {isSignIn ? "Welcome Back!" : "Start Your Journey"}
            </h2>
            <p className="text-gray-400">
              {isSignIn ? "Sign in to continue practicing" : "Join thousands of successful professionals"}
            </p>
          </motion.div>

          {/* Form */}
          <div className="relative">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6"
              >
                {!isSignIn && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
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
                  transition={{ duration: 0.5, delay: isSignIn ? 0.5 : 0.6 }}
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
                  transition={{ duration: 0.5, delay: isSignIn ? 0.6 : 0.7 }}
                  className="space-y-2"
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
                      className="space-y-2"
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
                      <div className="flex items-center justify-between text-xs">
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
                        <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-xs text-gray-400 mb-2">Password should contain:</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
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
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50" 
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
            <div className="text-center mt-6">
              <p className="text-gray-400">
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
      </motion.div>
    </div>
  );
};

export default AuthForm;
