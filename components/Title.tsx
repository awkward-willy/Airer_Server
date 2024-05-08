type Props = {
  content: String;
};

export default function Title({ content }: Props) {
  return <h1 className="w-full py-2 text-4xl font-bold">{content}</h1>;
}
