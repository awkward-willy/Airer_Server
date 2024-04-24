type Props = {
  content: String;
};

export default function Title({ content }: Props) {
  return <h1 className="w-full text-4xl font-bold">{content}</h1>;
}
