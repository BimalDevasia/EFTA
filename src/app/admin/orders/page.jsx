import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FilterIcon, SearchIcon } from "lucide-react";

const OrderPage = () => {
  return (
    <div className="h-screen min-h-screen grid grid-cols-[auto_215px]">
      <div className="pt-40 pb-4 px-6 space-y-10 flex flex-col overflow-hidden h-full border-r border-gray-200">
        <div className="flex items-center justify-between shrink-0">
          <h1 className="text-[36px] text-[#8300FF] font-bold">Orders</h1>
          <div>
            <form className="flex items-center gap-2">
              <div className="border border-slate-800 rounded-[100vmin] flex items-center">
                <div className="px-2">
                  <SearchIcon />
                </div>
                <input
                  className="rounded-[100vmin] py-2 pl-2 pr-1"
                  type="text"
                  placeholder="search"
                />
              </div>
              <button className="rounded-full p-2 border border-slate-800">
                <FilterIcon className="text-slate-800" />
              </button>
            </form>
          </div>
        </div>
        <OrderData />
      </div>
      <div className="pt-40 space-y-10 h-full overflow-auto px-6">
        <div className="space-y-4">
          <h3 className="text-[#10011F] text-[22px] font-medium">
            Customer Details
          </h3>
          <div className="space-y-2">
            <p>Name: </p>
            <p>Email: </p>
            <p>Phone: </p>
            <p>Address: </p>
          </div>
        </div>

        {/* <div>
          <h3>Order Details</h3>
          <p>Product:</p>
          <p></p>
        </div> */}
      </div>
    </div>
  );
};

const orders = [
  {
    id: "ORD001",
    date: "2023-05-01",
    customerName: "John Doe",
    status: "Delivered",
  },
  {
    id: "ORD002",
    date: "2023-05-02",
    customerName: "Jane Smith",
    status: "Order Placed",
  },
  {
    id: "ORD003",
    date: "2023-05-03",
    customerName: "Mike Johnson",
    status: "Shipped",
  },
  {
    id: "ORD004",
    date: "2023-05-04",
    customerName: "Emily Brown",
    status: "Order Placed",
  },
  {
    id: "ORD005",
    date: "2023-05-05",
    customerName: "David Wilson",
    status: "Delivered",
  },
  {
    id: "ORD006",
    date: "2023-05-06",
    customerName: "Sarah Davis",
    status: "Assigned",
  },
  {
    id: "ORD007",
    date: "2023-05-07",
    customerName: "Tom Anderson",
    status: "Shipped",
  },
  {
    id: "ORD008",
    date: "2023-05-08",
    customerName: "Lisa Taylor",
    status: "Order Placed",
  },
  {
    id: "ORD009",
    date: "2023-05-09",
    customerName: "Chris Martin",
    status: "Delivered",
  },
  {
    id: "ORD010",
    date: "2023-05-10",
    customerName: "Emma White",
    status: "Assigned",
  },
];

function OrderData() {
  return (
    <Table className="flex-1">
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Customer Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id}</TableCell>
            <TableCell>{order.date}</TableCell>
            <TableCell>{order.customerName}</TableCell>
            <TableCell>
              <Select defaultValue={order.status}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem
                    className="hover:bg-gray-500 cursor-pointer"
                    value="Order Placed"
                  >
                    Order Placed
                  </SelectItem>
                  <SelectItem
                    className="hover:bg-gray-500 cursor-pointer"
                    value="Assigned"
                  >
                    Assigned
                  </SelectItem>
                  <SelectItem
                    className="hover:bg-gray-500 cursor-pointer"
                    value="Shipped"
                  >
                    Shipped
                  </SelectItem>
                  <SelectItem
                    className="hover:bg-gray-500 cursor-pointer"
                    value="Delivered"
                  >
                    Delivered
                  </SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default OrderPage;
