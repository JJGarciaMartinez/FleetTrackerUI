import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { JSX } from 'react'
import { useVehicles, useDrivers, useAlerts, useRoutes } from '@hooks/index.ts'
import './Index.css'
import Header from '@components/layout/header/Header.tsx'
import InfoScreen from '@components/layout/infoScreen/InfoScreen.tsx'
import CardStats from '@components/ui/cardStats/CardStats.tsx'
import AlertList from '@components/ui/alertList/AlertList.tsx'
import { ArrowRightIcon, PlusCircleIcon } from '@phosphor-icons/react'

export default function Dashboard(): JSX.Element {
  const {
    vehicles,
    loading: loadingVehicles,
    error: vehiclesError,
    fetchVehicles,
  } = useVehicles()
  const {
    drivers,
    loading: loadingDrivers,
    error: driversError,
    fetchDrivers,
  } = useDrivers()
  const {
    alerts,
    loading: loadingAlerts,
    error: alertsError,
    fetchAlerts,
    markAsRead,
  } = useAlerts()
  const {
    routes,
    loading: loadingRoutes,
    error: routesError,
    fetchRoutes,
  } = useRoutes()

  useEffect(() => {
    fetchVehicles()
      .then((r) => r)
      .catch((e) => console.error('Error fetching vehicles:', e))
    fetchDrivers()
      .then((r) => r)
      .catch((e) => console.error('Error fetching drivers:', e))
    fetchAlerts()
      .then((r) => r)
      .catch((e) => console.error('Error fetching alerts:', e))
    fetchRoutes()
      .then((r) => r)
      .catch((e) => console.error('Error fetching routes:', e))
  }, [fetchVehicles, fetchDrivers, fetchAlerts, fetchRoutes])

  if (loadingVehicles || loadingDrivers || loadingAlerts || loadingRoutes) {
    return <InfoScreen isLoading />
  }

  if (vehiclesError || driversError || alertsError || routesError) {
    return <InfoScreen isError />
  }

  return (
    <div className="dashboard-container">
      <Header title={'Dashboard'}>
        <Link to="/vehicles/new" className="link-button">
          <p>Nuevo Vehículo</p>
          <PlusCircleIcon size={18} />
        </Link>
      </Header>

      <div className="dashboard-stats">
        <CardStats
          title="Vehículos"
          value={vehicles?.length ?? 0}
          subtitle={
            <p className="see-vehicles">
              Ver listado <ArrowRightIcon />
            </p>
          }
          linkTo="/vehicles"
        />
        <CardStats title="Conductores" value={drivers?.length ?? 0} disabled />
        <CardStats
          title="Alertas"
          value={alerts?.length ?? 0}
          subtitle={`${alerts?.filter((a) => !a.read).length ?? 0} sin leer`}
        />
        <CardStats title="Rutas" value={routes?.length ?? 0} disabled />
      </div>

      <AlertList alerts={alerts ?? []} onMarkAsRead={markAsRead} />
    </div>
  )
}
