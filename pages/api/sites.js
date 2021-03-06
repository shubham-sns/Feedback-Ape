import {authAdmin} from '@/lib/firebase-admin'
import {getUserSites} from '@/lib/db-admin'

export default async (req, res) => {
  try {
    const {uid} = await authAdmin.verifyIdToken(req.headers.token)
    const {sites} = await getUserSites(uid)

    res.status(200).json({sites})
  } catch (error) {
    console.log(error)

    res.status(500).json({error})
  }
}
