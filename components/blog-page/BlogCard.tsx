import { MessageCircle, ThumbsUp } from "lucide-react";

export default function BlogCard() {
  return (
    <div className="group flex flex-col gap-4 border-b border-pink-800/20 m-auto pb-6 cursor-pointer">
      <h1 className="text-3xl line-clamp-2 font-semibold group-hover:text-pink-800 transition-colors ease-in-out">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore debitis
        hic laudantium repellendus cumque et adipisci doloremque vero autem
        nulla, quo voluptatum ducimus illo assumenda, commodi, numquam
        repudiandae tenetur eligendi.
      </h1>
      <p className="text-lg line-clamp-2">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum
        voluptas adipisci repudiandae ipsa magni rem porro expedita nihil eos
        amet totam velit officia error, veritatis corporis perspiciatis deleniti
        cum reprehenderit.
      </p>
      <div className="flex flex-row gap-4 text-sm text-neutral-800/90">
        <div className="flex flex-row gap-2 items-center ">
          <ThumbsUp className="size-4" />
          <p>20k</p>
        </div>
        <div className="flex flex-row gap-2 items-center ">
          <MessageCircle className="size-4" />
          <p>20</p>
        </div>
        <p className="">12-01-2026</p>
      </div>
    </div>
  );
}
