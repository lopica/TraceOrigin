import { useEffect, useState } from 'react';

function Toast({ children, show }) {
    const [visible, setVisible] = useState(show);

    useEffect(() => {
        let timeout;
        if (show) {
            setVisible(true);
        } else {
            timeout = setTimeout(() => setVisible(false), 500); // thời gian trùng với transition Tailwind
        }
        return () => clearTimeout(timeout);
    }, [show]);

    if (!visible) return null;

    return (
        <div className={`fixed bottom-4 right-4 transition-all duration-500 ${show ? 'visible' : 'hidden'} z-30`}>
            <div className="alert alert-info p-5 rounded-box font-bold  text-white bg-green-500">
                <span>{children}</span>
            </div>
        </div>
    );
}

export default Toast;
