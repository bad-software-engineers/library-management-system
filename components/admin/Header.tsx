import { auth } from '@clerk/nextjs/server'

const Header = async () => {
    const { userId } = await auth()

  return (
    <header>
        <div>
            <h2 className="text-2xl font-bold text-grey-400">
                Welcome, {userId}
            </h2>
            <p className="text-xl text-grey-400">
                Monitor all of your users and books here
            </p>
        </div>
    </header>
  )
}

export default Header