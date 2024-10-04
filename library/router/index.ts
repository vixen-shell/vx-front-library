import { Routes } from './router'
import { useRouter } from './hook'

const RouterRender = () => Routes.get(useRouter().route)

export type { RouteItemsType as RouteItems } from './router'
export { RouterProvider } from './router'
export { Routes, useRouter, RouterRender }
export { Link } from './Link'
