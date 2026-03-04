import { useEffect, useState } from 'react'
import { getDB, refreshDB, subscribe } from './db'
import type { DB } from './types'

export function useDBSnapshot() {
  const [db, setDb] = useState<DB>(() => getDB())

  useEffect(() => {
    setDb(getDB())
    void refreshDB()
    return subscribe(() => setDb(getDB()))
  }, [])

  return db
}
