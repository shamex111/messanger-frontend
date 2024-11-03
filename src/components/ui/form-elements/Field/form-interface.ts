import { InputHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";

export interface IField extends InputHTMLAttributes<HTMLInputElement> {
    placeholder: string;
    error?: FieldError;
  }