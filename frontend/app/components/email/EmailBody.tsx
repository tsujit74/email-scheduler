type EmailBodyProps = {
  body: string;
};

export default function EmailBody({ body }: EmailBodyProps) {
  return (
    <article className="px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
      <div className="max-w-3xl">
        <p className="whitespace-pre-wrap break-words text-[15px] leading-8 text-gray-700 sm:text-base">
          {body || "This email has no content."}
        </p>
      </div>
    </article>
  );
}