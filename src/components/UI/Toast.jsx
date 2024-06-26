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
        <div className={`fixed bottom-4 right-4 transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0'}`}>
            <div className="alert alert-info p-4 rounded shadow-lg">
                <span>{children}</span>
            </div>
        </div>
    );
}

export default Toast;
