import { PageHeader } from "../../layout/components/layout-page-header";

export const handle = {
  header: PageHeader,
};

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
      <p className="text-muted-foreground">
        Bienvenue sur Bonne Garde. Commencez par configurer votre organisation.
      </p>
    </div>
  );
}
