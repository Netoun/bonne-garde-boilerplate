import { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { authClient } from "@bonne-garde/spa/lib/auth";

function isAuthRoute(pathname: string): boolean {
  const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/verify-email",
    "/auth/forgot-password",
    "/auth/reset-password",
  ];
  return authRoutes.some((route) => pathname.startsWith(route));
}

function isSpecialAuthRoute(pathname: string): boolean {
  const specialAuthRoutes = ["/auth/accept-invitation"];
  return specialAuthRoutes.some((route) => pathname.startsWith(route));
}

export function useAuthRedirect() {
  const { data: sessionData, isPending } = authClient.useSession();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (
      !isPending &&
      !sessionData &&
      !isAuthRoute(location.pathname) &&
      !isSpecialAuthRoute(location.pathname)
    ) {
      const redirectUrl = encodeURIComponent(location.pathname + location.search);
      navigate(`/auth/login?redirect=${redirectUrl}`);
    }

    if (
      !isPending &&
      sessionData &&
      isAuthRoute(location.pathname) &&
      !isSpecialAuthRoute(location.pathname)
    ) {
      const redirectParams = searchParams.get("redirect");
      if (redirectParams) {
        const redirect = decodeURIComponent(redirectParams);
        navigate(redirect);
      } else {
        navigate("/dashboard");
      }
    }
  }, [sessionData, navigate, isPending, location.pathname, location.search, searchParams]);
}
