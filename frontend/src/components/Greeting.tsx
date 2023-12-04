import { createSignal, onCleanup } from "solid-js";

/** Tiny visual flare to randomly return LEET or 1337, or something in between. */
function randomLeet() {
  return [
    ["L", "1"],
    ["E", "3"],
    ["E", "3"],
    ["T", "7"],
  ].reduce((acc, cur) => acc + cur[Math.round(Math.random())], "");
}

/**
 * Greets the user with a title & message, and has a button to start a session.
 * @param props a Setter to update the session id
 */
export default function Greeting(props: { newSession: () => Promise<void> }) {
  const [leetTitle, setLeetTitle] = createSignal("LEET");
  const [isLoading, setIsLoading] = createSignal(false);

  const interval = setInterval(() => setLeetTitle(randomLeet()), 1000);
  onCleanup(() => clearInterval(interval));

  async function handleClick() {
    setIsLoading(true);
    await props.newSession();
    setIsLoading(false);
  }

  return (
    <div class="hero min-h-screen bg-base-200">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-8xl font-bold hover:text-primary">{leetTitle()}</h1>
          <h1 class="text-7xl font-bold hover:text-amber-500">Assistant</h1>
          <p class="text-xl py-6">
            A personalized leet-code assistant, guiding you about problems to solve based on your performance &
            interests. <br />
            <br />
            Click below to start a session and solve questions in a personalized way!
          </p>

          <button
            class={isLoading() ? "btn btn-primary btn-lg btn-disabled" : "btn btn-primary btn-lg"}
            onClick={() => {
              if (!isLoading()) handleClick();
            }}
          >
            {isLoading() ? (
              <>
                Just a second <span class="loading loading-spinner"></span>
              </>
            ) : (
              "Start Session"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
