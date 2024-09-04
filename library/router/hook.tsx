import { useContext } from 'react'
import { RouterContext } from './router'

export const useRouter = () => {
    const context = useContext(RouterContext)
    if (context) return context
    throw new Error('useRouter must be used within a RouterProvider.')
}
