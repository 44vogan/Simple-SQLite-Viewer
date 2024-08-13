import React from "react";
import { useSelectedTableStore } from "./Store";

interface TableNamesProps {
	tableNames: string[];
}

const TableNames: React.FC<TableNamesProps> = (props: TableNamesProps) => {
	const { selectedTable, setSelectedTable } = useSelectedTableStore();

	return (
		<div className='flex flex-row my-1'>
			{props.tableNames.map((tableName) => (
				<span
					className={`box-border py-1 px-2  m-2 bg-slate-800  rounded-md ${
						tableName === selectedTable
							? "bg-slate-400 cursor-default  border-cyan-50 border-2"
							: "cursor-pointer"
					}`}
					key={tableName}
					onClick={() => setSelectedTable(tableName)}
				>
					{tableName}
				</span>
			))}
		</div>
	);
};

export default TableNames;
