import IconOutbound from "~/icons/outbound";

export default function Question(props: { title: string; slug: string }) {
  const url = `https://leetcode.com/problems/${props.slug}/`;
  return (
    <div class="container mx-auto">
      <h3 class="question-title">{props.title}</h3>
      <a role="button" class="btn btn-primary" href={url} target="_blank">
        Solve Problem <IconOutbound />
      </a>
      <div class="flex flex-row gap-p2">
        <button class="btn btn-success">Solved</button>
        <button class="btn btn-warning">Repeat</button>
        <button class="btn btn-error">Failed</button>
      </div>
    </div>
  );
}
