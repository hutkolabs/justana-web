import { ReactNode, useEffect } from "react";

import { createPortal } from "react-dom";

interface PortalProps {
  children: ReactNode;
}

export const Portal: React.FC<PortalProps> = ({ children }) => {
  const mount = document.getElementById("portal-root");
  const el = document.createElement("span");

  useEffect(() => {
    if (mount) {
      mount.appendChild(el);
    }

    return () => {
      if (mount) {
        mount.removeChild(el);
      }
    };
  }, [el, mount]);

  return createPortal(children, el);
};
