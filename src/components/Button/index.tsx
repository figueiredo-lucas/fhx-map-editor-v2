import { ReactNode, ButtonHTMLAttributes } from 'react'

import './styles.scss'

type ButtonProps = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: ButtonProps) {
  return <button className="button" type="button" {...props} />
}
