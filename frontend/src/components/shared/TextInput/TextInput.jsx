import React from 'react'
import styles from './TextInput.module.css';


const TextInput = (props) => {
  return (
    <div>
        <input type="text" {...props} className={styles.input} />
    </div>
  )
}

export default TextInput
