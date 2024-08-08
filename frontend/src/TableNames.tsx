import React from "react";
import { useSelectedTableStore } from "./Store";

interface TableNamesProps {
	tableNames: string[];
}

const TableNames: React.FC<TableNamesProps> = (props: TableNamesProps) => {
	const { selectedTable, setSelectedTable } = useSelectedTableStore();

	return (
		<div className='flex flex-row mt-1'>
			{props.tableNames.map((tableName) => (
				<span
					className={`box-border p-1 px-2 mx-1 bg-slate-700  rounded-sm ${
						tableName === selectedTable
							? "bg-slate-400 cursor-default"
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
