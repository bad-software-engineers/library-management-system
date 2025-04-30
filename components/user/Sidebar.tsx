import { User, BookOpen, History, Clock } from "lucide-react"
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
        img: User,
        route: "/user",
        text: "User Info",
    },
    {
        img: BookOpen,
        route: "/user/books",
        text: "All Books",
    },
    {
        img: History,
        route: "/user/transactions",
        text: "Past Transactions",
    },
    {
        img: Clock,
        route: "/user/borrowings",
        text: "Current Borrowings",
    },
];

const UserSidebar = () => {
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

export default UserSidebar; 