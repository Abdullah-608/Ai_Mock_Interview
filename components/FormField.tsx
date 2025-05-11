import { FC, useState } from "react";
import { motion } from "framer-motion";
import {
  FormControl,
  FormField as UIFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface FormFieldProps {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  type: string;
}

const FormField: FC<FormFieldProps> = ({
  control,
  name,
  label,
  placeholder,
  type,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <UIFormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-300 font-medium">{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <motion.div
                whileFocus={{ scale: 1.02 }}
                className={`relative border rounded-md ${
                  isFocused ? "ring-2 ring-primary-100/50" : ""
                }`}
              >
                <Input
                  placeholder={placeholder}
                  {...field}
                  type={
                    type === "password" ? (showPassword ? "text" : "password") : type
                  }
                  className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
                {type === "password" && (
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOffIcon size={18} />
                    ) : (
                      <EyeIcon size={18} />
                    )}
                  </button>
                )}
              </motion.div>
            </div>
          </FormControl>
          <FormMessage className="text-red-400 text-sm" />
        </FormItem>
      )}
    />
  );
};

export default FormField;