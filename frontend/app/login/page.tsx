"use client";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      console.error("NEXT_PUBLIC_API_URL is not configured");
      return;
    }

    window.location.href = `${apiUrl}/api/auth/google`;
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-[524px] rounded-[16px] border border-gray-200 bg-white px-[60px] py-[58px]">
        <h1 className="mb-8 text-center text-[42px] font-semibold leading-tight text-[#202124]">
          Login
        </h1>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex h-[52px] w-full items-center justify-center gap-3 rounded-[12px] bg-[#e1f5eb] text-[16px] font-medium text-[#202124] transition hover:bg-[#d5efe3]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M21.35 12.27c0-.79-.07-1.55-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.42Z"
            />
            <path
              fill="#34A853"
              d="M12 21.75c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.7-1.72-5.47-4.03H3.28v2.53A9.75 9.75 0 0 0 12 21.75Z"
            />
            <path
              fill="#FBBC05"
              d="M6.53 13.84A5.86 5.86 0 0 1 6.22 12c0-.64.11-1.26.31-1.84V7.63H3.28A9.74 9.74 0 0 0 2.25 12c0 1.57.38 3.06 1.03 4.37l3.25-2.53Z"
            />
            <path
              fill="#EA4335"
              d="M12 6.13c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.23 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.72 5.38l3.25 2.53C7.3 7.85 9.46 6.13 12 6.13Z"
            />
          </svg>
          Login with Google
        </button>

        <div className="my-7 flex items-center gap-5">
          <div className="h-px flex-1 bg-gray-200" />

          <span className="text-sm text-gray-400">
            or sign up through email
          </span>

          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <input
          type="email"
          placeholder="Email ID"
          disabled
          className="mb-3 h-[60px] w-full cursor-not-allowed rounded-[12px] bg-[#f3f5f4] px-5 text-[16px] text-gray-400 outline-none placeholder:text-gray-400"
        />

        <input
          type="password"
          placeholder="Password"
          disabled
          className="h-[60px] w-full cursor-not-allowed rounded-[12px] bg-[#f3f5f4] px-5 text-[16px] text-gray-400 outline-none placeholder:text-gray-400"
        />

        <button
          type="button"
          disabled
          className="mt-7 h-[52px] w-full cursor-not-allowed rounded-[12px] bg-[#00b341]/50 text-[16px] font-medium text-white"
        >
          Login
        </button>
      </div>
    </main>
  );
}
