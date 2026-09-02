import { Outlet } from "react-router-dom";
import Header from "../components/Common/Header";

const PrivateLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default PrivateLayout;
