export default function Splash() {
  return (
    <div className="flex flex-col justify-center items-center h-svh w-svw">
      <img 
        src='/logo_full.png' 
        alt="full logo" 
        className="w-3/4 h-auto md:w-1/2 lg:w-1/3 animate-scale-fade" 
      />
    </div>
  );
}
