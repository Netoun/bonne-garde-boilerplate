import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@bonne-garde/spa/lib/auth";
import { Button } from "@bonne-garde/ui/components/button";
import { Input } from "@bonne-garde/ui/components/input";
import { Label } from "@bonne-garde/ui/components/label";
import { Alert, AlertDescription } from "@bonne-garde/ui/components/alert";
import { registerSchema, type RegisterSchema } from "../validation";

export default function AuthRegister() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    setError("");
    setSuccess(false);

    try {
      const { error: signUpError } = await authClient.signUp.email({
        email: data.email.trim(),
        password: data.password,
        name: data.name.trim(),
      });

      if (signUpError) {
        setError(signUpError.message || "Erreur lors de l'inscription");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    }
  };

  if (success) {
    return (
      <div className="w-full space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Inscription réussie</h2>
        </div>
        <Alert>
          <AlertDescription>
            Un email de vérification vous a été envoyé. Veuillez consulter votre boîte de réception.
          </AlertDescription>
        </Alert>
        <Link
          to="/auth/login"
          className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Aller à la connexion
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Créer un compte</h2>
        <p className="text-muted-foreground">Inscrivez-vous pour commencer</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">Nom</Label>
          <Input
            id="name"
            type="text"
            placeholder="Votre nom"
            {...register("name")}
            disabled={isSubmitting}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

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

        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" type="password" {...register("password")} disabled={isSubmitting} />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            disabled={isSubmitting}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Inscription..." : "S'inscrire"}
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Déjà un compte ? </span>
        <Link to="/auth/login" className="text-primary hover:underline">
          Se connecter
        </Link>
      </div>
    </div>
  );
}
