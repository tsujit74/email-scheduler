type Props = {
  body: string;
};

export default function EmailBody({ body }: Props) {
  return (
    <article className="border-t border-gray-100 px-5 py-7 sm:px-7 sm:py-8">
      <div className="max-w-3xl">
        <div
          className="
            whitespace-pre-wrap
            break-words
            text-[15px]
            leading-7
            text-gray-800
            sm:text-[16px]
            sm:leading-8
          "
        >
          {body}
        </div>
      </div>
    </article>
  );
}