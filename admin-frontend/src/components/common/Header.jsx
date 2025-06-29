import { useSelector } from "react-redux";

function Header() {
  const firstName = useSelector((state) => state.user.firstName);

  return (
    <div className="w-full bg-gradient-to-br from-[var(--primary-color)] to-[color-mix(in_srgb,var(--primary-color),white_20%)] py-3 shadow-md">
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2">
          <img
            src="/logo-thryve.png"
            alt="Thryve Logo"
            className="h-8 w-8 drop-shadow-md"
          />
          <h1 className="text-2xl font-semibold tracking-wide text-white drop-shadow-sm">
            thryve
          </h1>
        </div>
      </div>

      <div className="my-2 h-[1px] w-full bg-white/30" />
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4">
        <div className="flex items-center gap-2 text-white">
          <span className="text-sm font-medium">Good Morning, {firstName}</span>
        </div>
      </div>
    </div>
  );
}

export default Header;
