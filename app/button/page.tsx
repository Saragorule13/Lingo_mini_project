import { Button } from "@/components/ui/button"


const ButtonPage = () => {
  return (
    <div>
      <div className="p-4 space-y-4 flex flex-col max-w-[200px]">
        <Button>Default</Button>
        <Button variant={"primary"}>Primary</Button>
        <Button variant={"primaryOutline"}>Primary Outline</Button>
        <Button variant={"secondary"}>Secondary</Button>
        <Button variant={"secondaryOutline"}>secondary Outline</Button>
        <Button variant={"danger"}>Danger</Button>
        <Button variant={"dangerOutline"}>danger Outline</Button>
        <Button variant={"super"}>Danger</Button>
        <Button variant={"superOutline"}>danger Outline</Button>
        <Button variant={"sidebar"}>Danger</Button>
        <Button variant={"sidebarOutline"}>danger Outline</Button>
        <Button variant={"ghost"}>Ghost</Button>
      </div>
    </div>
  )
}

export default ButtonPage
