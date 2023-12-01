export default function QuestionSummary(props: {
  title: string;
  slug: string;
}) {
  return (
    <div class="container">
      <p>{props.title}</p>
    </div>
  );
}
