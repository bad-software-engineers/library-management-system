import { currentUser } from '@clerk/nextjs/server'
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import Link from 'next/link';

const Header = async () => {
  const user = await currentUser()

  if (!user) return <div>Not signed in</div>

  // const primaryEmailAddress = user.emailAddresses.filter((email) => email.id === user.primaryEmailAddressId);

  return (
    <ClerkProvider
      appearance={{
        variables: {

        },
      }}
    >

      <header className="flex w-full bg-white justify-between px-5 rounded-xl">
        <div className=" py-2 px-4">
          <h2 className="text-2xl font-bold text-grey-400 ">
            Welcome, {user.fullName}
          </h2>
          {/*<p>{primaryEmailAddress[0].emailAddress}</p>*/}
          <p className="text-xl text-grey-400">
            Monitor all of your users and books here
          </p>
        </div>
        <div className="flex items-center justify-center gap-5 pr-4">
          <Link href="/">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
              Go to Home
            </button>
          </Link>

          <div className="scale-125 flex items-center justify-center">
            <UserButton />
          </div>
        </div>

      </header>
    </ClerkProvider>

  )
}

export default Header;