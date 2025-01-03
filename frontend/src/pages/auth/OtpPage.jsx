import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import React, { useEffect, useState } from "react";

export const OtpPage = () => {
  const [otp, setOtp] = useState("");
  const [isOtpComplete, setIsOtpComplete] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    // Check if all OTP fields are filled
    setIsOtpComplete(otp.length === 6);
  }, [otp]);

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const handleVerify = () => {
    console.log("Entered OTP:", otp);
  };

  useEffect(() => {
    let timerId;
    if (!canResend) {
      timerId = setInterval(() => {
        setCountdown(countdown - 1);
        if (countdown === 0) {
          setCanResend(true);
          clearInterval(timerId);
        }
      }, 1000);
    }
    return () => {
      clearInterval(timerId);
    };
  }, [canResend, countdown]);

  const handleResendOtp = () => {};
  return (
    <div>
      {" "}
      <DialogHeader>
        <DialogTitle>Enter OTP</DialogTitle>
        <DialogDescription>
          Please enter your OTP sended to your phone number
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            onChange={handleOtpChange}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>
      <DialogFooter>
        <Button
          type="submit"
          className="text-white border-white hover:bg-green-700 min-[640px]:mr-10 max-[639px]:mt-4"
          onClick={handleResendOtp}
          disabled={!canResend}
        >
          {canResend ? "Resend OTP" : `Resend in ${formatCountdown(countdown)}`}
        </Button>
        <Button
          type="submit"
          className="text-white bg-green-500 hover:bg-green-700"
          onClick={handleVerify}
          disabled={!isOtpComplete}
        >
          Verify
        </Button>
      </DialogFooter>
    </div>
  );
};

const formatCountdown = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${
    minutes > 0 ? `${minutes} minute${minutes > 1 ? "s" : ""} ` : ""
  }${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""}`;
};
