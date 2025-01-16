import katex from "katex";

const ShinyLatex = ({
  latex = "",
  disabled = false,
  speed = 6,
  className = "",
}) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`inline-block bg-clip-text text-[#b5b5b5a4] ${disabled ? "" : "animate-shine"} ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(120deg, rgba(255, 255, 255, 0.4) 40%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.4) 60%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        animationDuration: animationDuration,
      }}
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(latex, {
          throwOnError: false,
          output: "mathml",
        }),
      }}
    ></div>
  );
};

export default ShinyLatex;
