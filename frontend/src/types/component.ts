import { FunctionComponent, ReactNode } from "react";

export interface IClassProps {
  className?: string;
  style?: object;
}

export interface IComponentProps extends IClassProps {
  children: ReactNode;
}

export interface IToggleProps extends IClassProps {
  variants: string[];
  onChange: (index: number) => void;
}
