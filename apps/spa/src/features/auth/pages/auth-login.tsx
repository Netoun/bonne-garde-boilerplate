import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@bonne-garde/spa/lib/auth";
import { Button } from "@bonne-garde/ui/components/button";
import { Input } from "@bonne-garde/ui/components/input";
import { Label } from "@bonne-garde/ui/components/label";
import { Alert, AlertDescription } from "@bonne-garde/ui/components/alert";
import { loginSchema, type LoginSchema } from "../validation";

export default function AuthLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    setError("");

    try {
      const { error: signInError } = await authClient.signIn.email({
        email: data.email.trim(),
        password: data.password,
      });

      if (signInError) {
        setError("Email ou mot de passe incorrect");
        return;
      }

      navigate("/dashboard");
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Connexion</h2>
        <p className="text-muted-foreground">Connectez-vous à votre compte</p>
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

        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" type="password" {...register("password")} disabled={isSubmitting} />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <div className="text-right">
          <Link
            to="/auth/forgot-password"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Pas encore de compte ? </span>
        <Link to="/auth/register" className="text-primary hover:underline">
          S'inscrire
        </Link>
      </div>
    </div>
  );
}
