import { Button } from "@/components/ui/button";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const OtpPage = () => {
  const queryClient = useQueryClient();

  const [otp, setOtp] = useState("");
  const [isOtpComplete, setIsOtpComplete] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false); // Add verifying state

  useEffect(() => {
    setIsOtpComplete(otp.length === 6);
  }, [otp]);

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  useEffect(() => {
    let timerId;
    if (!canResend) {
      timerId = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 1) {
            setCanResend(true);
            clearInterval(timerId);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(timerId);
    };
  }, [canResend]);

  const { mutate: verifyOtp, isVerifying: isVerifyingOtp } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/verifyOtp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otp }),
        });
        const data = await res.json();

        console.log(data);
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Redirect to next page or perform next action
      if (data.error) {
        setIsVerifying(false);
        return toast.error(data.error);
      }
      toast.success("OTP verified successfully!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (data) => {
      toast.error(data.error);
    },
  });

  const {
    mutate: resendOtp,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/resendOtp", {
          method: "POST",
        });
        const data = await res.json();

        if (data.message) {
          setEmailMsg(data.message);
        }

        if (!res.ok && !data.message) {
          throw new Error(data.error || "Something went wrong!");
        }
        console.log(data);
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      setCanResend(false);
      setCountdown(60);
      setIsVerifying(false);
      toast.success("OTP Resent successfully!");
    },
  });

  const handleResendOtp = () => {
    setCanResend(false);
    resendOtp();
  };

  const handleVerify = () => {
    setIsVerifying(true);
    verifyOtp();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-black shadow-xl rounded-lg p-8 max-w-md w-full">
        <h2 className="text-xl font-semibold text-center mb-2 text-white">
          Verify OTP
        </h2>
        <p className="text-sm text-center text-gray-600 mb-4">
          Please enter the 6-digit OTP sent to your mobile number.
        </p>
        <div className="grid gap-6 py-4">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              onChange={handleOtpChange}
              className="w-full"
            >
              <InputOTPGroup className="flex gap-2">
                {[...Array(6)].map((_, index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="flex justify-between mt-4">
            <Button
              type="button"
              className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
              onClick={handleResendOtp}
              disabled={!canResend}
            >
              {canResend
                ? "Resend OTP"
                : `Resend in ${formatCountdown(countdown)}`}
            </Button>
            <Button
              type="button"
              className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
              onClick={handleVerify}
              disabled={!isOtpComplete || isVerifying}
            >
              {isVerifying ? "Loading.." : "Verify"}
            </Button>
          </div>
        </div>
      </div>
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
