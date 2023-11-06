import { Show, createResource, createSignal } from "solid-js";
import { Title } from "solid-start";

export default function Home() {
  const [data, setData] = createSignal<any>(undefined);

  return (
    <main>
      <Title>Leet Assistant</Title>

      <button
        onClick={() => {
          fetch("http://localhost:3001/ai?prompt=hello")
            .then((res) => res.json())
            .then((obj) => {
              console.log(obj);
              setData(obj);
            });
        }}
      >
        Click Me
      </button>
      <Show when={data() !== undefined}>
        <p>{JSON.stringify(data())}</p>
      </Show>
    </main>
  );
}

/**
 * 2
 * V  >2
 * >>>^
 */
