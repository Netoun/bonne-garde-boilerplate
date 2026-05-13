import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@bonne-garde/spa/lib/auth";
import { Button } from "@bonne-garde/ui/components/button";
import { Input } from "@bonne-garde/ui/components/input";
import { Label } from "@bonne-garde/ui/components/label";
import { Alert, AlertDescription } from "@bonne-garde/ui/components/alert";
import { resetPasswordSchema, type ResetPasswordSchema } from "../validation";

export default function AuthResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (!token) {
      setError("Token de réinitialisation manquant ou invalide.");
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordSchema) => {
    if (!token) return;

    setError("");
    setSuccess(false);

    try {
      const { error: resetError } = await authClient.resetPassword({
        newPassword: data.password,
        token,
      });

      if (resetError) {
        setError(resetError.message || "Erreur lors de la réinitialisation");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    }
  };

  if (success) {
    return (
      <div className="w-full space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Mot de passe réinitialisé</h2>
        </div>
        <Alert>
          <AlertDescription>
            Votre mot de passe a été réinitialisé avec succès. Redirection vers la connexion...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Réinitialiser le mot de passe</h2>
        <p className="text-muted-foreground">Choisissez un nouveau mot de passe</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="password">Nouveau mot de passe</Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            disabled={isSubmitting || !token}
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            disabled={isSubmitting || !token}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting || !token}>
          {isSubmitting ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
        </Button>

        <div className="text-center text-sm">
          <Link to="/auth/login" className="text-primary hover:underline">
            Retour à la connexion
          </Link>
        </div>
      </form>
    </div>
  );
}
