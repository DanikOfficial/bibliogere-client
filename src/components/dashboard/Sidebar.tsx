import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { useNavigate } from 'react-router'
import {
  selectCurrentUser,
  selectRole,
  signOut,
} from '../../features/user/userSlice'

import useLinks from '../../utils/links'
import ResponsiveSidebar from './ResponsiveSidebar'
import StandardSidebar from './StandardSidebar'

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const currentUser = useAppSelector(selectCurrentUser)
  const role = useAppSelector(selectRole)

    const links = useLinks(role.nome)

  // TODO: REset app state
  const exit = (): void => {
    dispatch(signOut)
    navigate('/')
  }

  return (
    <>
      <ResponsiveSidebar
        currentUser={currentUser}
        linksArr={links}
        signOut={exit}
      />
      <StandardSidebar
        currentUser={currentUser}
        linksArr={links}
        signOut={exit}
      />
    </>
  )
}

export default Sidebar
