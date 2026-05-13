import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router";
import { authClient } from "@bonne-garde/spa/lib/auth";
import { Alert, AlertDescription } from "@bonne-garde/ui/components/alert";
import { Loader2 } from "lucide-react";

export default function AuthVerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const hasVerified = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Token de vérification manquant.");
      return;
    }

    // Prevent double verification in React Strict Mode
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verifyEmail = async () => {
      try {
        const { error } = await authClient.verifyEmail({ query: { token } });

        if (error) {
          setStatus("error");
          setErrorMessage(error.message || "Erreur lors de la vérification");
        } else {
          setStatus("success");
        }
      } catch {
        setStatus("error");
        setErrorMessage("Erreur réseau. Veuillez réessayer.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Vérification de l'email</h2>
      </div>

      {status === "loading" && (
        <div className="flex flex-col items-center gap-4 py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Vérification en cours...</p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-4">
          <Alert>
            <AlertDescription>Votre email a été vérifié avec succès !</AlertDescription>
          </Alert>
          <Link
            to="/auth/login"
            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            Se connecter
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
          <Link
            to="/auth/login"
            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            Retour à la connexion
          </Link>
        </div>
      )}
    </div>
  );
}
