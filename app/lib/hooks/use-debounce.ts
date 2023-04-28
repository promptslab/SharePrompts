import { useEffect, useState } from 'react'

const useDebounce = (query: string, delay: number) => {
    const [value, setValue] = useState<string>('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setValue(query)
        }, delay)

        return () => {
            clearTimeout(timer);
        }
    }, [value, delay, query])

    return value
}

export default useDebounce
