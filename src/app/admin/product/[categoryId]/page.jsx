import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, FilterIcon, SearchIcon, Trash2 } from "lucide-react";

const ProductDataPage = () => {
  return (
    <div className="pt-40 pb-4 pl-6 space-y-10 flex flex-col h-screen min-h-screen overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-[36px] text-[#8300FF] font-bold">Gift</h1>
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
      <ProductData />
    </div>
  );
};

const products = [
  {
    id: "P001",
    name: "Chocolate Cake",
    category: "Cake",
    type: "Regular",
    exactPrice: 25.99,
    offerPrice: 22.99,
  },
  {
    id: "P002",
    name: "Birthday Gift Box",
    category: "Gift",
    type: "Special",
    exactPrice: 49.99,
    offerPrice: 44.99,
  },
  {
    id: "P003",
    name: "Cupcake Bundle",
    category: "Bundle",
    type: "Assorted",
    exactPrice: 19.99,
    offerPrice: 17.99,
  },
  {
    id: "P004",
    name: "Vanilla Cake",
    category: "Cake",
    type: "Regular",
    exactPrice: 23.99,
    offerPrice: 21.99,
  },
  {
    id: "P005",
    name: "Anniversary Gift Set",
    category: "Gift",
    type: "Special",
    exactPrice: 59.99,
    offerPrice: 54.99,
  },
  {
    id: "P006",
    name: "Pastry Bundle",
    category: "Bundle",
    type: "Assorted",
    exactPrice: 29.99,
    offerPrice: 26.99,
  },
  {
    id: "P007",
    name: "Red Velvet Cake",
    category: "Cake",
    type: "Premium",
    exactPrice: 34.99,
    offerPrice: 31.99,
  },
  {
    id: "P008",
    name: "Chocolate Truffle Cake",
    category: "Cake",
    type: "Premium",
    exactPrice: 39.99,
    offerPrice: 36.99,
  },
  {
    id: "P009",
    name: "Mother's Day Gift Basket",
    category: "Gift",
    type: "Special",
    exactPrice: 69.99,
    offerPrice: 64.99,
  },
  {
    id: "P010",
    name: "Assorted Cookies Bundle",
    category: "Bundle",
    type: "Assorted",
    exactPrice: 24.99,
    offerPrice: 22.99,
  },
  {
    id: "P011",
    name: "Fruit Cake",
    category: "Cake",
    type: "Regular",
    exactPrice: 27.99,
    offerPrice: 25.99,
  },
  {
    id: "P012",
    name: "Valentine's Day Gift Set",
    category: "Gift",
    type: "Special",
    exactPrice: 79.99,
    offerPrice: 74.99,
  },
  {
    id: "P013",
    name: "Breakfast Pastry Bundle",
    category: "Bundle",
    type: "Assorted",
    exactPrice: 32.99,
    offerPrice: 29.99,
  },
  {
    id: "P014",
    name: "Tiramisu Cake",
    category: "Cake",
    type: "Premium",
    exactPrice: 41.99,
    offerPrice: 38.99,
  },
  {
    id: "P015",
    name: "Corporate Gift Box",
    category: "Gift",
    type: "Special",
    exactPrice: 89.99,
    offerPrice: 84.99,
  },
  {
    id: "P016",
    name: "Gluten-Free Dessert Bundle",
    category: "Bundle",
    type: "Assorted",
    exactPrice: 36.99,
    offerPrice: 33.99,
  },
  {
    id: "P017",
    name: "Lemon Drizzle Cake",
    category: "Cake",
    type: "Regular",
    exactPrice: 29.99,
    offerPrice: 27.99,
  },
];

function ProductData() {
  return (
    <Table className="flex-1">
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Exact Price</TableHead>
          <TableHead className="text-right">Offer Price</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.id}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.type}</TableCell>
            <TableCell className="text-right">
              {product.exactPrice.toFixed(2)}
            </TableCell>
            <TableCell className="text-right">
              {product.offerPrice.toFixed(2)}
            </TableCell>
            <TableCell className="text-right space-x-3">
              <button className="mr-2 text-blue-600 hover:text-blue-800">
                <Edit size={24} />
              </button>
              <button className="text-red-600 hover:text-red-800">
                <Trash2 size={24} />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ProductDataPage;
