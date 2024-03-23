import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';

interface OTPInputProps {
  length?: number;
  onChange?: (otp: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ length = 8, onChange }) => {
  const [otp, setOTP] = useState<string[]>(new Array(length).fill(''));
  const otpInputs = useRef<HTMLInputElement[] | null[]>([]);

  const handleChange = (index: number, value: string) => {
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);
    if (onChange) {
      onChange(newOTP.join(''));
    }
    // Move to the next input field if not empty
    if (value && otpInputs.current[index + 1]) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '') {
      // Move to the previous input field if backspace is pressed and current input is empty
      if (otpInputs.current[index - 1]) {
        otpInputs.current[index - 1]?.focus();
      }
    }
  };

//   const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
//     e.preventDefault();
//     const pasteData = e.clipboardData?.getData('text/plain').trim() || '';
//     const newOTP = [...otp];
//     if (pasteData.length === length) {
//       for (let i = 0; i < length; i++) {
//         newOTP[i] = pasteData[i];
//       }
//       setOTP(newOTP);
//       if (onChange) {
//         onChange(newOTP.join(''));
//       }
//     }
//   };

  return (
    <div className='flex flex-row justify-center'>
      {otp.map((value, index) => (
        <input
            className='w-[32px] mr-2'
          key={index}
          type="text"
          maxLength={1}
          value={value}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
        //   onPaste={handlePaste}
          ref={(el) => (otpInputs.current[index] = el)}
        />
      ))}
    </div>
  );
};

export default OTPInput;
