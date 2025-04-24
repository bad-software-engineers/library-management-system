import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
  } from "@/components/ui/sidebar"

   const items = [
    {
      img: Home,
      route: "/admin",
      text: "Home",
    },
    {
      img: Home,
      route: "/admin/allusers",
      text: "All Users",
    },
    {
      img: Home,
      route: "/admin/allbooks",
      text: "All Books",
    },
    {
      img: Home,
      route: "/admin/book-requests",
      text: "Borrow Requests",
    },
    {
      img: Home,
      route: "/admin/account-requests",
      text: "Account Requests",
    },
  ];

const SideBar = () => {
  return (
    <SidebarProvider>
        <Sidebar>
        <SidebarContent>
            <SidebarGroup>
            <SidebarGroupLabel>BookWise</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.text}>
                    <SidebarMenuButton asChild>
                        <a href={item.route}>
                        <item.img />
                        <span>{item.text}</span>
                        </a>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
                </SidebarMenu>
            </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        </Sidebar>
    </SidebarProvider>
  )
}

export default SideBar