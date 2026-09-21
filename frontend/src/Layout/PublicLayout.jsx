import { Outlet } from "react-router-dom";
import Header from "../components/Common/Header";
import Footer from "../components/Common/Footer";

const PublicLayout = () => {
  return (
    <>
      <Header />
      <div className="pt-[72px]">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default PublicLayout;
