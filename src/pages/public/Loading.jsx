import PortalLayout from "./PortalLayout";
import PublicLayout from "./PublicLayout";

function Loading() {
    return <PublicLayout>
        <div className="flex flex-col gap-4">
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
        </div>
    </PublicLayout>
}

export default Loading;