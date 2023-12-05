import { A } from "solid-start";
import { HttpStatusCode } from "solid-start/server";

export default function NotFound() {
  // TODO: redirect back to home
  return (
    <>
      <HttpStatusCode code={404} />
      <main class="container mx-auto h-center">
        <h1 class="text-center text-primary mt-10">Not Found</h1>
      </main>
    </>
  );
}
