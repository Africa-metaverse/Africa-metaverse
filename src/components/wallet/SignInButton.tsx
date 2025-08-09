import { useState } from "react";
import Image from "next/image";
import { useLoginWithAbstract } from "@abstract-foundation/agw-react";

export function SignInButton() {
  const { login } = useLoginWithAbstract();
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setConnecting(true);
    try {
      await login();
    } catch {
      setError("Failed to connect. Please try again or check your wallet.");
    } finally {
      setConnecting(false);
    }
  };

  if (connecting) {
    return (
      <div className="flex items-center justify-center w-10 h-10">
        <div className="animate-spin">
          <Image src="/abs.svg" alt="Loading" width={24} height={24} />
        </div>
        <span className="ml-2 text-sm text-gray-500">Connecting...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] hover:text-white hover:cursor-pointer dark:hover:bg-[#e0e0e0] dark:hover:text-black text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 font-[family-name:var(--font-roobert)]"
        onClick={handleLogin}
      >
        <Image
          className="dark:invert"
          src="/abs.svg"
          alt="Abstract logomark"
          width={20}
          height={20}
          style={{ filter: "brightness(0)" }}
        />
        Sign in with Abstract
      </button>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
}
