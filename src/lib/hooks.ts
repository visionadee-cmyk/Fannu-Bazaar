import { useEffect, useState } from 'react'
import { getDB, refreshDB, subscribe, enableRealtimeSync, disableRealtimeSync } from './db'
import type { DB } from './types'

export function useDBSnapshot() {
  const [db, setDb] = useState<DB>(() => getDB())

  useEffect(() => {
    setDb(getDB())
    void refreshDB()
    enableRealtimeSync()
    return () => {
      disableRealtimeSync()
    }
  }, [])

  useEffect(() => {
    return subscribe(() => setDb(getDB()))
  }, [])

  return db
}
