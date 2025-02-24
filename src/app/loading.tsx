import Loader from "../components/custom/Loaders/MainLoader";

export default function Loading() {
  return (
    <div className="h-screen flex items-center justify-center ">
      <Loader />
    </div>
  );
}
