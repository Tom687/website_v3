import { useState } from 'react'

export default function useInput(initialValue) {
  const [value, setValue] = useState(initialValue)

  const handleChange = (e) => {
    setValue(e.target ? e.target.value : e)
  }

  return {
    value,
    onChange: handleChange,
  }
}