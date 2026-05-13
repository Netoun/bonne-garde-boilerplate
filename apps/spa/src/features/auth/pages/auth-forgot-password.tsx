import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@bonne-garde/spa/lib/auth";
import { Button } from "@bonne-garde/ui/components/button";
import { Input } from "@bonne-garde/ui/components/input";
import { Label } from "@bonne-garde/ui/components/label";
import { Alert, AlertDescription } from "@bonne-garde/ui/components/alert";
import { forgotPasswordSchema, type ForgotPasswordSchema } from "../validation";

export default function AuthForgotPassword() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    setError("");
    setSuccess(false);

    try {
      await authClient.requestPasswordReset({
        email: data.email.trim(),
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      setSuccess(true);
    } catch {
      setError("Erreur lors de l'envoi. Veuillez réessayer.");
    }
  };

  if (success) {
    return (
      <div className="w-full space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Réinitialisation envoyée</h2>
        </div>
        <Alert>
          <AlertDescription>
            Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.
          </AlertDescription>
        </Alert>
        <Link
          to="/auth/login"
          className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Mot de passe oublié</h2>
        <p className="text-muted-foreground">
          Entrez votre email pour recevoir un lien de réinitialisation
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="votre@email.com"
            {...register("email")}
            disabled={isSubmitting}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Envoi..." : "Envoyer le lien"}
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
