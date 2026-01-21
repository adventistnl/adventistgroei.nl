"use client"

import { useInstitution } from "@/contexts/institution-context"

export function InstitutionDebugger() {
  const { institutions, currentInstitutionData, loading, error } = useInstitution()
  
  if (loading) {
    return <div className="p-4 bg-yellow-100 border">🔄 Loading institutions...</div>
  }

  if (error) {
    return <div className="p-4 bg-red-100 border">❌ Error: {error.message}</div>
  }

  return (
    <div className="p-4 bg-green-100 border">
      <h3 className="font-bold">Institution Debug Info:</h3>
      <p>Institutions loaded: {institutions?.length || 0}</p>
      <p>Current institution: {currentInstitutionData?.name || 'None'}</p>
      {institutions?.length > 0 && (
        <div>
          <p>Available institutions:</p>
          <ul className="list-disc ml-4">
            {institutions.map(inst => (
              <li key={inst.id}>{inst.name} ({inst.id})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}