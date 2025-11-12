'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm } from '@/hooks';

interface CheckoutFormData {
  name: string;
  phoneNumber: string;
  email: string;
  district: string;
  upazila: string;
  thana: string;
  postOffice: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CheckoutFormData) => void;
}

const validationSchema = (values: CheckoutFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!values.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!values.phoneNumber.trim()) {
    errors.phoneNumber = 'Phone number is required';
  } else if (!/^[0-9+\-\s()]+$/.test(values.phoneNumber)) {
    errors.phoneNumber = 'Invalid phone number';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (!values.district.trim()) {
    errors.district = 'District is required';
  }

  if (!values.upazila.trim()) {
    errors.upazila = 'Upazila is required';
  }

  if (!values.thana.trim()) {
    errors.thana = 'Thana is required';
  }

  if (!values.postOffice.trim()) {
    errors.postOffice = 'Post office is required';
  }

  return errors;
};

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { values, errors, handleChange, handleBlur, handleSubmit, touched, reset } = useForm<CheckoutFormData>(
    {
      name: '',
      phoneNumber: '',
      email: '',
      district: '',
      upazila: '',
      thana: '',
      postOffice: '',
    },
    validationSchema
  );

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit((formData) => {
      // Log all form data
      console.log('Form submitted with data:', formData);
      
      // Submit the form (parent will handle closing modal)
      onSubmit(formData);
      
      // Reset form after successful submission
      reset();
    })(e);
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop ppp*/}
      <div
        className="fixed inset-0 bg-black/50 z-[80]"
        onClick={onClose}
      />

      {/* Modal - Right Side Positioning like Cart Dropdown */}
      <div className="fixed top-0 right-0 h-screen w-[90vw] flex justify-center items-start pt-20 z-[90]">
        <div
          className="bg-white rounded-xl max-w-[960px] w-full max-h-[80vh] overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center hover:opacity-80 transition-opacity"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5 text-zinc-600" strokeWidth={2.5} />
          </button>

          {/* Form Content */}
          <form onSubmit={onFormSubmit} className="px-[72px] py-[73px] flex flex-col items-center gap-8">
            {/* Form Fields */}
            <div className="w-full max-w-[808px] flex flex-col gap-5">
              {/* Name Field */}
              <div className="flex flex-col gap-2">
                <label className="text-neutral-800 text-base font-medium font-['Poppins'] leading-5">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Type name here..."
                  className="w-full p-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-400 text-base font-normal font-['Poppins'] leading-5 text-zinc-600 focus:outline-fuchsia-500 focus:outline-2 transition-all"
                />
                {touched.name && errors.name && (
                  <span className="text-red-600 text-sm">{errors.name}</span>
                )}
              </div>

              {/* Phone Number Field */}
              <div className="flex flex-col gap-2">
                <label className="text-neutral-800 text-base font-medium font-['Poppins'] leading-5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={values.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Type phone number here..."
                  className="w-full h-12 p-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-400 text-base font-normal font-['Poppins'] leading-5 text-zinc-600 focus:outline-fuchsia-500 focus:outline-2 transition-all"
                />
                {touched.phoneNumber && errors.phoneNumber && (
                  <span className="text-red-600 text-sm">{errors.phoneNumber}</span>
                )}
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <label className="text-neutral-800 text-base font-medium font-['Poppins'] leading-5">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Type email here..."
                  className="w-full h-12 p-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-400 text-base font-normal font-['Poppins'] leading-5 text-zinc-600 focus:outline-fuchsia-500 focus:outline-2 transition-all"
                />
                {touched.email && errors.email && (
                  <span className="text-red-600 text-sm">{errors.email}</span>
                )}
              </div>

              {/* District Field */}
              <div className="flex flex-col gap-2">
                <label className="text-neutral-800 text-base font-medium font-['Poppins'] leading-5">
                  District
                </label>
                <input
                  type="text"
                  name="district"
                  value={values.district}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Type district here..."
                  className="w-full h-12 p-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-400 text-base font-normal font-['Poppins'] leading-5 text-zinc-600 focus:outline-fuchsia-500 focus:outline-2 transition-all"
                />
                {touched.district && errors.district && (
                  <span className="text-red-600 text-sm">{errors.district}</span>
                )}
              </div>

              {/* Upazila Field */}
              <div className="flex flex-col gap-2">
                <label className="text-neutral-800 text-base font-medium font-['Poppins'] leading-5">
                  Upazila
                </label>
                <input
                  type="text"
                  name="upazila"
                  value={values.upazila}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Type upazila here..."
                  className="w-full h-12 p-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-400 text-base font-normal font-['Poppins'] leading-5 text-zinc-600 focus:outline-fuchsia-500 focus:outline-2 transition-all"
                />
                {touched.upazila && errors.upazila && (
                  <span className="text-red-600 text-sm">{errors.upazila}</span>
                )}
              </div>

              {/* Thana Field */}
              <div className="flex flex-col gap-2">
                <label className="text-neutral-800 text-base font-medium font-['Poppins'] leading-5">
                  Thana
                </label>
                <input
                  type="text"
                  name="thana"
                  value={values.thana}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Type thana here..."
                  className="w-full h-12 p-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-400 text-base font-normal font-['Poppins'] leading-5 text-zinc-600 focus:outline-fuchsia-500 focus:outline-2 transition-all"
                />
                {touched.thana && errors.thana && (
                  <span className="text-red-600 text-sm">{errors.thana}</span>
                )}
              </div>

              {/* Post Office Field */}
              <div className="flex flex-col gap-2">
                <label className="text-neutral-800 text-base font-medium font-['Poppins'] leading-5">
                  Post office
                </label>
                <input
                  type="text"
                  name="postOffice"
                  value={values.postOffice}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Type post office here..."
                  className="w-full h-12 p-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-400 text-base font-normal font-['Poppins'] leading-5 text-zinc-600 focus:outline-fuchsia-500 focus:outline-2 transition-all"
                />
                {touched.postOffice && errors.postOffice && (
                  <span className="text-red-600 text-sm">{errors.postOffice}</span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full max-w-[808px] h-12 px-6 py-3 bg-fuchsia-500 rounded-lg flex justify-center items-center gap-2.5 hover:bg-fuchsia-600 transition-colors"
            >
              <span className="text-white text-base font-medium font-['Inter'] leading-5">
                Confirm
              </span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

