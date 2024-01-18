import Tab from "./tab"

const TABS = [
    { key: "home", value: "Questions" },
    { key: "tags", value: "Tags" }
]

export default function Sidebar() {
    return (
        <div className="sidebar">
            {
                TABS.map(({ key, value }) => (
                    <Tab key={key} name={key}>{value}</Tab>
                ))
            }
        </div>
    )
}
