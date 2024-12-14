import React, { FunctionComponent, ReactNode } from "react";

interface INavbarLink {
  title: string;
  icon: FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

export interface IRoute extends Partial<INavbarLink> {
  path: string;
  component: (() => ReactNode | JSX.Element) | React.FC;
  isPrivate?: boolean;
}
