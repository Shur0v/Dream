'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
  isSubmitting?: boolean;
  initialValues?: Partial<CheckoutFormData>;
  hideContactFields?: boolean;
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

// Stable initial values object (outside component to prevent recreation)
const defaultCheckoutFormData: CheckoutFormData = {
  name: '',
  phoneNumber: '',
  email: '',
  district: '',
  upazila: '',
  thana: '',
  postOffice: '',
};

type DistrictApiItem = {
  district?: string;
  name?: string;
  district_name?: string;
};

type DistrictDetailApiItem = {
  upazilla?: string;
  upazila?: string;
  thana?: string;
  postOffice?: string;
  post_office?: string;
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  initialValues,
  hideContactFields = false,
}) => {
  const { values, setValues, errors, handleBlur, handleSubmit, touched, reset } = useForm<CheckoutFormData>(
    defaultCheckoutFormData,
    validationSchema
  );
  const [districtOptions, setDistrictOptions] = useState<string[]>([]);
  const [districtDetails, setDistrictDetails] = useState<DistrictDetailApiItem[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

  const upazilaOptions = useMemo(() => {
    const set = new Set<string>();
    districtDetails.forEach((item) => {
      const name = (item.upazilla || item.upazila || '').trim();
      if (name) set.add(name);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [districtDetails]);

  const thanaOptions = useMemo(() => {
    const set = new Set<string>();
    districtDetails.forEach((item) => {
      const inUpazila = !values.upazila || (item.upazilla || item.upazila || '').trim() === values.upazila.trim();
      if (!inUpazila) return;
      const thanaName = (item.thana || item.upazilla || item.upazila || '').trim();
      if (thanaName) set.add(thanaName);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [districtDetails, values.upazila]);

  const postOfficeOptions = useMemo(() => {
    const set = new Set<string>();
    districtDetails.forEach((item) => {
      const inUpazila = !values.upazila || (item.upazilla || item.upazila || '').trim() === values.upazila.trim();
      const inThana = !values.thana || (item.thana || item.upazilla || item.upazila || '').trim() === values.thana.trim();
      if (!inUpazila || !inThana) return;
      const po = (item.postOffice || item.post_office || '').trim();
      if (po) set.add(po);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [districtDetails, values.upazila, values.thana]);

  const isValidSelection = (value: string, options: string[]) => options.includes(value.trim());

  const normalizeDistrictValue = (item: DistrictApiItem): string =>
    (item.district || item.name || item.district_name || '').trim();

  const fetchDistricts = async () => {
    setLocationLoading(true);
    setLocationError('');
    try {
      const response = await fetch('https://bdapis.com/api/v1.2/districts');
      if (!response.ok) throw new Error(`District API failed: ${response.status}`);
      const result = await response.json();
      const rows = Array.isArray(result?.data) ? result.data : Array.isArray(result) ? result : [];
      const districts: string[] = rows
        .map((item: DistrictApiItem) => normalizeDistrictValue(item))
        .filter(isNonEmptyString);
      setDistrictOptions(Array.from(new Set<string>(districts)).sort((a, b) => a.localeCompare(b)));
    } catch (error: any) {
      console.error('Failed to load district list:', error);
      setDistrictErrorFallback();
      setLocationError('Location data API unavailable. Using fallback district list.');
    } finally {
      setLocationLoading(false);
    }
  };

  const setDistrictErrorFallback = () => {
    setDistrictOptions([
      'Dhaka',
      'Chattogram',
      'Rajshahi',
      'Khulna',
      'Barishal',
      'Sylhet',
      'Rangpur',
      'Mymensingh',
    ]);
  };

  const fetchDistrictDetails = async (district: string) => {
    if (!district) {
      setDistrictDetails([]);
      return;
    }
    setLocationLoading(true);
    setLocationError('');
    try {
      const response = await fetch(`https://bdapis.com/api/v1.2/district/${encodeURIComponent(district)}`);
      if (!response.ok) throw new Error(`District detail API failed: ${response.status}`);
      const result = await response.json();
      const rows = Array.isArray(result?.data) ? result.data : Array.isArray(result) ? result : [];
      setDistrictDetails(rows as DistrictDetailApiItem[]);
    } catch (error: any) {
      console.error('Failed to load district details:', error);
      setDistrictDetails([]);
      setLocationError('Could not load upazila/thana/post office list for selected district.');
    } finally {
      setLocationLoading(false);
    }
  };

  const updateField = (name: keyof CheckoutFormData, value: string) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const enforceSelectionOrClear = (name: keyof CheckoutFormData, options: string[]) => {
    const current = values[name].trim();
    if (!current) return;
    if (!isValidSelection(current, options)) {
      updateField(name, '');
    }
  };

  const handleDistrictInput = (value: string) => {
    updateField('district', value);
    updateField('upazila', '');
    updateField('thana', '');
    updateField('postOffice', '');
    setDistrictDetails([]);

    if (districtOptions.includes(value.trim())) {
      void fetchDistrictDetails(value.trim());
    }
  };

  const handleUpazilaInput = (value: string) => {
    updateField('upazila', value);
    updateField('thana', '');
    updateField('postOffice', '');
  };

  const handleThanaInput = (value: string) => {
    updateField('thana', value);
    updateField('postOffice', '');
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidSelection(values.district, districtOptions)) {
      alert('Please select a valid district from the dropdown list.');
      return;
    }
    if (!isValidSelection(values.upazila, upazilaOptions)) {
      alert('Please select a valid upazila from the dropdown list.');
      return;
    }
    if (!isValidSelection(values.thana, thanaOptions)) {
      alert('Please select a valid thana from the dropdown list.');
      return;
    }
    if (!isValidSelection(values.postOffice, postOfficeOptions)) {
      alert('Please select a valid post office from the dropdown list.');
      return;
    }

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
    void fetchDistricts();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setValues({
        ...defaultCheckoutFormData,
        ...initialValues,
      });
      if (initialValues?.district && districtOptions.includes(initialValues.district)) {
        void fetchDistrictDetails(initialValues.district);
      }
    } else {
      reset();
      setDistrictDetails([]);
    }
  }, [isOpen, initialValues, reset, setValues, districtOptions]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop ppp*/}
      <div
        className="fixed inset-0 bg-black/50 z-[80]"
        onClick={onClose}
      />

      {/* Centered Modal */}
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-4">
        <div
          className="relative w-full max-w-[920px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5 text-zinc-700" strokeWidth={2.5} />
          </button>

          {/* Form Content */}
          <form onSubmit={onFormSubmit} className="px-4 py-5 sm:px-8 sm:py-8 md:px-10 md:py-10 flex flex-col gap-6">
            <div className="pr-10">
              <h2 className="text-zinc-900 text-2xl sm:text-3xl font-semibold font-['Poppins'] leading-tight">
                Complete Your Order
              </h2>
              <p className="mt-1 text-zinc-500 text-sm sm:text-base font-normal font-['Poppins']">
                Please fill in your details to place the order
              </p>
            </div>

            {/* Form Fields */}
            <div className="w-full rounded-xl border border-zinc-200 bg-white p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-7 h-7 rounded-full bg-fuchsia-500 text-white text-sm font-semibold font-['Poppins'] flex items-center justify-center">
                  1
                </div>
                <h3 className="text-zinc-900 text-xl font-semibold font-['Poppins']">Delivery Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {!hideContactFields && (
                <>
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
                      className="w-full h-12 p-3 rounded-lg border border-zinc-300 text-base font-normal font-['Poppins'] leading-5 text-zinc-700 placeholder:text-zinc-400 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200 transition-all"
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
                      className="w-full h-12 p-3 rounded-lg border border-zinc-300 text-base font-normal font-['Poppins'] leading-5 text-zinc-700 placeholder:text-zinc-400 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200 transition-all"
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
                      className="w-full h-12 p-3 rounded-lg border border-zinc-300 text-base font-normal font-['Poppins'] leading-5 text-zinc-700 placeholder:text-zinc-400 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200 transition-all"
                    />
                    {touched.email && errors.email && (
                      <span className="text-red-600 text-sm">{errors.email}</span>
                    )}
                  </div>
                </>
              )}

              {/* District Field */}
              <div className="flex flex-col gap-2">
                <label className="text-neutral-800 text-base font-medium font-['Poppins'] leading-5">
                  District
                </label>
                <input
                  type="text"
                  name="district"
                  value={values.district}
                  onChange={(e) => handleDistrictInput(e.target.value)}
                  onBlur={(e) => {
                    handleBlur(e as any);
                    enforceSelectionOrClear('district', districtOptions);
                  }}
                  placeholder="Search district and select..."
                  list="district-options"
                  className="w-full h-12 p-3 rounded-lg border border-zinc-300 text-base font-normal font-['Poppins'] leading-5 text-zinc-700 placeholder:text-zinc-400 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200 transition-all"
                />
                <datalist id="district-options">
                  {districtOptions.map((district) => (
                    <option key={district} value={district} />
                  ))}
                </datalist>
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
                  onChange={(e) => handleUpazilaInput(e.target.value)}
                  onBlur={(e) => {
                    handleBlur(e as any);
                    enforceSelectionOrClear('upazila', upazilaOptions);
                  }}
                  placeholder="Search upazila and select..."
                  list="upazila-options"
                  disabled={!values.district || !districtOptions.includes(values.district)}
                  className="w-full h-12 p-3 rounded-lg border border-zinc-300 text-base font-normal font-['Poppins'] leading-5 text-zinc-700 placeholder:text-zinc-400 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200 transition-all disabled:bg-zinc-100 disabled:text-zinc-400"
                />
                <datalist id="upazila-options">
                  {upazilaOptions.map((upazila) => (
                    <option key={upazila} value={upazila} />
                  ))}
                </datalist>
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
                  onChange={(e) => handleThanaInput(e.target.value)}
                  onBlur={(e) => {
                    handleBlur(e as any);
                    enforceSelectionOrClear('thana', thanaOptions);
                  }}
                  placeholder="Search thana and select..."
                  list="thana-options"
                  disabled={!values.upazila || !upazilaOptions.includes(values.upazila)}
                  className="w-full h-12 p-3 rounded-lg border border-zinc-300 text-base font-normal font-['Poppins'] leading-5 text-zinc-700 placeholder:text-zinc-400 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200 transition-all disabled:bg-zinc-100 disabled:text-zinc-400"
                />
                <datalist id="thana-options">
                  {thanaOptions.map((thana) => (
                    <option key={thana} value={thana} />
                  ))}
                </datalist>
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
                  onChange={(e) => updateField('postOffice', e.target.value)}
                  onBlur={(e) => {
                    handleBlur(e as any);
                    enforceSelectionOrClear('postOffice', postOfficeOptions);
                  }}
                  placeholder="Search post office and select..."
                  list="post-office-options"
                  disabled={!values.thana || !thanaOptions.includes(values.thana)}
                  className="w-full h-12 p-3 rounded-lg border border-zinc-300 text-base font-normal font-['Poppins'] leading-5 text-zinc-700 placeholder:text-zinc-400 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200 transition-all disabled:bg-zinc-100 disabled:text-zinc-400"
                />
                <datalist id="post-office-options">
                  {postOfficeOptions.map((postOffice) => (
                    <option key={postOffice} value={postOffice} />
                  ))}
                </datalist>
                {touched.postOffice && errors.postOffice && (
                  <span className="text-red-600 text-sm">{errors.postOffice}</span>
                )}
              </div>
              {(locationLoading || locationError) && (
                <div className="text-sm">
                  {locationLoading && <span className="text-zinc-600">Loading location options...</span>}
                  {!locationLoading && locationError && <span className="text-amber-600">{locationError}</span>}
                </div>
              )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 px-6 py-3 bg-fuchsia-500 rounded-lg flex justify-center items-center gap-2.5 hover:bg-fuchsia-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white text-base font-semibold font-['Poppins']"
            >
              {isSubmitting ? 'Submitting...' : 'Confirm'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

