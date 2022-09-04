import { ReactNode, ButtonHTMLAttributes, PropsWithChildren } from 'react'

import './styles.scss'

export function Button(props: PropsWithChildren & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className="button" type="button" {...props} />
}
