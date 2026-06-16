
const AuthImagePattern = ({ title, subtitle }) => {
  const words = [
    "Realtime",
    "Voice",
    "Images",
    "Profiles",
    "Online",
    "Secure",
    "Media",
    "Instant",
    "Connected",
  ];

  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">

        {/* Feature Grid */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {words.map((word, i) => (
            <div
              key={i}
              className="
                aspect-square
                rounded-3xl

                flex items-center justify-center

                bg-base-100
                border border-base-300

                text-base-content
                font-semibold
                text-sm

                shadow-md

                transition-all duration-300 ease-out

                hover:-translate-y-2
                hover:scale-105
                hover:rotate-1

                hover:bg-primary
                hover:text-primary-content
                hover:border-primary

                hover:shadow-xl
                hover:shadow-primary/20
              "
            >
              {word}
            </div>
          ))}
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold mb-4 text-base-content">
          {title}
        </h2>

        {/* Subtitle */}
        <p className="text-base-content/70 leading-relaxed">
          {subtitle}
        </p>

      </div>
    </div>
  );
};

export default AuthImagePattern;