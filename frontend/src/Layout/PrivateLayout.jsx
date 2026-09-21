import { Outlet } from "react-router-dom";
import Header from "../components/Common/Header";

const PrivateLayout = () => {
  return (
    <>
      <Header />
      <div className="pt-[72px]">
        <Outlet />
      </div>
    </>
  );
};

export default PrivateLayout;
