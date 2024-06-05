import SortableTable from "../../components/SortableTable";
import Table from "../../components/UI/Table";

function ManuItems() {
    const data = [
        { id: "sadas", time: "2/8/2021", address: 'Hanoi', status: 'Created' },
        { id: "sasfsa", time: "10/8/2021", address: 'Hanoi', status: 'Created' },
        { id: "sasds", time: "12/8/2021", address: 'Hanoi', status: 'Created' },
        { id: "safdgs", time: "14/8/2021", address: 'Hanoi', status: 'Created' },
        { id: "sadsdg", time: "16/8/2021", address: 'Hanoi', status: 'Created' },

    ];
    const config = [
        {
            label: "Mã Item",
            render: (item) => item.id,
            sortValue: (item) => item.id,
        },
        {
            label: "Thời gian tạo",
            render: (item) => item.time,
            sortValue: (item) => item.time,
        },
        {
            label: "Địa điểm hiện tại",
            render: (item) => item.address,
        },
        {
            label: "Trạng thái",
            render: (item) => item.status,
        },
    ];

    const keyFn = (item) => {
        return item.name;
    };

    // console.log(data)
    return <div className="mx-4">
        <div className="w-full">
            <SortableTable data={data} config={config} keyFn={keyFn} />
        </div>
    </div>
}

export default ManuItems