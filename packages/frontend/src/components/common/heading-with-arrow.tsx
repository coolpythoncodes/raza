import { Icons } from "./icons";

type Props = {
  text: string;
};

const HeadingWithArrow = ({ text }: Props) => {
  return (
    <div className="flex justify-center">
      <h1 className="relative flex w-fit justify-center text-2xl font-normal md:text-[40px] md:leading-10">
        <span>{text}</span>
        <Icons.arrow className="absolute -bottom-5" />
      </h1>
    </div>
  );
};

export default HeadingWithArrow;
