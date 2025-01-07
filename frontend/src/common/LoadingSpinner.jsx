import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <Button
      disabled
      className="shad-primary-btn w-full text-white bg-green-500"
    >
      <Loader2 className="animate-spin" />
      Please wait
    </Button>
  );
};

export default LoadingSpinner;
