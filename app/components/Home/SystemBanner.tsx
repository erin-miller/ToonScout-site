const SystemBannerType: { [key: string]: string } = {
  INFO: "blue-300",
  WARNING: "orange-300",
  ERROR: "red-300",
};

const SystemBanner = () => {
  const enabled = process.env.NEXT_PUBLIC_SYSTEM_BANNER_ENABLED;
  if (enabled !== "true") return null;

  const type = process.env.NEXT_PUBLIC_SYSTEM_BANNER_TYPE;
  if (!type) return null;

  const msg = process.env.NEXT_PUBLIC_SYSTEM_BANNER_MSG;
  if (!msg) return null;
  return (
    <div
      className={`w-full h-full items-center justify-center bg-${SystemBannerType[type]}`}
    >
      <h1 className="text-gray-1000 dark:text-gray-1200 py-0.3">
        <span className="text-xl font-semibold">{msg}</span>
      </h1>
    </div>
  );
};

export default SystemBanner;
