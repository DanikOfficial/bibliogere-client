import { Outlet } from "react-router";

const RecoverUserWrapper = () => {
    return <section
        id="hero"
        className="
        h-100
        d-flex
        flex-column
        justify-content-center
        align-items-center
      "
    >
        <div className="content-wrapper custom-radius bg-white px-5 py-4">
            <Outlet />
        </div>
    </section>;
}

export default RecoverUserWrapper;

