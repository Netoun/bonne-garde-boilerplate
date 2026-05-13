import { type MetaFunction } from "react-router";

export const meta: MetaFunction = () => [{ title: "Bonne Garde" }];

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Bonne Garde</h1>
        <p className="text-xl text-muted-foreground">Coming soon</p>
      </div>
    </div>
  );
}
