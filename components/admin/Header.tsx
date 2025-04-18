import {  currentUser  } from '@clerk/nextjs/server'
import {ClerkProvider, UserButton} from "@clerk/nextjs";

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
        <div className="scale-150 flex justify-center items-center pr-4">
            <UserButton/>
        </div>
    </header>
      </ClerkProvider>

  )
}

export default Header;